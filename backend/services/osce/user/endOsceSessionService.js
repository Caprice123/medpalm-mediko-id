import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { DateTime } from 'luxon'
import { ValidationError } from '#errors/validationError'

export class EndOsceSessionService extends BaseService {
  static async call(userId, sessionId, sessionData) {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    if (!sessionId) {
      throw new ValidationError('Session ID is required')
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
          osce_session_tag_snapshots: {
            include: {
              tags: {
                include: {
                  tag_group: true,
                },
              },
            },
          },
          osce_session_messages: {
            orderBy: {
              id: 'asc',
            },
          },
          osce_session_physical_interactions: {
            orderBy: {
              id: 'asc',
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
        throw new ValidationError('Session not found or access denied')
      }

      // If session is already completed, return the existing results
      if (session.status === 'completed') {
        const savedDiagnosis = await prisma.osce_session_diagnoses.findUnique({
          where: { osce_session_id: session.id },
        })

        const savedTherapy = await prisma.osce_session_therapies.findUnique({
          where: { osce_session_id: session.id },
        })

        const aiFeedback = session.ai_feedback ? JSON.parse(session.ai_feedback) : null

        return {
          totalScore: session.total_score,
          maxScore: session.max_score,
          percentage: Math.round((session.total_score / session.max_score) * 100),
          feedback: aiFeedback,
          diagnosis: savedDiagnosis?.diagnosis || { utama: '', pembanding: [] },
          therapy: savedTherapy?.therapy || '',
        }
      }

      // Save diagnoses as JSONB
      if (sessionData.diagnoses) {
        // Check if session has psikiatri tag
        const hasPsikiatriTag = session.osce_session_tag_snapshots?.some(tagSnapshot => {
          const tagName = tagSnapshot.tags?.name?.toLowerCase()
          const tagGroupName = tagSnapshot.tags?.tag_group?.name?.toLowerCase()
          return tagGroupName === 'topic' && tagName === 'psikiatri'
        })

        let utamaData
        if (hasPsikiatriTag) {
          // For psikiatri: utama is array
          utamaData = Array.isArray(sessionData.diagnoses.utama)
            ? sessionData.diagnoses.utama.filter(d => d && d.trim()).map(d => d.trim())
            : []
        } else {
          // For non-psikiatri: utama is string
          utamaData = typeof sessionData.diagnoses.utama === 'string'
            ? sessionData.diagnoses.utama.trim()
            : ''
        }

        const diagnosisData = {
          utama: utamaData,
          pembanding: Array.isArray(sessionData.diagnoses.pembanding)
            ? sessionData.diagnoses.pembanding.filter(d => d && d.trim()).map(d => d.trim())
            : [],
        }

        await prisma.osce_session_diagnoses.upsert({
          where: { osce_session_id: session.id },
          create: {
            osce_session_id: session.id,
            diagnosis: diagnosisData,
          },
          update: {
            diagnosis: diagnosisData,
          },
        })
      }

      // Save therapy as JSONB string
      if (sessionData.therapies !== undefined) {
        const therapyData = typeof sessionData.therapies === 'string'
          ? sessionData.therapies.trim()
          : ''

        await prisma.osce_session_therapies.upsert({
          where: { osce_session_id: session.id },
          create: {
            osce_session_id: session.id,
            therapy: therapyData,
          },
          update: {
            therapy: therapyData,
          },
        })
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
      const savedDiagnosis = await prisma.osce_session_diagnoses.findUnique({
        where: { osce_session_id: session.id },
      })

      const savedTherapy = await prisma.osce_session_therapies.findUnique({
        where: { osce_session_id: session.id },
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
        physicalExamMessages: session.osce_session_physical_interactions,
        observations: savedObservations,
        diagnosis: savedDiagnosis?.diagnosis || { utama: '', pembanding: [] },
        therapy: savedTherapy?.therapy || '',
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
        diagnosis: savedDiagnosis?.diagnosis || { utama: '', pembanding: [] },
        therapy: savedTherapy?.therapy || '',
      }
    } catch (error) {
      console.error('[EndOsceSessionService] Error:', error)
      throw error
    }
  }

  static async _generateAIEvaluation({ session, messages, physicalExamMessages, observations, diagnosis, therapy }) {
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
            in: [
              'osce_practice_flexible_chunk_analysis_prompt',
              'osce_practice_evaluation_prompt'
            ],
          },
        },
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      const chunkPrompt = constantsMap['osce_practice_flexible_chunk_analysis_prompt']
      const finalPrompt = constantsMap['osce_practice_evaluation_prompt']

      console.log(!chunkPrompt)
      console.log(!finalPrompt)
      if (!chunkPrompt || !finalPrompt) {
        throw new Error('Evaluation prompts not found in constants')
      }


      const rubric = session.osce_session_rubric_snapshots[0]

      // Combine conversation and physical exam messages in chronological order
      const allMessages = [...messages, ...(physicalExamMessages || [])]
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

      // Smart batching - process every 30 messages
      const pageSize = 30 // Process 30 messages per chunk
      let lastMessageIndex = 0
      const chunkInsights = []
      let chunkNumber = 1

      // Process messages in chunks
      while (lastMessageIndex < allMessages.length) {
        const chunkMessages = allMessages.slice(lastMessageIndex, lastMessageIndex + pageSize)

        if (chunkMessages.length === 0) {
          break
        }

        lastMessageIndex += chunkMessages.length

        // Format messages for AI (handle both conversation and physical exam)
        const conversationChunk = chunkMessages
          .map(msg => {
            const isPhysicalExam = msg.hasOwnProperty('message') // Physical exam uses 'message' field
            const content = isPhysicalExam ? msg.message : msg.content

            if (msg.sender_type === 'user') {
              return isPhysicalExam
                ? `Dokter (Pemeriksaan Fisik): ${content}`
                : `Dokter (Anamnesis): ${content}`
            } else {
              return isPhysicalExam
                ? `Temuan Fisik: ${content}`
                : `Pasien: ${content}`
            }
          })
          .join('\n')

        // Build chunk analyzer prompt with flexible format
        const chunkNumberInfo = chunkNumber === 1
          ? 'Ini adalah bagian awal interaksi.'
          : `Ini adalah bagian ke-${chunkNumber}. Bagian ini melanjutkan dari bagian sebelumnya dan mungkin merujuk pada informasi yang telah dibahas sebelumnya.`

        // Build knowledge base string
        let knowledgeBase = ""
        if (topicSnapshot?.knowledge_base) {
          knowledgeBase = "**BASIS PENGETAHUAN REFERENSI:**\n" +
            `${topicSnapshot.knowledge_base.map(kb => `[${kb.key}]\n${kb.value}`).join('\n\n')}`
        }

        const compiledChunkPrompt = chunkPrompt
          .replace(/\{\{rubricContent\}\}/g, rubric.content || '')
          .replace(/\{\{scenario\}\}/g, topicSnapshot.scenario || '')
          .replace(/\{\{context\}\}/g, topicSnapshot.context || '')
          .replace(/\{\{knowledgeBase\}\}/g, knowledgeBase)
          .replace(/\{\{chunkNumber\}\}/g, chunkNumber.toString())
          .replace(/\{\{chunkNumberInfo\}\}/g, chunkNumberInfo)
          .replace(/\{\{conversationChunk\}\}/g, conversationChunk)

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
            // Try to extract JSON from response (handle markdown code blocks)
            let jsonText = response
            const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
            if (codeBlockMatch) {
              jsonText = codeBlockMatch[1]
            } else {
              const jsonMatch = response.match(/\{[\s\S]*\}/)
              if (jsonMatch) {
                jsonText = jsonMatch[0]
              }
            }
            parsedInsight = JSON.parse(jsonText)
          } catch (parseError) {
            console.error(`[EndOsceSessionService] Error parsing chunk ${chunk.chunkNumber}:`, parseError)
            console.error('Response was:', response.substring(0, 500))
            parsedInsight = {
              chunkNumber: chunk.chunkNumber,
              summary: ['Error parsing chunk response'],
              strengths: [],
              weaknesses: [],
              rubricObservations: {},
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
            rubricObservations: {},
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

      // Combine rubric observations from all chunks
      // Collect all unique rubric aspects mentioned across all chunks
      const allRubricAspects = new Set()
      analyzedChunks.forEach(chunk => {
        if (chunk.rubricObservations) {
          Object.keys(chunk.rubricObservations).forEach(aspect => {
            allRubricAspects.add(aspect)
          })
        }
      })

      // Combine observations for each rubric aspect
      const combinedRubricObservations = {}
      allRubricAspects.forEach(aspect => {
        const aspectObservations = analyzedChunks
          .map(chunk => chunk.rubricObservations?.[aspect])
          .filter(Boolean)

        combinedRubricObservations[aspect] = aspectObservations.length > 0
          ? aspectObservations.map(obs => `  • ${obs}`).join('\n')
          : 'Tidak ada observasi'
      })

      // Format for prompt
      const combinedObservationsFormatted = Array.from(allRubricAspects)
        .map(aspect => {
          return `${aspect}:\n${combinedRubricObservations[aspect]}`
        })
        .join('\n\n')

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
      let userAnswerDiagnosis
      if (Array.isArray(diagnosis?.utama)) {
        // Psikiatri: utama is array
        userAnswerDiagnosis = diagnosis.utama.length > 0
          ? diagnosis.utama.map(d => `- ${d}`).join('\n')
          : 'Tidak ada jawaban atas diagnosa kerja'
      } else {
        // Non-psikiatri: utama is string
        userAnswerDiagnosis = diagnosis?.utama
          ? `- ${diagnosis.utama}`
          : 'Tidak ada jawaban atas diagnosa kerja'
      }

      const userAnswerDifferentialAnalysis = diagnosis?.pembanding && diagnosis.pembanding.length > 0
        ? diagnosis.pembanding.map(d => `- ${d}`).join('\n')
        : 'Tidak ada jawaban atas diagnosa banding'

      // Build therapy info
      const userAnswerPrescriptions = therapy && therapy.trim()
        ? therapy
        : 'Tidak ada jawaban atas terapi'

      // Answer key from snapshot
      const answerKey = topicSnapshot.answer_key || 'Tidak ada kunci jawaban'

      // Build final analyzer prompt
      let knowledgeBase = ""
      if (topicSnapshot?.knowledge_base) {
          knowledgeBase = "Basis Pengetahuan Referensi (hanya untuk konteks):\n" +
            `${topicSnapshot?.knowledge_base.map(kb => `[${kb.key}]\n${kb.value}`).join('\n\n')}\n` +
            "Basis pengetahuan ini disediakan hanya sebagai informasi referensi untuk membantu Anda memahami skenario klinis dan memberikan respons yang relevan.\n"
      }

      const compiledFinalPrompt = finalPrompt
        .replace(/\{\{evaluationPrompt\}\}/g, rubric.content || '')
        .replace(/\{\{context\}\}/g, topicSnapshot.context || '')
        .replace(/\{\{task\}\}/g, topicSnapshot.guide || '')
        .replace(/\{\{knowledgeBase\}\}/g, knowledgeBase)
        .replace(/\{\{answerKey\}\}/g, answerKey)
        .replace(/\{\{chunkInsightsTotal\}\}/g, analyzedChunks.length.toString())
        .replace(/\{\{combinedSummary\}\}/g, combinedSummary || 'Tidak ada ringkasan')
        .replace(/\{\{combinedStrength\}\}/g, combinedStrength || 'Tidak ada kekuatan yang teridentifikasi')
        .replace(/\{\{combinedWeakness\}\}/g, combinedWeakness || 'Tidak ada kelemahan yang teridentifikasi')
        .replace(/\{\{combinedFindings\}\}/g, combinedObservationsFormatted || 'Tidak ada observasi')
        .replace(/\{\{combinedObservations\}\}/g, combinedObservationsFormatted || 'Tidak ada observasi')
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
        throw parseError
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
      throw error
    }
  }

  /**
   * [DEPRECATED] Extract rubric categories from system prompt
   * No longer used with flexible chunk analysis approach.
   * AI now determines relevant categories from rubric content automatically.
   */
  // static _extractRubricCategories(systemPrompt) {
  //   if (!systemPrompt) return []
  //   const categories = []
  //   const lines = systemPrompt.split('\n')
  //   for (const line of lines) {
  //     const match = line.match(/^\d+\.\s+([A-Z\s&]+)\s+\(Bobot:/i)
  //     if (match && match[1]) {
  //       categories.push(match[1].trim().toLowerCase())
  //     }
  //   }
  //   return categories.length > 0 ? categories : ['anamnesis', 'pemeriksaan fisik', 'diagnosis', 'terapi']
  // }
}
