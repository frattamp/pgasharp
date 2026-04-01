export default async function handler(req, res) {
  const q   = new URLSearchParams(req.query)
  const url = `https://api.open-meteo.com/v1/forecast?${q.toString()}`
  const resp = await fetch(url)
  const text = await resp.text()
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  res.status(resp.status).send(text)
}
