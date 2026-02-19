import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initSentry, ErrorBoundary } from './config/sentry'

// Initialize Sentry before rendering
initSentry()

if (import.meta.env.DEV) {
    import('react-scan').then(({ scan }) => scan({ enabled: true }))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Oops! Terjadi kesalahan</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Mohon maaf, aplikasi mengalami masalah. Tim kami sudah diberitahu tentang masalah ini.
          </p>
          <button
            onClick={resetError}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Coba Lagi
          </button>
          {import.meta.env.MODE === 'development' && (
            <details style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px' }}>
              <summary style={{ cursor: 'pointer', color: '#6b7280' }}>Detail Error (Dev Only)</summary>
              <pre style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.875rem'
              }}>
                {error.toString()}
              </pre>
            </details>
          )}
        </div>
      )}
      showDialog
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
