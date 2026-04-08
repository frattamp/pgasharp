import { useState, useRef, useCallback } from 'react'

// ─── Name matching ────────────────────────────────────────────────────────────
// Fuzzy match pool sheet player names to DataGolf player objects

function normalizeName(name) {
  return name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function findPlayer(name, players) {
  const norm = normalizeName(name)
  // Exact match first
  let match = players.find(p => normalizeName(p.name) === norm)
  if (match) return match
  // Last name match
  const lastName = norm.split(' ').pop()
  const lastNameMatches = players.filter(p => normalizeName(p.name).split(' ').pop() === lastName)
  if (lastNameMatches.length === 1) return lastNameMatches[0]
  // Partial match
  match = players.find(p => normalizeName(p.name).includes(norm) || norm.includes(normalizeName(p.name)))
  return match || null
}

// ─── Sim engine ───────────────────────────────────────────────────────────────

function randNormal() {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

// ── Pool value score ──────────────────────────────────────────────────────────
// What actually wins bar pools:
//
//  1. TOP-5 PROBABILITY (most important) — finishing top-5 is what wins entries
//  2. TOP-10 PROBABILITY — contributes to your "best N" score
//  3. RECENT FORM — hot players going into the week
//  4. COURSE FIT — Augusta rewards approach play + putting
//  5. OWNERSHIP PENALTY — picking chalk everyone else takes gives zero edge
//
// For "best N of M" pools: top-5 prob is worth 3x a make-cut prob
// For "all scores" pools: consistency (cut prob) weighted equally
// ─────────────────────────────────────────────────────────────────────────────

function buildPoolScores(players, isBestN) {
  const maxWinProb = Math.max(...players.map(p => p.winProb || 0), 0.01)
  const maxTop5    = Math.max(...players.map(p => p.top5Prob || 0), 0.01)
  const maxTop10   = Math.max(...players.map(p => p.top10Prob || 0), 0.01)
  const maxCut     = Math.max(...players.map(p => p.cutProb || 0), 1)
  const sgVals     = players.map(p => p.sgTotal).filter(v => v != null)
  const sgMin      = sgVals.length ? Math.min(...sgVals) : -2
  const sgMax      = sgVals.length ? Math.max(...sgVals) : 3
  const maxSgApp   = Math.max(...players.map(p => p.sgApp || 0), 0.01)
  const maxSgPutt  = Math.max(...players.map(p => p.sgPutt || 0), 0.01)
  const formCache  = (typeof window !== 'undefined' && window.__simFormCache) || {}

  const scores = {}
  players.forEach(p => {
    const key = p.dg_id || p.name

    // Win / top finish probabilities (normalized 0-1)
    const win   = (p.winProb   || 0) / maxWinProb
    const top5  = (p.top5Prob  || 0) / maxTop5
    const top10 = (p.top10Prob || 0) / maxTop10
    const cut   = (p.cutProb   || 0) / maxCut

    // SG skill (normalized)
    const sg = p.sgTotal != null ? (p.sgTotal - sgMin) / (sgMax - sgMin) : 0.3

    // Augusta course fit: approach + putting (normalized, clamped to 0-1)
    const app  = p.sgApp  != null ? Math.min(Math.max((p.sgApp  + 2) / 4, 0), 1) : 0.4
    const putt = p.sgPutt != null ? Math.min(Math.max((p.sgPutt + 2) / 4, 0), 1) : 0.4

    // Recent form from Who's Hot cache
    const form = formCache[p.dg_id] != null ? Math.min(formCache[p.dg_id], 1) : 0.35

    // Hard filter: inactive/ceremonial players get a floor score of 0
    const isActive = (p.projPoints || 0) > 10 || (p.sgTotal != null && p.sgTotal > -1.0)
    if (!isActive) { scores[key] = -99; return }

    // Ownership penalty — players over 20% ownership give no differentiation edge
    const own = p.ownership || 5
    const ownPenalty = own > 20 ? (own - 20) * 0.012 : own > 12 ? (own - 12) * 0.004 : 0

    let raw
    if (isBestN) {
      // "Best N of M" pool: top-5 probability is king
      // Heavily weight upside — one player finishing top-5 can win the pool
      raw = (
        win   * 0.25 +   // win prob: highest upside
        top5  * 0.30 +   // top-5: core value metric for best-N
        top10 * 0.15 +   // top-10: secondary upside
        form  * 0.15 +   // recent form: momentum
        app   * 0.10 +   // Augusta approach play
        putt  * 0.05     // putting
      )
    } else {
      // "All scores" pool: balance upside with floor
      raw = (
        sg    * 0.20 +
        top10 * 0.25 +
        cut   * 0.15 +
        form  * 0.20 +
        app   * 0.12 +
        putt  * 0.08
      )
    }

    scores[key] = Math.max(0, raw - ownPenalty)
  })
  return scores
}

// ── Group pool optimizer ──────────────────────────────────────────────────────
function runGroupPoolSims(resolvedGroups, numEntries, N = 300, scoringType = '') {
  const validGroups = resolvedGroups.filter(g => g.players.length > 0)
  if (validGroups.length === 0) return []
  const G = validGroups.length

  // Detect "best N" scoring
  const bestNMatch = (scoringType || '').toLowerCase().match(/best\s+(\d+)/)
  const bestN = bestNMatch ? parseInt(bestNMatch[1]) : null
  const isBestN = bestN !== null && bestN < G

  // Build pool scores
  const allPlayers = validGroups.flatMap(g => g.players)
  const poolScores = buildPoolScores(allPlayers, isBestN)
  const getScore = (p) => poolScores[p.dg_id || p.name] ?? 0

  // Rank players in each group by pool value score
  const rankedGroups = validGroups.map(g => ({
    ...g,
    ranked: [...g.players].sort((a, b) => getScore(b) - getScore(a))
  }))

  // ── Simulate a combo ─────────────────────────────────────────────────────
  // Simulates actual finish positions using top5/top10/cut probabilities
  // Then scores the entry based on how the pool works
  function scoreCombo(combo) {
    let wins = 0, cashes = 0, totalScore = 0

    for (let sim = 0; sim < N; sim++) {
      // Simulate each player's finish using their probability distribution
      // We model finish as a random draw weighted by their win/top5/top10/cut probs
      const finishScores = {}
      allPlayers.forEach(p => {
        const key = p.dg_id || p.name
        const r = Math.random()
        const win   = p.winProb   || 0
        const top5  = p.top5Prob  || 0
        const top10 = p.top10Prob || 0
        const cut   = (p.cutProb  || 50) / 100

        // Pool scoring: assign points based on simulated finish tier
        // Weighted by actual probabilities + noise
        let pts
        if (r < win * 0.8)                         pts = 10 + randNormal() * 0.5   // win
        else if (r < top5 * 0.85)                  pts = 7  + randNormal() * 0.8   // top 5
        else if (r < top10 * 0.88)                 pts = 5  + randNormal() * 1.0   // top 10
        else if (r < (top10 + (cut - top10) * 0.5)) pts = 3  + randNormal() * 1.5  // top 25
        else if (r < cut * 0.9)                    pts = 1.5 + randNormal() * 0.8  // made cut
        else                                        pts = 0                          // missed cut

        // Add skill-based noise so better players tend to score higher
        pts += getScore(p) * 2 + randNormal() * 1.2
        finishScores[key] = Math.max(0, pts)
      })

      // Score the combo
      const comboScores = combo.map(p => finishScores[p.dg_id || p.name] ?? 0)

      // Apply "best N" rule if applicable
      const entryScore = isBestN
        ? [...comboScores].sort((a, b) => b - a).slice(0, bestN).reduce((s, v) => s + v, 0)
        : comboScores.reduce((s, v) => s + v, 0)
      totalScore += entryScore

      // Compare against best possible from field
      const fieldBest = rankedGroups.reduce((s, g) => {
        const n = g.picksPerGroup || 1
        const topPts = [...g.ranked]
          .sort((a, b) => (finishScores[b.dg_id||b.name]||0) - (finishScores[a.dg_id||a.name]||0))
          .slice(0, n)
          .reduce((ss, p) => ss + (finishScores[p.dg_id||p.name]||0), 0)
        return s + topPts
      }, 0)

      const threshold = isBestN ? 0.72 : 0.78
      if (entryScore >= fieldBest * threshold) wins++

      // Cash: beat average entry
      const avgScore = Object.values(finishScores).reduce((s, v) => s + v, 0) / allPlayers.length
      if (entryScore >= avgScore * combo.length * 0.9) cashes++
    }

    const avgOwn = combo.reduce((s, p) => s + (p.ownership || 5), 0) / combo.length
    return {
      combo,
      winRate:      (wins   / N) * 100,
      cashRate:     (cashes / N) * 100,
      avgPts:       totalScore / N,
      leverage:     Math.max(0, 100 - avgOwn),
      avgOwnership: avgOwn,
    }
  }

  function resolveGroupIdx(flatIdx, groups) {
    let idx = 0
    for (let gi = 0; gi < groups.length; gi++) {
      const picks = groups[gi].picksPerGroup || 1
      if (flatIdx < idx + picks) return gi
      idx += picks
    }
    return groups.length - 1
  }

  // ── Candidate generation ──────────────────────────────────────────────────
  function buildComboFromRanks(rankSelections) {
    const combo = []
    rankedGroups.forEach((g, gi) => {
      const n = g.picksPerGroup || 1
      const startRank = rankSelections[gi] || 0
      const picked = new Set()
      for (let pi = 0; pi < n; pi++) {
        for (let ri = startRank + pi; ri < g.ranked.length; ri++) {
          const p = g.ranked[ri]
          if (!picked.has(p.dg_id || p.name)) {
            combo.push(p); picked.add(p.dg_id || p.name); break
          }
        }
      }
    })
    return combo
  }

  const candidates = []
  const seen = new Set()
  const addCombo = (ranks) => {
    const combo = buildComboFromRanks(ranks)
    if (!combo.length) return
    const key = combo.map(p => p.dg_id || p.name).join('|')
    if (!seen.has(key)) { seen.add(key); candidates.push(combo) }
  }

  // Rank-0 everywhere (pure best)
  addCombo(rankedGroups.map(() => 0))

  // Single-group swaps up to rank 5
  for (let gi = 0; gi < G; gi++) {
    for (let r = 1; r < Math.min(6, rankedGroups[gi].ranked.length); r++) {
      const ranks = rankedGroups.map(() => 0)
      ranks[gi] = r
      addCombo(ranks)
    }
  }

  // Two-group swaps
  for (let gi = 0; gi < G; gi++) {
    for (let gj = gi + 1; gj < G; gj++) {
      for (let ri = 1; ri <= Math.min(3, rankedGroups[gi].ranked.length - 1); ri++) {
        for (let rj = 1; rj <= Math.min(3, rankedGroups[gj].ranked.length - 1); rj++) {
          const ranks = rankedGroups.map(() => 0)
          ranks[gi] = ri; ranks[gj] = rj
          addCombo(ranks)
        }
      }
    }
  }

  // Three-group swaps
  for (let gi = 0; gi < G - 2; gi++) {
    for (let gj = gi + 1; gj < G - 1; gj++) {
      for (let gk = gj + 1; gk < G; gk++) {
        const ranks = rankedGroups.map(() => 0)
        ranks[gi] = 1; ranks[gj] = 1; ranks[gk] = 1
        addCombo(ranks)
      }
    }
  }

  // Weighted random within top-3 per group
  for (let i = 0; i < 400; i++) {
    const ranks = rankedGroups.map(g => {
      const maxR = Math.min(4, g.ranked.length - 1)
      const r = Math.random()
      if (r < 0.40) return 0
      if (r < 0.68) return Math.min(1, maxR)
      if (r < 0.86) return Math.min(2, maxR)
      if (r < 0.95) return Math.min(3, maxR)
      return Math.min(4, maxR)
    })
    addCombo(ranks)
  }

  // Score all candidates
  const scored = candidates.map(scoreCombo).sort((a, b) => b.winRate - a.winRate)

  // ── Portfolio selection: tiered quality + diversity ────────────────────────
  const result = []
  const playerCount = {}

  // Tier 1: top 3 pure quality
  for (const entry of scored) {
    if (result.length >= Math.min(3, numEntries)) break
    result.push(entry)
    entry.combo.forEach(p => {
      const k = p.dg_id || p.name
      playerCount[k] = (playerCount[k] || 0) + 1
    })
  }

  if (numEntries <= 3) return result

  // Tier 2+: diverse entries, max 50% exposure per player, must differ by 25% of groups
  const maxExp  = Math.max(2, Math.ceil(numEntries * 0.5))
  const minDiff = Math.max(2, Math.ceil(G * 0.25))

  for (const entry of scored) {
    if (result.length >= numEntries) break
    if (result.includes(entry)) continue
    const overExp = entry.combo.some(p => (playerCount[p.dg_id||p.name]||0) >= maxExp)
    if (overExp) continue
    const tooSim = result.some(ex => {
      const keys = new Set(ex.combo.map(p => p.dg_id||p.name))
      return entry.combo.filter(p => keys.has(p.dg_id||p.name)).length > entry.combo.length - minDiff
    })
    if (tooSim) continue
    result.push(entry)
    entry.combo.forEach(p => {
      const k = p.dg_id||p.name
      playerCount[k] = (playerCount[k]||0) + 1
    })
  }

  // Fallback
  for (const entry of scored) {
    if (result.length >= numEntries) break
    if (!result.includes(entry)) result.push(entry)
  }

  return result
}

// Free pick optimizer (original approach)
function runFreePickSims(players, pickCount, numEntries, N = 2000) {
  const pool = [...players].filter(p => p.projPoints > 0).sort((a, b) => b.projPoints - a.projPoints).slice(0, 60)
  if (pool.length < pickCount) return []

  const useExhaustive = pickCount <= 6
  let candidates = []

  if (useExhaustive) {
    function getCombos(arr, k) {
      const result = []
      function helper(start, cur) {
        if (cur.length === k) { result.push([...cur]); return }
        if (result.length > 5000) return
        for (let i = start; i < arr.length; i++) { cur.push(arr[i]); helper(i + 1, cur); cur.pop() }
      }
      helper(0, [])
      return result
    }
    candidates = getCombos(pool, pickCount)
  } else {
    const seen = new Set()
    let attempts = 0
    while (candidates.length < 3000 && attempts < 20000) {
      attempts++
      const combo = []
      const avail = [...pool]
      for (let i = 0; i < pickCount; i++) {
        const total = avail.reduce((s, p) => s + p.projPoints, 0)
        let r = Math.random() * total
        let idx = 0
        while (idx < avail.length - 1 && r > avail[idx].projPoints) { r -= avail[idx].projPoints; idx++ }
        combo.push(avail.splice(idx, 1)[0])
      }
      const key = combo.map(p => p.dg_id).sort().join('|')
      if (!seen.has(key)) { seen.add(key); candidates.push(combo) }
    }
  }

  const scored = candidates.map(combo => {
    let wins = 0, cashes = 0, totalPts = 0
    for (let sim = 0; sim < N; sim++) {
      const allScores = pool.map(p => ({ dg_id: p.dg_id, pts: p.projPoints + randNormal() * (p.projPoints * 0.18) })).sort((a, b) => b.pts - a.pts)
      const comboTotal = combo.reduce((s, p) => { const f = allScores.find(x => x.dg_id === p.dg_id); return s + (f ? f.pts : p.projPoints) }, 0)
      totalPts += comboTotal
      if (comboTotal >= allScores.slice(0, pickCount).reduce((s, x) => s + x.pts, 0) * 0.92) wins++
      const topIds = new Set(allScores.slice(0, Math.floor(pool.length / 2)).map(s => s.dg_id))
      if (combo.filter(p => topIds.has(p.dg_id)).length >= Math.ceil(pickCount / 2)) cashes++
    }
    const avgOwn = combo.reduce((s, p) => s + (p.ownership || 5), 0) / combo.length
    return { combo, winRate: (wins / N) * 100, cashRate: (cashes / N) * 100, avgPts: totalPts / N, leverage: Math.max(0, 100 - avgOwn), avgOwnership: avgOwn }
  })

  return scored.sort((a, b) => b.winRate - a.winRate).slice(0, numEntries)
}

// ─── Image compression ────────────────────────────────────────────────────────

async function compressToBase64(file) {
  return new Promise((res, rej) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 1200
      let w = img.width, h = img.height
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX }
        else { w = Math.round(w * MAX / h); h = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      res(canvas.toDataURL('image/jpeg', 0.85).split(',')[1])
    }
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Failed')) }
    img.src = url
  })
}

