import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { GoogleGenerativeAI } from '@google/generative-ai'

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
          osce_topic: {
            include: {
              osce_topic_observations: {
                include: {
                  observation: {
                    include: {
                      group: true,
                    },
                  },
                },
              },
            },
          },
          osce_session_messages: {
            orderBy: {
              created_at: 'asc',
            },
          },
          osce_session_observations: {
            include: {
              osce_observation: {
                include: {
                  group: true,
                },
              },
            },
          },
        },
      })

      if (!session) {
        throw new Error('Session not found or access denied')
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

      // Get observations for evaluation
      const observations = await prisma.osce_session_observations.findMany({
        where: { osce_session_id: session.id },
        include: {
          osce_observation: {
            include: {
              group: true,
            },
          },
        },
      })

      // Generate AI evaluation
      const evaluation = await this._generateAIEvaluation({
        topic: session.osce_topic,
        messages: session.osce_session_messages,
        observations: observations,
        diagnoses: savedDiagnoses,
        therapies: savedTherapies,
      })

      // Update session with final data
      await prisma.osce_sessions.update({
        where: { id: session.id },
        data: {
          total_score: evaluation.totalScore,
          max_score: evaluation.maxScore,
          ai_feedback: evaluation.feedback,
          updated_at: new Date(),
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

  static async _generateAIEvaluation({ topic, messages, observations, diagnoses, therapies }) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

      // Build conversation summary
      const conversationSummary = messages
        .map(msg => `${msg.sender_type === 'user' ? 'Dokter' : 'Pasien'}: ${msg.content}`)
        .join('\n')

      // Build observations checklist
      const observationsList = observations
        .map(obs => `- [${obs.is_checked ? 'X' : ' '}] ${obs.osce_observation.group?.name || ''}: ${obs.osce_observation.name}${obs.notes ? ` (Catatan: ${obs.notes})` : ''}`)
        .join('\n')

      // Build diagnosis info
      const mainDiagnosis = diagnoses.find(d => d.type === 'utama')
      const differentialDiagnoses = diagnoses.filter(d => d.type === 'pembanding')

      const diagnosisInfo = `
Diagnosa Utama: ${mainDiagnosis?.diagnosis || 'Tidak ada'}
Diagnosa Pembanding:
${differentialDiagnoses.map((d, i) => `${i + 1}. ${d.diagnosis}`).join('\n') || '- Tidak ada'}
`

      // Build therapy info
      const therapyInfo = therapies.length > 0
        ? therapies.map((t, i) => `${i + 1}. ${t.therapy}`).join('\n')
        : 'Tidak ada terapi yang diberikan'

      // Create evaluation prompt
      const evaluationPrompt = `
Anda adalah penilai OSCE (Objective Structured Clinical Examination) yang ahli. Evaluasi performa mahasiswa kedokteran berdasarkan data berikut:

**SKENARIO KASUS:**
${topic.scenario}

**PERCAKAPAN DENGAN PASIEN:**
${conversationSummary}

**OBSERVASI YANG DILAKUKAN:**
${observationsList}

**DIAGNOSA YANG DIBERIKAN:**
${diagnosisInfo}

**TERAPI YANG DIBERIKAN:**
${therapyInfo}

Berdasarkan data di atas, lakukan evaluasi komprehensif dengan kriteria:

1. **Anamnesis (30 poin)**: Kualitas pertanyaan, kelengkapan informasi, empati dan komunikasi
2. **Pemeriksaan Fisik (20 poin)**: Observasi yang dilakukan (checked items)
3. **Diagnosis (25 poin)**: Ketepatan diagnosis utama dan pembanding
4. **Terapi (25 poin)**: Ketepatan dan kelengkapan terapi

**FORMAT OUTPUT (JSON):**
{
  "totalScore": <total skor dari 100>,
  "maxScore": 100,
  "breakdown": {
    "anamnesis": <skor dari 30>,
    "pemeriksaan": <skor dari 20>,
    "diagnosis": <skor dari 25>,
    "terapi": <skor dari 25>
  },
  "feedback": "<feedback lengkap dalam bahasa Indonesia dengan detail untuk setiap aspek, saran perbaikan, dan kekuatan yang ditunjukkan>"
}

Berikan evaluasi yang objektif, konstruktif, dan edukatif.
`

      const result = await model.generateContent(evaluationPrompt)
      const response = result.response.text()

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Failed to parse AI evaluation response')
      }

      const evaluationData = JSON.parse(jsonMatch[0])

      return {
        totalScore: evaluationData.totalScore || 0,
        maxScore: evaluationData.maxScore || 100,
        feedback: evaluationData.feedback || 'Evaluasi tidak tersedia',
        breakdown: evaluationData.breakdown,
      }
    } catch (error) {
      console.error('[EndOsceSessionService._generateAIEvaluation] Error:', error)

      // Return default evaluation if AI fails
      return {
        totalScore: 0,
        maxScore: 100,
        feedback: 'Maaf, evaluasi otomatis tidak dapat diproses. Silakan hubungi instruktur untuk evaluasi manual.',
        breakdown: null,
      }
    }
  }
}
