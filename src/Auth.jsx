import { useState } from 'react'
import { supabase } from './supabase'

import Terms from './Terms'

export default function Auth({ onAuth, onBack }) {
  const [showTerms, setShowTerms] = useState(false)
  const [mode, setMode]           = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [message, setMessage]   = useState(null)

  const handle = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)
    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else onAuth(data.user)
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Account created! Check your email to confirm, then log in.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img src="/logo.png" alt="PGASharp" style={{ height: 160, marginBottom: 8 }} />
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Real-time golf data & DFS tools</div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', padding: '0 0 16px', display: 'flex', alignItems: 'center', gap: 4 }}>← Back</button>
          )}
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--heading)', marginBottom: 24 }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </div>

          {error && (
            <div style={{ background: 'var(--red-light)', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 8, padding: '12px 16px', color: 'var(--green-dark)', fontSize: 13, marginBottom: 16 }}>
              {message}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', background: 'var(--bg)' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', background: 'var(--bg)' }}
            />
          </div>

          <button onClick={handle} disabled={loading} style={{
            width: '100%', padding: '12px', background: 'var(--green)', color: 'white',
            border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            fontFamily: 'Inter, sans-serif', transition: 'all 0.15s'
          }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
            {mode === 'login' ? (
              <>Don't have an account? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Sign up free</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Sign in</button></>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--muted)' }}>
          By signing up you agree to our <button onClick={() => setShowTerms(true)} style={{ background: 'none', border: 'none', color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: 12 }}>Terms of Service</button>
        </div>
      </div>
{showTerms && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 9999, overflowY: 'auto' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <button onClick={() => setShowTerms(false)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>← Back</button>
          </div>
          <Terms />
        </div>
      )}
    </div>
  )
}