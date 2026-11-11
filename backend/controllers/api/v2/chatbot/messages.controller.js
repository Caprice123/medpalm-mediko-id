import { GetMessagesService } from '#services/chatbot/getMessagesService'
import { SubmitFeedbackService } from '#services/chatbot/submitFeedbackService'
import { FinalizeMessageService } from '#services/chatbot/finalizeMessageService'
import { SendMessageV2Service } from '#services/chatbot/v2/sendMessageV2Service'
import { ChatbotMessageV2Serializer } from '#serializers/api/v2/chatbotMessageSerializer'
import { captureException } from '#config/sentry'
import { ValidationError } from '#errors/validationError'

class MessageV2Controller {
  async index(req, res) {
    const { conversationUniqueId } = req.params
    const { page, perPage } = req.query

    const result = await GetMessagesService.call({
      userId: req.user.id,
      conversationId: conversationUniqueId,
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 50,
    })

    return res.status(200).json({
      data: ChatbotMessageV2Serializer.serialize(result.messages),
      pagination: result.pagination,
    })
  }

  // Server-Sent Events. The client aborting the fetch is the normal way a user
  // stops a long answer, so a closed socket must abort the upstream AI stream
  // too — otherwise the model keeps generating (and billing) for nobody.
  async create(req, res) {
    const { conversationUniqueId } = req.params
    const { message, mode } = req.body

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    let clientDisconnected = false
    const streamAbortController = new AbortController()

    const abort = () => {
      clientDisconnected = true
      streamAbortController.abort()
    }

    req.on('close', abort)
    res.on('close', abort)
    res.on('error', abort)

    const writeError = (error) => {
      if (clientDisconnected) return

      const isValidationError = error instanceof ValidationError
      if (!isValidationError) {
        captureException(error, {
          url: req.originalUrl,
          method: req.method,
          userId: req.user?.id,
          body: req.body,
        })
      }

      const message = isValidationError ? error.message : 'Terjadi kesalahan pada sistem'
      res.write(`data: ${JSON.stringify({ type: 'error', error: { message } })}\n\n`)
      res.end()
    }

    try {
      await SendMessageV2Service.call({
        userId: req.user.id,
        conversationId: conversationUniqueId,
        message,
        mode,
        streamAbortSignal: streamAbortController.signal,
        checkClientConnected: () => !clientDisconnected,
        onStream: (chunk, onSend) => {
          if (clientDisconnected) return
          res.write(`data: ${JSON.stringify(chunk)}\n\n`)
          if (onSend) onSend()
        },
        onComplete: (result) => {
          if (clientDisconnected) return
          res.write(`data: ${JSON.stringify({ type: 'done', data: result })}\n\n`)
          res.end()
        },
        onError: writeError,
      })
    } catch (error) {
      writeError(error)
    }
  }

  // Path differs from V1 on purpose: V1's frontend posted to
  // `/conversations/:messageId/feedback`, which no route ever matched, so
  // feedback silently 404'd. V2 posts to the message where it belongs.
  async feedback(req, res) {
    const { isHelpful, feedback } = req.body

    await SubmitFeedbackService.call({
      userId: req.user.id,
      messageId: parseInt(req.params.messageId),
      isHelpful,
      feedback,
    })

    return res.status(200).json({ data: { success: true } })
  }

  // Called once the client has finished rendering a stream — with the full text
  // when it played out, or the partial text when the user stopped it. Without
  // this a message would stay stuck at status 'streaming' forever.
  async finalize(req, res) {
    const { conversationUniqueId, messageId } = req.params
    const { content, isComplete } = req.body

    if (typeof content !== 'string') {
      throw new ValidationError('Konten wajib diisi dan harus berupa teks')
    }

    const result = await FinalizeMessageService.call({
      userId: req.user.id,
      conversationId: conversationUniqueId,
      messageId: parseInt(messageId),
      content,
      isComplete: isComplete === true,
    })

    // Already finalized — report the stored message rather than overwriting it,
    // so a duplicate finalize (a retry, a double-stop) cannot truncate a
    // message that already completed.
    const status = result.success ? 200 : 409

    return res.status(status).json({
      data: ChatbotMessageV2Serializer.serializeOne(result.message),
    })
  }
}

export default new MessageV2Controller()