// ─── UI primitives ────────────────────────────────────────────────────────────

const PctBadge = ({ value, color = 'green' }) => {
  const s = {
    green: { bg: 'rgba(34,139,34,0.13)',  fg: 'var(--green)', bd: 'rgba(34,139,34,0.4)'  },
    gold:  { bg: 'rgba(212,175,55,0.13)', fg: 'var(--gold)',  bd: 'rgba(212,175,55,0.4)' },
    muted: { bg: 'var(--bg)',             fg: 'var(--muted)', bd: 'var(--border)'         },
  }[color] || {}
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: 999,
      fontSize: 11, fontWeight: 700, background: s.bg, color: s.fg, border: `1px solid ${s.bd}`,
    }}>
      {typeof value === 'number' ? value.toFixed(1) : value}%
    </span>
  )
}

const ProjBadge = ({ value }) => (
  <span style={{
    display: 'inline-block', padding: '2px 7px', borderRadius: 999, fontSize: 11, fontWeight: 700,
    background: 'rgba(212,175,55,0.10)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.25)',
  }}>
    {typeof value === 'number' ? value.toFixed(1) : value} pts
  </span>
)

function UploadZone({ onFile, preview, isMobile }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)
  const handleDrop = useCallback(e => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]; if (f) onFile(f)
  }, [onFile])

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--green)' : 'var(--border)'}`,
          borderRadius: 14, padding: isMobile ? '28px 16px' : '44px 32px',
          textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(34,139,34,0.06)' : 'var(--card)', transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: 38, marginBottom: 10 }}>📋</div>
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 6 }}>Upload Your Pool Sheet</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18, lineHeight: 1.6 }}>
          Photo or PDF of your bar or office pool sheet.<br />
          AI reads the groups and players · Runs simulations · Gives you the best entry
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            padding: '9px 22px', borderRadius: 8, background: 'var(--green)',
            color: 'white', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>📁 Choose File</button>
          {isMobile && (
            <button
              onClick={e => { e.stopPropagation(); inputRef.current.setAttribute('capture', 'environment'); inputRef.current.click() }}
              style={{
                padding: '9px 22px', borderRadius: 8, background: 'transparent',
                color: 'var(--gold)', border: '1.5px solid var(--gold)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >📷 Take Photo</button>
          )}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--muted)' }}>JPG · PNG · PDF</div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,application/pdf"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files[0]; if (f) onFile(f) }} />
      </div>
      {preview && (
        <div style={{
          marginTop: 14, borderRadius: 10, overflow: 'hidden',
          border: '1px solid var(--border)', maxHeight: 300,
          display: 'flex', justifyContent: 'center', background: '#111',
        }}>
          <img src={preview} alt="Pool sheet" style={{ maxHeight: 300, objectFit: 'contain' }} />
        </div>
      )}
    </div>
  )
}

