import axios from 'axios'

const MAX_RESPONSE_BYTES = 25 * 1024 * 1024 // 25MB

/**
 * axios client for fetching URLs this server does not control — e.g. `<img src>`
 * values lifted out of user-submitted HTML.
 *
 * `decompress: false` + `Accept-Encoding: identity` keep an attacker-chosen
 * host from handing us a Brotli stream: axios would otherwise advertise `br`
 * and pipe the response through Node's bundled Brotli decoder, which has an
 * out-of-bounds write (CVE-2026-111497) exploitable for RCE on Node.js
 * < 22.23.4 / 24.22.1 / 26.12.1.
 *
 * The size and redirect caps bound the damage of a hostile or looping endpoint.
 * Responses are consumed as raw bytes, so losing transport compression only
 * costs bandwidth.
 */
export const untrustedHttp = axios.create({
  decompress: false,
  headers: { 'Accept-Encoding': 'identity' },
  maxRedirects: 3,
  maxContentLength: MAX_RESPONSE_BYTES,
  maxBodyLength: MAX_RESPONSE_BYTES,
})

export default untrustedHttp
