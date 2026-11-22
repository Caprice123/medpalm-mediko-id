import { GetTabMessagesV2Service } from '#services/skripsi/v2/getTabMessagesV2Service'
import { FinalizeMessageService } from '#services/skripsi/finalizeMessageService'
import { SendMessageV2Service } from '#services/skripsi/v2/sendMessageV2Service'
import { SkripsiMessageV2Serializer } from '#serializers/api/v2/skripsiMessageSerializer'
import { captureException } from '#config/sentry'
import { ValidationError } from '#errors/validationError'

// Every route under /api/v2/skripsi/chat. The diagram builder and the
// searcher have controllers of their own, so a change to one never has to be
// read around the others.
class SkripsiChatV2Controller {
  // Messages page backwards by id (`beforeMessageId`) rather than by page
  // number: the tail of the thread is what the reader opens on, and new
  // messages arrive while it is open, so an offset would skip or repeat rows.
  async messages(req, res) {
    const { limit, beforeMessageId } = req.query

    const result = await GetTabMessagesV2Service.call({
      tabId: parseInt(req.params.tabId),
      userId: req.user.id,
      limit: parseInt(limit) || 50,
      beforeMessageId: beforeMessageId ? parseInt(beforeMessageId) : null,
    })

    return res.status(200).json({
      data: SkripsiMessageV2Serializer.serialize(result.messages),
      hasMore: result.hasMore,
    })
  }

  // Server-Sent Events. A client that aborts the fetch is the normal way a
  // user stops a long answer, so a closed socket must abort the upstream AI
  // stream too — otherwise the model keeps generating for nobody.
  async send(req, res) {
    // `context` is what the student ticked in the panel's context bar — the
    // case, the outline, specific sections. Absent means "nothing attached".
    const { message, modeType = 'research', context = null } = req.body

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

      const text = isValidationError ? error.message : 'Terjadi kesalahan pada sistem'
      res.write(`data: ${JSON.stringify({ type: 'error', error: { message: text } })}\n\n`)
      res.end()
    }

    try {
      await SendMessageV2Service.call({
        tabId: parseInt(req.params.tabId),
        userId: req.user.id,
        message,
        modeType,
        context,
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

  // Called once the client has finished rendering a stream — with the whole
  // text when it played out, or the partial text when the user stopped it.
  // Without this the row stays at status 'streaming' forever.
  async finalize(req, res) {
    const { tabId, messageId } = req.params
    const { content, isComplete } = req.body

    if (typeof content !== 'string') {
      throw new ValidationError('Konten wajib diisi dan harus berupa teks')
    }

    const result = await FinalizeMessageService.call({
      userId: req.user.id,
      tabId: parseInt(tabId),
      messageId: parseInt(messageId),
      content,
      isComplete: isComplete === true,
    })

    // Already finalized — report the stored message rather than overwriting
    // it, so a retry or a double-stop cannot truncate a finished answer.
    return res.status(result.success ? 200 : 409).json({
      data: SkripsiMessageV2Serializer.serializeOne(result.message),
    })
  }
}

export default new SkripsiChatV2Controller()
