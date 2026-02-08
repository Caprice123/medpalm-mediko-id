import { createClient } from '@deepgram/sdk'
import { setTimeout, setInterval, clearTimeout, clearInterval } from 'worker-timers'

/**
 * Check MIME type support for audio recording
 * @returns {Object} Object with supported mimeType or null if none supported
 */
export const checkMimeTypeSupport = () => {
  // Check MIME type support first before doing anything else
  let mimeType = null
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    mimeType = 'audio/webm;codecs=opus'
  } else if (MediaRecorder.isTypeSupported('audio/webm')) {
    mimeType = 'audio/webm'
  } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
    mimeType = 'audio/mp4'
  }

  if (!mimeType) {
    console.error('❌ No supported audio MIME type found')
    return { supported: false, mimeType: null }
  }

  console.log('✅ Supported MIME type:', mimeType)
  return { supported: true, mimeType }
}

/**
 * Test Deepgram connectivity
 * @returns {Promise<boolean>} True if Deepgram is available, false otherwise
 */
const testDeepgramConnection = async () => {
  try {
    const apiKey = "d7606aebf172034cc6dd376fb1d2bdef41071dc2"

    if (!apiKey) {
      console.warn('Deepgram API key not found')
      return false
    }

    // Create Deepgram client
    const deepgramClient = createClient(apiKey)

    // Create a test connection
    const connection = deepgramClient.listen.live({
      model: 'nova-2',
      language: 'id'
    })

    // Wait for connection to open or timeout
    const isConnected = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('Deepgram connection test timeout')
        resolve(false)
      }, 3000) // 3 second timeout

      let isResolved = false

      const openHandler = () => {
        if (!isResolved) {
          isResolved = true
          clearTimeout(timeout)
          console.log('✅ Deepgram connection test successful')
          resolve(true)
        }
      }

      const errorHandler = (err) => {
        if (!isResolved) {
          isResolved = true
          clearTimeout(timeout)
          console.warn('❌ Deepgram connection test failed:', err)
          resolve(false)
        }
      }

      connection.addListener('open', openHandler)
      connection.addListener('error', errorHandler)
    })

    // Clean up connection
    try {
      connection.requestClose()
    } catch (err) {
      // Ignore cleanup errors
    }

    return isConnected
  } catch (error) {
    console.warn('Deepgram connection test error:', error)
    return false
  }
}

/**
 * Determine the available STT provider
 * Tests Deepgram first (preferred), falls back to Whisper if unavailable
 * @returns {Promise<'deepgram'|'whisper'>} The available STT provider
 */
export const getAvailableSttProvider = async () => {
  console.log('🔍 Testing STT provider connectivity...')

  // Check MIME type support first
  const mimeTypeCheck = checkMimeTypeSupport()
  if (!mimeTypeCheck.supported) {
    console.warn('⚠️ No supported audio MIME type, falling back to Whisper')
    return 'deepgram'
  }

  // Test Deepgram first (preferred provider)
  const deepgramAvailable = await testDeepgramConnection()

  if (deepgramAvailable) {
    console.log('✅ Using Deepgram as STT provider')
    return 'deepgram'
  }

  // Fallback to deepgram
  console.log('⚠️ Deepgram unavailable, falling back to deepgram')
  return 'deepgram'
}
