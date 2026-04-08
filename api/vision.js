export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { image, mediaType } = req.body
    if (!image) return res.status(400).json({ error: 'No image provided' })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image }
            },
            {
              type: 'text',
              text: `This is a golf bar pool or office pool sheet. Extract ALL information and return ONLY a valid JSON object — no markdown, no explanation, no backticks.

Determine the pool type:
- GROUP pool: has named groups where you pick one OR MORE players from each group
- FREE PICK pool: pick any N players from the full field

CRITICAL — each group can have a DIFFERENT number of picks. Read carefully:

Step 1: Look at each group name/header for pick counts:
- "Group Name (2 Players)" → picksPerGroup: 2
- "Group Name (1 Player)" → picksPerGroup: 1  
- "Europe (2 Players)" → picksPerGroup: 2
- No number shown → default to 1

Step 2: Look for blank lines or circles next to player names — count them per group

Step 3: Use math as a sanity check:
- total picks per entry = sum of all per-group picks
- if scoring says "best 13 scores" and you have 11 groups (some with 2 picks), that math should add up

Return this EXACT structure — note groups now have their OWN picksPerGroup:

{
  "tournament": "<tournament name>",
  "poolType": "group" or "freepick",
  "scoringType": "<how scoring works>",
  "tiebreaker": "<tiebreaker rule or none>",
  "notes": "<any other important rules>",
  "picksPerGroup": <integer: DEFAULT picks per group if not specified per group>,
  "groups": [
    {
      "name": "World Top 5",
      "picksPerGroup": 1,
      "players": ["Scottie Scheffler", "Rory McIlroy", "Tommy Fleetwood", "Cameron Young", "Matt Fitzpatrick"]
    },
    {
      "name": "Europe Ole Ole Ole",
      "picksPerGroup": 2,
      "players": ["Harry Hall", "Tyrrell Hatton", "Shane Lowry", "Alex Noren"]
    }
  ],
  "picks": <integer: total picks per entry = sum of all groups picksPerGroup>
}

For group pools extract EVERY group and ALL player names exactly as written.
If image is unreadable return: {"error":"unclear"}`
            }
          ]
        }]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic error:', err)
      return res.status(500).json({ error: 'AI API error' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const rules = JSON.parse(text.replace(/```json|```/g, '').trim())
    res.json({ rules })

  } catch (err) {
    console.error('Vision handler error:', err)
    res.status(500).json({ error: err.message })
  }
}
