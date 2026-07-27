import crypto from 'crypto'

/**
 * Signs a Bunny.net CDN URL with Token Authentication.
 *
 * Without userIp: token = sha256(key + filePath + expires)
 * With userIp:    token = sha256(key + userIp + filePath + expires)
 *   → Bunny validates using the CDN request's source IP, so the signed URL
 *     only works from that exact IP address. Sharing the URL with a different
 *     device/network returns 403.
 *
 * Requires Token Authentication to be enabled on the Bunny pull zone
 * (Bunny dashboard → Pull Zone → Security → Token Authentication).
 *
 * Required env:   BUNNY_TOKEN_AUTH_KEY
 * Optional env:   BUNNY_TOKEN_AUTH_EXPIRY_SECONDS (default 14400 = 4h)
 *                 BUNNY_TOKEN_AUTH_IP_BINDING=true (enable IP binding)
 *
 * If BUNNY_TOKEN_AUTH_KEY is not set, returns the plain URL unchanged.
 */
export function signBunnyVideoUrl(cdnUrl, userIp = null, expiresInSeconds = null) {
  const key = process.env.BUNNY_TOKEN_AUTH_KEY
  if (!key || !cdnUrl) return cdnUrl

  const expiry = expiresInSeconds
    ?? parseInt(process.env.BUNNY_TOKEN_AUTH_EXPIRY_SECONDS || '14400', 10)

  const useIpBinding =
    process.env.BUNNY_TOKEN_AUTH_IP_BINDING === 'true' && !!userIp

  try {
    const url = new URL(cdnUrl)
    const expiresAt = Math.floor(Date.now() / 1000) + expiry

    // Bunny token hash format:
    //   no IP:   sha256(key + filePath + expires)
    //   with IP: sha256(key + userIp + filePath + expires)
    const hashInput = useIpBinding
      ? key + userIp + url.pathname + expiresAt
      : key + url.pathname + expiresAt

    const token = crypto
      .createHash('sha256')
      .update(hashInput)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    url.searchParams.set('token', token)
    url.searchParams.set('expires', String(expiresAt))
    return url.toString()
  } catch {
    return cdnUrl
  }
}
