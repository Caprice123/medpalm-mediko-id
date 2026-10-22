/**
 * Boot-time check that the Node.js runtime carries the 21 October 2026
 * security fixes (CVE-2026-111497 Brotli out-of-bounds write / RCE, plus the
 * TLS hostname-verification and DNS-name handling flaws fixed in the same
 * release).
 *
 * There is no configuration-level workaround for those — only the runtime
 * upgrade — so the deployed Node.js build is worth verifying on every boot.
 *
 * Default behaviour is a loud warning (plus Sentry) so a deploy never dies on
 * this check alone. Set NODE_VERSION_ENFORCE=true to refuse to boot instead.
 */

// Lowest patch release per major that contains the fixes.
const MINIMUM_PATCHED = {
  22: [22, 23, 4],
  24: [24, 22, 1],
  26: [26, 12, 1],
}

const parseVersion = (version) =>
  version.replace(/^v/, '').split('.').slice(0, 3).map((part) => parseInt(part, 10) || 0)

const isAtLeast = (actual, minimum) => {
  for (let i = 0; i < 3; i += 1) {
    if (actual[i] > minimum[i]) return true
    if (actual[i] < minimum[i]) return false
  }
  return true
}

/**
 * @returns {{ ok: boolean, reason: string | null, current: string, required: string | null }}
 */
export const checkNodeVersion = (version = process.version) => {
  const current = parseVersion(version)
  const [major] = current
  const minimum = MINIMUM_PATCHED[major]

  if (!minimum) {
    const supported = Object.keys(MINIMUM_PATCHED).join(', ')
    return {
      ok: false,
      reason: `Node.js ${version} is not a supported release line (expected major ${supported}).`,
      current: version,
      required: null,
    }
  }

  if (!isAtLeast(current, minimum)) {
    const required = `v${minimum.join('.')}`
    return {
      ok: false,
      reason: `Node.js ${version} is missing the 2026-10-21 security fixes (CVE-2026-111497 Brotli RCE, TLS/DNS flaws). Upgrade to ${required} or newer.`,
      current: version,
      required,
    }
  }

  return { ok: true, reason: null, current: version, required: `v${minimum.join('.')}` }
}

export const assertPatchedNodeVersion = async () => {
  const result = checkNodeVersion()

  // Always print the runtime version — on Coolify/Nixpacks the deployed patch
  // level is decided by the builder, not by this repo, so the boot log is the
  // only reliable place to read what production actually runs.
  console.log(`[runtime] Node.js ${result.current}${result.ok ? ' (patched)' : ''}`)

  if (result.ok) return result

  console.error('='.repeat(72))
  console.error('[SECURITY] Vulnerable Node.js runtime detected')
  console.error(`[SECURITY] ${result.reason}`)
  console.error('[SECURITY] Patched releases: v22.23.4, v24.22.1, v26.12.1')
  console.error('='.repeat(72))

  try {
    const { captureMessage } = await import('#config/sentry')
    captureMessage?.(`Vulnerable Node.js runtime: ${result.reason}`, 'error')
  } catch {
    // Sentry is optional — never let reporting break boot.
  }

  if (process.env.NODE_VERSION_ENFORCE === 'true') {
    console.error('[SECURITY] NODE_VERSION_ENFORCE=true — refusing to start.')
    process.exit(1)
  }

  return result
}
