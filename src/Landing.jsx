import { useState } from 'react'
import Terms from './Terms'

export default function Landing({ onGetStarted }) {
  const [showTerms, setShowTerms] = useState(false)

  if (showTerms) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => setShowTerms(false)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>← Back</button>
      </div>
      <Terms />
    </div>
  )
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{ padding: '24px 40px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/logo.png" alt="PGASharp" style={{ height: 120 }} />
        <div style={{ textAlign: 'right', maxWidth: 160 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--heading)', lineHeight: 1.4 }}>All the stats that matter most.</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>All in one analytics tool.</div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 20, padding: '6px 16px', fontSize: 11, color: 'var(--green-dark)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 24 }}>
          Free Beta Access
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 20, color: 'var(--heading)', letterSpacing: -1 }}>
          Get an edge on every<br />
          <span style={{ color: 'var(--green)' }}>field you enter</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
          Real-time PGA Tour data, DFS optimizer, ownership leverage, course history and live leaderboard — everything serious golf DFS players and bettors need in one place.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onGetStarted} style={{
            background: 'var(--green)', color: 'white', border: 'none', borderRadius: 10,
            padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(22,163,74,0.3)'
          }}>Create Free Account</button>
          <button onClick={onGetStarted} style={{
            background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 24px', fontSize: 15, cursor: 'pointer'
          }}>Sign In →</button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexWrap: 'wrap' }}>
        {[
          ['Live DK Salaries', 'Updated weekly'],
          ['DataGolf Powered', 'Pro-grade data'],
          ['DFS Optimizer', 'Branch & bound algo'],
          
        ].map(([title, sub], i, arr) => (
          <div key={i} style={{ padding: '20px 36px', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none', textAlign: 'center', flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--heading)', marginBottom: 3 }}>{title}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>What's Inside</div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--heading)', marginBottom: 12, letterSpacing: -0.5 }}>Everything in one place</h2>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>Built for players who take betting golf and DFS seriously</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {[
            { icon: '⚡', title: 'DFS Optimizer', desc: 'Automatically builds the highest projected lineup under the $50k DraftKings cap. Lock players in, exclude fades, generate in seconds.', color: 'var(--gold)' },
            { icon: '📊', title: 'Ownership Leverage', desc: 'See which players are projected high relative to their ownership. Find the undervalued plays the field is sleeping on.', color: 'var(--green)' },
            { icon: '🔥', title: "Who's Hot", desc: 'Weighted form ratings for every player in the field. Last 3 starts weighted 3×. See who\'s Blazing Hot heading into the week.', color: '#f97316' },
            { icon: '⛳', title: 'Course History', desc: 'Past results for every player in the field. Instantly see who owns this course and who struggles here.', color: 'var(--green)' },
            { icon: '🌤', title: 'Tournament Weather', desc: 'Round-by-round wind, gusts, rain and temperature. Know which rounds will see scoring suppressed before you lock.', color: '#60a5fa' },
            { icon: '📈', title: 'Live Leaderboard', desc: 'Real-time scores with strokes gained breakdowns by round. Expand any player to see full SG splits.', color: '#a78bfa' },
            { icon: '✂️', title: 'Cut Probability', desc: 'DataGolf win%, top 5%, top 10% and make cut predictions for every player in the slate.', color: 'var(--gold)' },
            { icon: '🏆', title: 'Model Rankings', desc: 'DataGolf strokes gained model rankings. Sort by any SG category to find course fits fast.', color: 'var(--green)' },
          ].map(({ icon, title, desc, color }) => (
            <div key={title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green-mid)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '72px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'inline-block', background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 20, padding: '6px 16px', fontSize: 11, color: 'var(--green-dark)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>
          Free This Week
        </div>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 700, color: 'var(--heading)', marginBottom: 12, letterSpacing: -0.5 }}>
          Every week is an opportunity.<br />
          <span style={{ color: 'var(--green)' }}>Get your edge now.</span>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>No credit card required. Full access to every tool.</p>
        <button onClick={onGetStarted} style={{
          background: 'var(--green)', color: 'white', border: 'none', borderRadius: 10,
          padding: '16px 44px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(22,163,74,0.3)'
        }}>Create Free Account</button>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, background: 'var(--surface)' }}>
        <img src="/logo.png" alt="PGASharp" style={{ height: 112 }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>© 2026 PGASharp · Powered by DataGolf · Not affiliated with the PGA Tour</div>
          <a href="mailto:info@pgasharp.com" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>info@pgasharp.com</a>
        </div>
        <button onClick={() => setShowTerms(true)} style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 600, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Terms of Service</button>
      </div>

    </div>
  )
}