import { useState, useRef, useEffect } from 'react'

export default function Chat({ players, tournament, weatherData, completedEvents, simResults }) {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hey! I'm your PGASharp AI assistant. Ask me anything about this week's field, lineup recommendations, or DFS strategy for ${tournament?.name || 'this week'}.` }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const buildContext = () => {
    const allPlayers = [...players]
      .sort((a, b) => b.projPoints - a.projPoints)
      .map(p => p.name + ' | $' + p.salary.toLocaleString() + ' | ' + p.projPoints + 'pts | Value: ' + p.value + ' | SG Total: ' + p.sgTotal + ' | SG App: ' + p.sgApp + ' | SG Putt: ' + p.sgPutt + ' | Cut%: ' + p.cutProb + '% | Own%: ' + p.ownership + '%')
      .join('\n')

    const weather = weatherData?.daily?.map(d =>
      d.round + ': Avg Wind ' + d.wind + 'mph, Gusts ' + d.gusts + 'mph, Rain ' + d.rain + '%'
    ).join('\n') || 'Weather not available'

    return 'You are a knowledgeable golf expert and DFS assistant for PGASharp. You have deep knowledge of PGA Tour golf — player careers, tournament history, course fits, rules, betting, DFS strategy, and anything golf related. Answer any golf question using your broad knowledge. When relevant, reference the live PGASharp data below to give specific weekly recommendations.\n\n'
      + 'CURRENT TOURNAMENT: ' + (tournament?.name || '') + ' at ' + (tournament?.course || '') + ' | ' + (tournament?.dates || '') + '\n\n'
      + 'FULL FIELD DATA:\n' + allPlayers + '\n\n'
      + 'WEATHER:\n' + weather
  }
  const sendCorePlays = async () => {
    setOpen(true)
    const simContext = simResults?.length > 0
      ? '\n\nSIMULATION RESULTS (Monte Carlo, sorted by win%):\n' +
        simResults.slice(0, 20).map(p => `${p.name} | Win%: ${p.winPct} | Top5%: ${p.top5Pct} | Top10%: ${p.top10Pct} | Cut%: ${p.cutPct} | AvgPts: ${p.avgPts}`).join('\n')
      : ''
    const prompt = `Generate a full tournament preview and core plays article for ${tournament?.name} at ${tournament?.course}. Use the field data, weather, and simulation results provided. Format your response with these exact sections:

🎯 CORE PLAYS (3–5 players you love — give salary, projection, and 2–3 sentence reasoning for each)
💰 VALUE / LEVERAGE PLAYS (2–3 underowned plays with upside)
❌ FADES (2–3 popular plays to avoid and why)
🔥 RECOMMENDED STACKS (1–2 specific 2-3 man stacks with reasoning)
🎲 GPP CONTRARIAN IDEAS (1–2 low-owned tournament winners)

Be specific, confident, and data-driven. Reference salaries, ownership %, SG stats, and sim results where relevant.`

    setMessages(prev => [...prev, { role: 'user', content: '🔥 Generate Core Plays for this week' }])
    setLoading(true)
    try {
      const context = buildContext() + simContext
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: context, messages: [{ role: 'user', content: prompt }] })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, try again.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const context = buildContext()
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: context,
          messages: [...history, { role: 'user', content: userMsg }]
        })
      })

      const data = await res.json()
      const reply = data.reply || 'Sorry, I had trouble with that. Try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 200,
        background: open ? 'var(--red)' : 'var(--green)',
        color: 'white', border: 'none', borderRadius: '50%',
        width: 56, height: 56, fontSize: 22, cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'all 0.2s'
      }}>
        {open ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 24, zIndex: 200,
          width: 360, height: 520, background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--green)' }}>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 18 }}>⛳</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>PGASharp AI</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Powered by live DataGolf data</div>
              </div>
            </div>
            <div style={{ padding: '0 12px 12px' }}>
              <button onClick={sendCorePlays} disabled={loading} style={{ width: '100%', padding: '8px 14px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                🔥 Generate Core Plays
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 12,
                  background: m.role === 'user' ? 'var(--green)' : 'var(--bg)',
                  color: m.role === 'user' ? 'white' : 'var(--text)',
                  border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  fontSize: 13, lineHeight: 1.5,
                  borderBottomRightRadius: m.role === 'user' ? 4 : 12,
                  borderBottomLeftRadius: m.role === 'assistant' ? 4 : 12,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, borderBottomLeftRadius: 4, padding: '10px 16px', fontSize: 13, color: 'var(--muted)' }}>
                  Analyzing data...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Best value plays?', 'Top contrarian picks?', 'Weather impact?'].map(q => (
                <button key={q} onClick={() => { setInput(q); }} style={{
                  background: 'var(--green-light)', color: 'var(--green-dark)',
                  border: '1px solid var(--green-mid)', borderRadius: 20,
                  padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer'
                }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about this week's field..."
              style={{
                flex: 1, padding: '9px 14px', border: '1px solid var(--border)',
                borderRadius: 10, fontSize: 13, fontFamily: 'Inter, sans-serif',
                outline: 'none', background: 'var(--bg)'
              }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              background: 'var(--green)', color: 'white', border: 'none',
              borderRadius: 10, padding: '9px 16px', fontSize: 13,
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.6 : 1
            }}>↑</button>
          </div>
        </div>
      )}
    </>
  )
}