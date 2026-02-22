import { useState } from 'react'
import * as Sentry from '@sentry/react'
import { captureException, captureMessage } from '@config/sentry'

/**
 * /sentry-test — development page to verify Sentry is working.
 * Visit this route, click a button, then check your Sentry dashboard.
 */
export default function SentryTest() {
  const [log, setLog] = useState([])

  const addLog = (msg) => setLog((prev) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev])

  const throwRenderError = () => {
    throw new Error('Sentry Test: ERROR')
  }

  const captureManualError = () => {
    try {
      throw new Error('Sentry Test: manual captureException')
    } catch (err) {
      captureException(err, { source: 'sentry-test-page', feature: 'manual' })
      addLog('captureException sent — check Sentry dashboard')
    }
  }

  const captureManualMessage = () => {
    captureMessage('Sentry Test: manual captureMessage from /sentry-test', 'info')
    addLog('captureMessage sent — check Sentry dashboard')
  }

  const captureWarning = () => {
    captureMessage('Sentry Test: warning level message', 'warning')
    addLog('warning captureMessage sent')
  }

  const addBreadcrumb = () => {
    Sentry.addBreadcrumb({
      category: 'test',
      message: 'User clicked breadcrumb test button',
      level: 'info',
    })
    addLog('breadcrumb added (will appear with next error event)')
  }

  const btn = (label, onClick, color = '#3b82f6') => (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        background: color,
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', padding: '0 24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Sentry Test Page</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>
        Use these buttons to verify Sentry is capturing events. Check your{' '}
        <strong>Sentry dashboard</strong> after clicking.
        <br />
        <span style={{ color: '#ef4444', fontSize: 13 }}>
          Note: events are only sent in <code>production</code> mode. In dev, Sentry is disabled — see{' '}
          <code>src/config/sentry.js</code>.
        </span>
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
        {btn('Throw render error (ErrorBoundary)', throwRenderError, '#ef4444')}
        {btn('captureException (manual)', captureManualError, '#f97316')}
        {btn('captureMessage (info)', captureManualMessage, '#3b82f6')}
        {btn('captureMessage (warning)', captureWarning, '#eab308')}
        {btn('Add breadcrumb', addBreadcrumb, '#8b5cf6')}
      </div>

      {log.length > 0 && (
        <div style={{ background: '#f3f4f6', borderRadius: 8, padding: 16 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Log</p>
          {log.map((entry, i) => (
            <p key={i} style={{ fontFamily: 'monospace', fontSize: 13, margin: '4px 0', color: '#374151' }}>
              {entry}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
