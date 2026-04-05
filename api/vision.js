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
- GROUP pool: has named groups (Group 1, Group 2, etc.) where you pick ONE player from each group
- FREE PICK pool: pick any N players from the full field

Return this exact structure:

{
  "tournament": "<tournament name>",
  "poolType": "group" or "freepick",
  "scoringType": "<how scoring works>",
  "tiebreaker": "<tiebreaker rule or none>",
  "notes": "<any other rules>",
  "groups": [
    {
      "name": "Group 1",
      "players": ["Scottie Scheffler", "Rory McIlroy", "Bryson DeChambeau"]
    },
    {
      "name": "Group 2", 
      "players": ["Tommy Fleetwood", "Collin Morikawa", "Cameron Young"]
    }
  ],
  "picks": <integer: for freepick pools, how many players to select. For group pools this equals the number of groups>
}

For group pools, extract EVERY group and ALL player names exactly as written on the sheet.
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
