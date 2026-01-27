import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { DateTime } from 'luxon'

export class EndOsceSessionService extends BaseService {
  static async call(userId, sessionId, sessionData) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    try {
      // Verify session belongs to user
      const session = await prisma.osce_sessions.findFirst({
        where: {
          unique_id: sessionId,
          user_id: userId,
        },
        include: {
          osce_session_topic_snapshot: true,
          osce_session_rubric_snapshots: true,
          osce_session_messages: {
            orderBy: {
              created_at: 'asc',
            },
          },
          osce_session_observations: {
            include: {
              observation_snapshot: {
                include: {
                  group_snapshot: true,
                },
              },
            },
          },
        },
      })

      if (!session) {
        throw new Error('Session not found or access denied')
      }

      if (session.status === 'completed') {
        throw new Error('Session already completed')
      }

      // Save diagnoses
      if (sessionData.diagnoses) {
        await prisma.osce_session_diagnoses.deleteMany({
          where: { osce_session_id: session.id },
        })

        const diagnosesToCreate = []

        if (sessionData.diagnoses.utama && sessionData.diagnoses.utama.trim()) {
          diagnosesToCreate.push({
            osce_session_id: session.id,
            type: 'utama',
            diagnosis: sessionData.diagnoses.utama.trim(),
          })
        }

        if (sessionData.diagnoses.pembanding && Array.isArray(sessionData.diagnoses.pembanding)) {
          sessionData.diagnoses.pembanding.forEach(diagnosis => {
            if (diagnosis && diagnosis.trim()) {
              diagnosesToCreate.push({
                osce_session_id: session.id,
                type: 'pembanding',
                diagnosis: diagnosis.trim(),
              })
            }
          })
        }

        if (diagnosesToCreate.length > 0) {
          await prisma.osce_session_diagnoses.createMany({
            data: diagnosesToCreate,
          })
        }
      }

      // Save therapies
      if (sessionData.therapies && Array.isArray(sessionData.therapies)) {
        await prisma.osce_session_therapies.deleteMany({
          where: { osce_session_id: session.id },
        })

        const therapiesToCreate = sessionData.therapies
          .filter(therapy => therapy && therapy.trim())
          .map((therapy, index) => ({
            osce_session_id: session.id,
            therapy: therapy.trim(),
            order: index,
          }))

        if (therapiesToCreate.length > 0) {
          await prisma.osce_session_therapies.createMany({
            data: therapiesToCreate,
          })
        }
      }

      // Update observations with interpretations
      if (sessionData.observations && Array.isArray(sessionData.observations)) {
        for (const obs of sessionData.observations) {
          if (obs.snapshotId && obs.interpretation) {
            // Find the observation record for this session and snapshot
            const existingObservation = await prisma.osce_session_observations.findFirst({
              where: {
                osce_session_id: session.id,
                observation_snapshot_id: obs.snapshotId,
              },
            })

            if (existingObservation) {
              // Update the interpretation
              await prisma.osce_session_observations.update({
                where: { id: existingObservation.id },
                data: { interpretation: obs.interpretation.trim() },
              })
            }
          }
        }
      }

      // Fetch saved diagnoses and therapies
      const savedDiagnoses = await prisma.osce_session_diagnoses.findMany({
        where: { osce_session_id: session.id },
        orderBy: [
          { type: 'desc' },
          { created_at: 'asc' },
        ],
      })

      const savedTherapies = await prisma.osce_session_therapies.findMany({
        where: { osce_session_id: session.id },
        orderBy: { order: 'asc' },
      })

      const savedObservations = await prisma.osce_session_observations.findMany({
        where: { osce_session_id: session.id },
        include: {
            observation_snapshot: true,
        },
      })

      // Generate AI evaluation with smart batching
      const evaluation = await this._generateAIEvaluation({
        session,
        messages: session.osce_session_messages,
        observations: savedObservations,
        diagnoses: savedDiagnoses,
        therapies: savedTherapies,
      })

      // Calculate time taken (in seconds) using Luxon
      let timeTaken = 0
      if (session.started_at) {
        const startTime = DateTime.fromJSDate(session.started_at, { zone: 'Asia/Jakarta' })
        const endTime = DateTime.now().setZone('Asia/Jakarta')
        const diffInSeconds = endTime.diff(startTime, 'seconds').seconds
        timeTaken = Math.round(diffInSeconds)
        const maxDurationSeconds = session.osce_session_topic_snapshot.duration_minutes * 60
        timeTaken = Math.min(timeTaken, maxDurationSeconds)
      }

      // Update session with final data
      await prisma.osce_sessions.update({
        where: { id: session.id },
        data: {
          total_score: evaluation.totalScore,
          max_score: evaluation.maxScore,
          ai_feedback: JSON.stringify(evaluation.feedback),
          time_taken: timeTaken,
          updated_at: new Date(),
          status: "completed",
        },
      })

      return {
        totalScore: evaluation.totalScore,
        maxScore: evaluation.maxScore,
        percentage: Math.round((evaluation.totalScore / evaluation.maxScore) * 100),
        feedback: evaluation.feedback,
        diagnoses: savedDiagnoses,
        therapies: savedTherapies,
      }
    } catch (error) {
      console.error('[EndOsceSessionService] Error:', error)
      throw error
    }
  }

  static async _generateAIEvaluation({ session, messages, observations, diagnoses, therapies }) {
    try {
      const topicSnapshot = session.osce_session_topic_snapshot
      const model = topicSnapshot.ai_model || 'gemini-2.0-flash'

      // Get AI service from router
      const ModelService = RouterUtils.call(model)
      if (!ModelService) {
        throw new Error(`Model ${model} is not supported`)
      }

      // Get prompts from constants
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: ['osce_practice_chunk_analysis_prompt', 'osce_practice_evaluation_prompt'],
          },
        },
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      const chunkPrompt = constantsMap['osce_practice_chunk_analysis_prompt']
      const finalPrompt = constantsMap['osce_practice_evaluation_prompt']

      if (!chunkPrompt || !finalPrompt) {
        throw new Error('Chunk or final analyzer prompt not found in constants, using fallback')
      }

      const rubric = session.osce_session_rubric_snapshots[0]

      // Extract rubric categories from system prompt (if available)
      const rubricCategories = this._extractRubricCategories(rubric.content || '')

      // Smart batching - process every 30 messages
      const pageSize = 30 // Process 30 messages per chunk
      let lastMessageIndex = 0
      const chunkInsights = []
      let chunkNumber = 1

      // Process messages in chunks
      while (lastMessageIndex < messages.length) {
        const chunkMessages = messages.slice(lastMessageIndex, lastMessageIndex + pageSize)

        if (chunkMessages.length === 0) {
          break
        }

        lastMessageIndex += chunkMessages.length

        // Format messages for AI
        const conversationChunk = chunkMessages
          .map(msg => `${msg.sender_type === 'user' ? 'Dokter' : 'Pasien'}: ${msg.content}`)
          .join('\n')

        // Build chunk analyzer prompt
        const chunkNumberInfo = chunkNumber === 1
          ? '- Ini adalah bagian awal percakapan.'
          : `- Bagian ini melanjutkan dari bagian sebelumnya (Bagian ${chunkNumber - 1}) dan bergantung pada konteks yang telah dibangun sebelumnya.\n- Praktisi mungkin merujuk pada informasi yang telah dibahas di bagian sebelumnya.`

        // Create sample findingsPerArea object for the prompt
        const findingsPerAreaSample = rubricCategories.reduce((acc, category) => {
          acc[category] = `temuan tentang ${category}`
          return acc
        }, {})

        const compiledChunkPrompt = chunkPrompt
          .replace(/\{\{scenario\}\}/g, topicSnapshot.scenario || '')
          .replace(/\{\{context\}\}/g, topicSnapshot.context || '')
          .replace(/\{\{chunkNumber\}\}/g, chunkNumber.toString())
          .replace(/\{\{chunkNumberInitialInformation\}\}/g, chunkNumberInfo)
          .replace(/\{\{rubricCategories\}\}/g, rubricCategories.join(', '))
          .replace(/\{\{conversationChunk\}\}/g, conversationChunk)
          .replace(/\{\{findingsPerArea\}\}/g, JSON.stringify(findingsPerAreaSample, null, 2))

        chunkInsights.push({
          chunkNumber,
          compiledPrompt: compiledChunkPrompt,
        })

        chunkNumber++
      }

      // Run all chunk analyses in parallel
      const chunkAnalysisPromises = chunkInsights.map(async (chunk) => {
        try {
          const response = await ModelService.generateFromText(
            model,
            chunk.compiledPrompt,
            [],
          )

          // Parse JSON response
          let parsedInsight = {}
          try {
            // Try to extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              parsedInsight = JSON.parse(jsonMatch[0])
            }
          } catch (parseError) {
            console.error(`[EndOsceSessionService] Error parsing chunk ${chunk.chunkNumber}:`, parseError)
            parsedInsight = {
              chunkNumber: chunk.chunkNumber,
              summary: [response.substring(0, 200)],
              strengths: [],
              weaknesses: [],
              findingsPerArea: {},
            }
          }

          return {
            ...parsedInsight,
            chunkNumber: chunk.chunkNumber,
          }
        } catch (error) {
          console.error(`[EndOsceSessionService] Error analyzing chunk ${chunk.chunkNumber}:`, error)
          return {
            chunkNumber: chunk.chunkNumber,
            summary: ['Error processing chunk'],
            strengths: [],
            weaknesses: [],
            findingsPerArea: {},
          }
        }
      })

      const analyzedChunks = await Promise.all(chunkAnalysisPromises)
      console.log(analyzedChunks)

      // Combine insights from all chunks
      const combinedSummary = analyzedChunks
        .map(chunk => `BAGIAN ${chunk.chunkNumber}:\n${(chunk.summary || []).map(s => `- ${s}`).join('\n')}`)
        .join('\n\n')

      const combinedStrength = [...new Set(analyzedChunks.flatMap(chunk => chunk.strengths || []))]
        .map(s => `- ${s}`)
        .join('\n')

      const combinedWeakness = [...new Set(analyzedChunks.flatMap(chunk => chunk.weaknesses || []))]
        .map(w => `- ${w}`)
        .join('\n')

      // Combine findings per area from all chunks
      const combinedFindings = {}
      console.log(rubricCategories)
      rubricCategories.forEach(category => {
        const categoryFindings = analyzedChunks
          .map(chunk => chunk.findingsPerArea?.[category])
          .filter(Boolean)

        combinedFindings[category] = categoryFindings.length > 0
          ? categoryFindings.map(finding => `\n       • ${finding}`).join('')
          : 'Tidak ada temuan'
      })

      const combinedFindingsFormatted = rubricCategories
        .map(category => {
          const displayCategory = category.charAt(0).toUpperCase() + category.slice(1)
          return `- ${displayCategory}: ${combinedFindings[category] || 'Tidak ada temuan'}`
        })
        .join('\n')

      // Build observations info
      const supportingObservations = observations
        .filter(obs => obs.observation_snapshot?.requires_interpretation)
        .map(obs => {
          const obsName = obs.observation_snapshot?.observation_name || 'Unknown'
          const needsInterpretation = obs.observation_snapshot?.requires_interpretation ? 'BUTUH INTERPRETASI' : 'TIDAK BUTUH INTERPRETASI'
          return `- ${obsName} (${needsInterpretation})`
        })
        .join('\n')

      const userAnswerSupportingObservations = observations
        .map(obs => {
          const obsName = obs.observation_snapshot?.observation_name || 'Unknown'
          const interpretation = obs.interpretation || 'Tidak ada interpretasi'
          return `- ${obsName} - ${interpretation}`
        })
        .join('\n')

    console.log(observations)

      // Build diagnosis info
      const mainDiagnosis = diagnoses.find(d => d.type === 'utama')
      const differentialDiagnoses = diagnoses.filter(d => d.type === 'pembanding')

      const userAnswerDiagnosis = mainDiagnosis?.diagnosis
        ? `- ${mainDiagnosis.diagnosis}`
        : 'Tidak ada jawaban atas diagnosa kerja'

      const userAnswerDifferentialAnalysis = differentialDiagnoses.length > 0
        ? differentialDiagnoses.map(d => `- ${d.diagnosis}`).join('\n')
        : 'Tidak ada jawaban atas diagnosa banding'

      // Build therapy info
      const userAnswerPrescriptions = therapies.length > 0
        ? therapies.map(t => `- ${t.therapy}`).join('\n')
        : 'Tidak ada jawaban atas terapi'

      // Answer key from snapshot
      const answerKey = topicSnapshot.answer_key || 'Tidak ada kunci jawaban'

      // Build final analyzer prompt
      const compiledFinalPrompt = finalPrompt
        .replace(/\{\{evaluationPrompt\}\}/g, rubric.content || '')
        .replace(/\{\{context\}\}/g, topicSnapshot.context || '')
        .replace(/\{\{task\}\}/g, topicSnapshot.guide || '')
        .replace(/\{\{knowledgeBase\}\}/g, topicSnapshot.knowledge_base ? JSON.stringify(topicSnapshot.knowledge_base) : '')
        .replace(/\{\{answerKey\}\}/g, answerKey)
        .replace(/\{\{chunkInsightsTotal\}\}/g, analyzedChunks.length.toString())
        .replace(/\{\{combinedSummary\}\}/g, combinedSummary || 'Tidak ada ringkasan')
        .replace(/\{\{combinedStrength\}\}/g, combinedStrength || 'Tidak ada kekuatan yang teridentifikasi')
        .replace(/\{\{combinedWeakness\}\}/g, combinedWeakness || 'Tidak ada kelemahan yang teridentifikasi')
        .replace(/\{\{combinedFindings\}\}/g, combinedFindingsFormatted || 'Tidak ada temuan')
        .replace(/\{\{supportingObservations\}\}/g, supportingObservations || 'Tidak ada pemeriksaan penunjang')
        .replace(/\{\{userAnswerSupportingObservations\}\}/g, userAnswerSupportingObservations || 'Tidak ada pilihan atas data penunjang')
        .replace(/\{\{userAnswerDiagnosis\}\}/g, userAnswerDiagnosis)
        .replace(/\{\{userAnswerDifferentialAnalysis\}\}/g, userAnswerDifferentialAnalysis)
        .replace(/\{\{userAnswerPrescriptions\}\}/g, userAnswerPrescriptions)

      // Run final analysis
      const finalResponse = await ModelService.generateFromText(
        model,
        compiledFinalPrompt,
        [],
      )

      // Parse final evaluation
      let evaluationData = {}
      try {
        const jsonMatch = finalResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          evaluationData = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        console.error('[EndOsceSessionService] Error parsing final evaluation:', parseError)
        throw new parseError
      }

      // Calculate total score from criteria array
      let totalScore = 0
      let maxScore = 100

      if (evaluationData.criteria && Array.isArray(evaluationData.criteria)) {
        totalScore = evaluationData.criteria.reduce((sum, criterion) => {
          const weightedScore = (criterion.score / criterion.maxScore) * criterion.weight
          return sum + weightedScore
        }, 0)

        maxScore = evaluationData.criteria.reduce((sum, criterion) => sum + criterion.weight, 0)
      }

      return {
        totalScore: Math.round(totalScore),
        maxScore: maxScore,
        feedback: evaluationData.feedback || evaluationData.criteria || 'Evaluasi tidak tersedia',
        breakdown: evaluationData.criteria || null,
      }
    } catch (error) {
      console.error('[EndOsceSessionService._generateAIEvaluation] Error:', error)
      throw new error
    }
  }

  /**
   * Extract rubric categories from system prompt
   * Looks for lines like "1. CATEGORY_NAME (Bobot:"
   */
  static _extractRubricCategories(systemPrompt) {
    if (!systemPrompt) return []

    const categories = []
    const lines = systemPrompt.split('\n')

    for (const line of lines) {
      // Match pattern like: "1. ANAMNESIS (Bobot:"
      const match = line.match(/^\d+\.\s+([A-Z\s&]+)\s+\(Bobot:/i)
      if (match && match[1]) {
        categories.push(match[1].trim().toLowerCase())
      }
    }

    // Default categories if none found
    return categories.length > 0 ? categories : ['anamnesis', 'pemeriksaan fisik', 'diagnosis', 'terapi']
  }
}
