import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'

export class GenerateDiagramService extends BaseService {
  static async call({ tabId, userId, diagramConfig }) {
    const { type, detailLevel, orientation, layoutStyle, description } = diagramConfig

    // Validate required fields
    if (!description || !description.trim()) {
        throw new ValidationError('Deskripsi diagram tidak boleh kosong')
    }

    if (!type) {
        throw new ValidationError('Tipe diagram tidak boleh kosong')
    }

    // Verify ownership through the set
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId
      },
      include: {
        skripsi_set: true
      }
    })

    if (!tab || tab.skripsi_set.user_id !== userId) {
      throw new NotFoundError('Tab not found')
    }

    // Verify tab type is diagram_builder
    if (tab.tab_type !== 'diagram_builder') {
      throw new ValidationError('This tab is not a diagram builder tab')
    }

    // Fetch constants for access control
    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'skripsi_is_active',
            'skripsi_access_type',
            'skripsi_diagram_builder_enabled',
            'skripsi_diagram_builder_cost'
          ]
        }
      }
    })
    const constantsMap = {}
    constants.forEach(c => { constantsMap[c.key] = c.value })

    // Check if feature is globally active
    const featureActive = constantsMap.skripsi_is_active === 'true'
    if (!featureActive) {
      throw new ValidationError('Fitur Skripsi Builder sedang tidak aktif. Silakan coba beberapa saat lagi')
    }

    // Check if diagram builder is enabled
    const diagramBuilderEnabled = constantsMap.skripsi_diagram_builder_enabled === 'true'
    if (!diagramBuilderEnabled) {
      throw new ValidationError('Fitur Diagram Builder sedang tidak aktif')
    }

    // Check user access based on access type
    const accessType = constantsMap.skripsi_access_type || 'subscription'
    const requiresSubscription = accessType === 'subscription' || accessType === 'subscription_and_credits'
    const requiresCredits = accessType === 'credits' || accessType === 'subscription_and_credits'

    // For subscription_and_credits: subscribers get free access, non-subscribers need credits
    let diagramCost = 0
    let hasSubscription = false

    if (requiresSubscription) {
      hasSubscription = await HasActiveSubscriptionService.call(userId)

      // If subscription_and_credits mode and user has subscription, they get free access
      if (accessType === 'subscription_and_credits' && hasSubscription) {
        // Free for subscribers, skip credit check
      } else if (!hasSubscription && accessType === 'subscription') {
        // Subscription only mode and no subscription
        throw new ValidationError('Anda memerlukan langganan aktif untuk menggunakan fitur Diagram Builder')
      }
    }

    // Check credits if required (and not bypassed by subscription)
    if (requiresCredits && (!hasSubscription || accessType === 'credits')) {
      diagramCost = parseFloat(constantsMap.skripsi_diagram_builder_cost) || 0

      if (diagramCost > 0) {
        // Get user's credit balance
        const userCredit = await prisma.user_credits.findUnique({
          where: { user_id: userId }
        })

        if (!userCredit || userCredit.balance < diagramCost) {
          throw new ValidationError(`Kredit tidak cukup. Anda memerlukan ${diagramCost} kredit untuk membuat diagram`)
        }
      }
    }

    // Get diagram builder constants (model and system prompts)
    const diagramConstants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'skripsi_diagram_builder_model',
            'skripsi_diagram_builder_content_prompt',
            'skripsi_diagram_builder_format_prompt',
            'skripsi_diagram_builder_example_format'
          ]
        }
      }
    })

    const diagramConstantsMap = {}
    diagramConstants.forEach(c => { diagramConstantsMap[c.key] = c.value })

    const modelName = diagramConstantsMap.skripsi_diagram_builder_model || 'gemini-2.0-flash-exp'
    let contentPrompt = diagramConstantsMap.skripsi_diagram_builder_content_prompt
    let formatPrompt = diagramConstantsMap.skripsi_diagram_builder_format_prompt
    const exampleFormat = diagramConstantsMap.skripsi_diagram_builder_example_format

    if (!contentPrompt) {
      throw new ValidationError('Content prompt untuk Diagram Builder belum dikonfigurasi')
    }
    if (!formatPrompt) {
      throw new ValidationError('Format prompt untuk Diagram Builder belum dikonfigurasi')
    }
    if (!exampleFormat) {
      throw new ValidationError('Example format untuk Diagram Builder belum dikonfigurasi')
    }

    // Get AI service from router
    const ModelService = RouterUtils.call(modelName)
    if (!ModelService) {
      throw new ValidationError(`Model ${modelName} tidak didukung`)
    }

    // STAGE 1: Generate structured content
    const contentTemplateData = {
        detailLevel: detailLevel,
        description: description,
    }

    Object.entries(contentTemplateData).forEach(([key, value]) => {
        contentPrompt = contentPrompt.replaceAll(`{{${key}}}`, value)
    });

    console.log('=== STAGE 1: Generating Content ===')
    console.log('Model:', modelName)
    console.log('Content Prompt:', contentPrompt)

    let contentResponse = await ModelService.generateFromText(
        modelName,
        contentPrompt,
        [],
    )

    console.log('=== Content Response ===')
    console.log(contentResponse)

    contentResponse = contentResponse.replaceAll('```json', '').replaceAll('```', '')

    // Parse content response
    const contentData = JSON.parse(contentResponse)

    // STAGE 2: Convert content to Excalidraw format
    const formatTemplateData = {
        orientation: orientation,
        layoutStyle: layoutStyle,
        content: JSON.stringify(contentData, null, 2),
        exampleFormat: exampleFormat,
    }

    Object.entries(formatTemplateData).forEach(([key, value]) => {
        formatPrompt = formatPrompt.replaceAll(`{{${key}}}`, value)
    });

    const formatType = "mermaid"
    console.log(`=== STAGE 2: Formatting to ${formatType.toUpperCase()} ===`)
    console.log('Format Prompt:', formatPrompt)

    let formatResponse = await ModelService.generateFromText(
        modelName,
        formatPrompt,
        [],
    )

    console.log('=== FORMAT RESPONSE START ===')
    console.log(formatResponse)
    console.log('=== FORMAT RESPONSE END ===')

    let diagramData;
    let mermaidText

    if (formatType === 'mermaid') {
      // Handle Mermaid format
      mermaidText = formatResponse
        .replaceAll('```mermaid', '')
        .replaceAll('```', '')
        .trim()

      console.log('=== CLEANED MERMAID ===')
      console.log(mermaidText)
    } else {
      // Handle Excalidraw JSON format
      let fullResponse = formatResponse.replaceAll("```json", "").replaceAll("```", "")
      console.log('Response type:', typeof fullResponse, 'Length:', fullResponse?.length)
      diagramData = fullResponse
    }

      // Deduct credits if cost > 0
      if (diagramCost > 0) {
        // Get current balance
        const userCredit = await prisma.user_credits.findUnique({
          where: { user_id: userId }
        })

        const balanceBefore = userCredit ? parseFloat(userCredit.balance.toString()) : 0
        const balanceAfter = balanceBefore - diagramCost

        // Deduct credits
        await prisma.user_credits.update({
          where: { user_id: userId },
          data: {
            balance: { decrement: diagramCost }
          }
        })

        // Log credit transaction
        await prisma.credit_transactions.create({
          data: {
            user_id: userId,
            user_credit_id: userCredit.id,
            amount: -diagramCost,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            type: 'deduction',
            description: `Diagram Builder - ${type}`
          }
        })
      }

      // Update tab and set timestamps
      await prisma.skripsi_tabs.update({
        where: { id: tabId },
        data: { updated_at: new Date() }
      })

      await prisma.skripsi_sets.update({
        where: { id: tab.set_id },
        data: { updated_at: new Date() }
      })

      return mermaidText
  }
}