function GroupsPreview({ groups, players, rules }) {
  return (
    <div style={{
      background: 'var(--card)', borderRadius: 12, padding: '18px 20px',
      border: '1.5px solid var(--green)', marginTop: 18,
    }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>✅ Extracted Pool Sheet</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
        {groups.length} groups · {rules?.picksPerGroup > 1 ? `${rules.picksPerGroup} picks per group` : '1 pick per group'} · {groups.reduce((s, g) => s + g.players.length, 0)} players extracted
        {players.length > 0 && ` · ${groups.reduce((s, g) => s + g.players.filter(name => findPlayer(name, players)).length, 0)} matched to current data`}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{
            background: 'var(--bg)', borderRadius: 8, padding: '10px 12px',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--gold)', marginBottom: 6 }}>
              {g.name}
              {(g.picksPerGroup > 1) && <span style={{ marginLeft: 6, background: 'var(--green-light)', color: 'var(--green-dark)', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, border: '1px solid var(--green-mid)' }}>PICK {g.picksPerGroup}</span>}
            </div>
            {g.players.map((name, pi) => {
              const matched = players.length > 0 ? findPlayer(name, players) : null
              return (
                <div key={pi} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: matched ? 'var(--green)' : players.length > 0 ? '#dc3545' : 'var(--muted)' }}>
                    {matched ? '✓' : players.length > 0 ? '?' : '•'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text)' }}>{name}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function RulesInfo({ rules }) {
  return (
    <div style={{
      background: 'var(--card)', borderRadius: 10, padding: '12px 16px',
      border: '1px solid var(--border)', marginTop: 10,
      display: 'flex', flexWrap: 'wrap', gap: 16,
    }}>
      {rules.tournament && (
        <div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Tournament</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{rules.tournament}</div>
        </div>
      )}
      <div>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Scoring</span>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{rules.scoringType || '—'}</div>
      </div>
      {rules.tiebreaker && rules.tiebreaker !== 'none' && (
        <div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Tiebreaker</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{rules.tiebreaker}</div>
        </div>
      )}
      {rules.notes && (
        <div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Notes</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{rules.notes}</div>
        </div>
      )}
    </div>
  )
}

function ComboRow({ result, index, isGroup, groups }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    const text = isGroup
      ? (() => {
          if (!groups) return result.combo.map(p => p.name).join(', ')
          // Rebuild group→players mapping from flat combo
          const lines = []
          let flatIdx = 0
          groups.forEach(g => {
            const n = g.picksPerGroup || 1
            const picks = result.combo.slice(flatIdx, flatIdx + n).map(p => p.name).join(' & ')
            lines.push(`${g.name}: ${picks}`)
            flatIdx += n
          })
          return lines.join('\n')
        })()
      : result.combo.map(p => p.name).join(', ')
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true); setTimeout(() => setCopied(false), 1600)
  }
  const medal = index === 0 ? 'var(--gold)' : index < 3 ? 'var(--green)' : 'var(--border)'

  return (
    <div style={{ background: 'var(--card)', border: `1px solid ${index === 0 ? 'rgba(212,175,55,0.4)' : 'var(--border)'}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ background: medal, color: index < 3 ? '#fff' : 'var(--muted)', borderRadius: 999, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{index + 1}</span>
          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Entry #{index + 1}</span>
          {index === 0 && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 700, background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.4)' }}>🏆 BEST ENTRY</span>}
        </div>
        <button onClick={handleCopy} style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid var(--border)', background: copied ? 'var(--green)' : 'transparent', color: copied ? '#fff' : 'var(--muted)', transition: 'all 0.2s' }}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
        {result.combo.map((p, i) => {
          let groupNum = i + 1
          if (isGroup && groups) {
            let idx = 0
            for (let gi = 0; gi < groups.length; gi++) {
              const n = groups[gi].picksPerGroup || 1
              if (i < idx + n) { groupNum = gi + 1; break }
              idx += n
            }
          }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px' }}>
              {isGroup && groups && <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700 }}>{groups[groupNum-1]?.name || `G${groupNum}`}</span>}
              {p.country && <img src={`https://flagcdn.com/16x12/${p.country.toLowerCase()}.png`} alt={p.country} style={{ width: 16, height: 12, borderRadius: 2, flexShrink: 0 }} onError={e => { e.target.style.display = 'none' }} />}
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function BarPoolOptimizer({ players = [], isMobile = false }) {
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)
  const [phase, setPhase]         = useState('upload')
  const [rules, setRules]         = useState(null)
  const [errorMsg, setErrorMsg]   = useState('')
  const [results, setResults]     = useState([])
  const [showCount, setShowCount] = useState(10)
  const [numEntries, setNumEntries] = useState(1)

  const handleFile = f => {
    setFile(f); setPhase('upload'); setResults([]); setRules(null); setErrorMsg('')
    setPreview(f.type.startsWith('image/') ? URL.createObjectURL(f) : null)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setPhase('extracting'); setErrorMsg('')
    try {
      const base64 = await compressToBase64(file)
      const r = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mediaType: 'image/jpeg' }),
      })
      if (!r.ok) throw new Error(`API ${r.status}`)
      const json = await r.json()
      const extracted = json.rules || json
      if (extracted?.error === 'unclear') {
        setErrorMsg('Image quality too low. Try a clearer photo with better lighting.')
        setPhase('error'); return
      }
      setRules(extracted)
      setPhase('rules')
    } catch (err) {
      console.error(err)
      setErrorMsg('Could not read your pool sheet. Try again with a clearer photo.')
      setPhase('error')
    }
  }

  const handleRunSims = () => {
    setPhase('running'); setResults([])
    setTimeout(() => {
      try {
        const isGroup = rules.poolType === 'group' && rules.groups?.length > 0

        if (isGroup) {
          // Resolve group player names to DataGolf player objects
          const resolvedGroups = rules.groups.map(g => ({
            name: g.name,
            // Use per-group picksPerGroup if vision extracted it, fall back to global, then 1
            picksPerGroup: g.picksPerGroup || rules.picksPerGroup || 1,
            players: g.players.map(name => {
              const matched = players.length > 0 ? findPlayer(name, players) : null
              return matched || {
                name,
                dg_id: name,
                projPoints: players.length > 0
                  ? players.reduce((s, p) => s + p.projPoints, 0) / players.length
                  : 65,
                winProb: 0,
                top10Prob: 0,
                sgTotal: null,
                ownership: 8,
                country: null,
              }
            })
          }))
          setResults(runGroupPoolSims(resolvedGroups, numEntries, 300, rules.scoringType || ''))
          setPhase('results')
        } else {
          if (players.length === 0) {
            setErrorMsg('No player data loaded. Visit DFS Optimizer first to load this week\'s field.')
            setPhase('error'); return
          }
          setResults(runFreePickSims(players, rules.picks || 6, numEntries, 2000))
          setPhase('results')
        }
      } catch (err) {
        console.error(err)
        setErrorMsg('Simulation failed: ' + err.message)
        setPhase('error')
      }
    }, 60)
  }

  const reset = () => {
    setPhase('upload'); setFile(null); setPreview(null); setResults([]); setRules(null); setErrorMsg('')
  }

  const isGroup = rules?.poolType === 'group' && rules?.groups?.length > 0

  return (
    <div style={{ padding: isMobile ? '16px 12px' : '24px 20px', maxWidth: 800, margin: '0 auto' }}>

      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 26 }}>🎰</span>
          <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 800, color: 'var(--text)' }}>
            Bar Pool Optimizer
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
          Upload your pool sheet · AI reads every group and player · Simulations find your best entry
        </p>
      </div>

      {(phase === 'upload' || phase === 'error') && (
        <>
          <UploadZone onFile={handleFile} preview={preview} isMobile={isMobile} />
          <button onClick={handleAnalyze} disabled={!file} style={{
            width: '100%', marginTop: 14, padding: '13px 0', borderRadius: 10,
            background: !file ? 'var(--border)' : 'var(--green)',
            color: !file ? 'var(--muted)' : '#fff', border: 'none', fontWeight: 800, fontSize: 15,
            cursor: !file ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
          }}>🔍 Analyze Pool Sheet</button>
          {phase === 'error' && errorMsg && (
            <div style={{
              marginTop: 14, background: 'rgba(220,53,69,0.08)',
              border: '1px solid rgba(220,53,69,0.3)', borderRadius: 10, padding: '14px 16px',
            }}>
              <div style={{ fontWeight: 700, color: '#dc3545', marginBottom: 6 }}>❌ {errorMsg}</div>
              <button onClick={reset} style={{
                padding: '6px 14px', borderRadius: 7, border: '1px solid #dc3545',
                background: 'transparent', color: '#dc3545', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}>Try Again</button>
            </div>
          )}
        </>
      )}

      {phase === 'extracting' && (
        <div style={{
          marginTop: 20, textAlign: 'center', padding: '40px 20px',
          background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🤖</div>
          <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Reading your pool sheet…</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Extracting all groups and player names</div>
        </div>
      )}

      {(phase === 'rules' || phase === 'results') && rules && (
        <>
          <RulesInfo rules={rules} />
          {isGroup
            ? <GroupsPreview groups={rules.groups} players={players} rules={rules} />
            : (
              <div style={{
                background: 'var(--card)', borderRadius: 12, padding: '14px 16px',
                border: '1.5px solid var(--green)', marginTop: 18,
                fontSize: 13, color: 'var(--text)',
              }}>
                ✅ Free pick pool · {rules.picks || 6} players · Using current week's field data
              </div>
            )
          }

          {players.length === 0 && isGroup && (
            <div style={{
              marginTop: 10, background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.3)', borderRadius: 10, padding: '12px 16px',
              fontSize: 13, color: 'var(--gold)',
            }}>
              ⚠️ No current week data loaded — projections will use pool sheet players only, ranked by DataGolf predictions when available. Results may be less accurate until Masters data loads Thursday.
            </div>
          )}

          {phase === 'rules' && (
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap' }}>Entries</span>
                <input
                  type="number" min="1" max="20" value={numEntries}
                  onChange={e => setNumEntries(Math.max(1, Math.min(20, Number(e.target.value))))}
                  style={{
                    width: 56, background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 7, padding: '6px 10px', color: 'var(--text)',
                    fontSize: 14, fontWeight: 700, textAlign: 'center',
                  }}
                />
              </div>
              <button onClick={handleRunSims} style={{
                flex: 1, padding: '13px 0', borderRadius: 10,
                background: 'var(--green)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer',
              }}>⚡ Generate {numEntries === 1 ? 'Best Entry' : `Top ${numEntries} Entries`}</button>
            </div>
          )}
        </>
      )}

      {phase === 'running' && (
        <div style={{
          marginTop: 20, textAlign: 'center', padding: '40px 20px',
          background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎲</div>
          <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Running simulations…</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>
            {isGroup ? `Finding best 1-from-each-group combo` : `Testing pick combos against the field`}
          </div>
          <div style={{ width: '70%', margin: '0 auto', height: 4, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--green)', borderRadius: 999, animation: 'bpProg 2s ease-in-out infinite' }} />
          </div>
          <style>{`@keyframes bpProg{0%{width:5%}60%{width:85%}100%{width:95%}}`}</style>
        </div>
      )}

      {phase === 'results' && results.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
              🏆 {numEntries === 1 ? 'Best Entry' : `Top ${numEntries} Entries`}
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              {isGroup ? `${rules.groups.length} groups` : `${rules.picks} picks`} · ranked by sim win rate
            </span>
          </div>

          {results.slice(0, showCount).map((r, i) => (
            <ComboRow key={i} result={r} index={i} isGroup={isGroup} groups={rules?.groups} />
          ))}

          {showCount < results.length && (
            <button onClick={() => setShowCount(c => Math.min(c + 10, results.length))} style={{
              width: '100%', padding: '11px 0', borderRadius: 10, marginTop: 4,
              border: '1.5px solid var(--green)', background: 'transparent',
              color: 'var(--green)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>Show More ({results.length - showCount} remaining)</button>
          )}

          <button onClick={() => setPhase('rules')} style={{
            width: '100%', padding: '10px 0', borderRadius: 10, marginTop: 8,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--muted)', fontWeight: 600, fontSize: 12, cursor: 'pointer',
          }}>↩ Change number of entries</button>

          <button onClick={reset} style={{
            width: '100%', padding: '10px 0', borderRadius: 10, marginTop: 6,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--muted)', fontWeight: 600, fontSize: 12, cursor: 'pointer',
          }}>📋 Upload a different pool sheet</button>
        </div>
      )}

    </div>
  )
}