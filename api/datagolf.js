export default async function handler(req, res) {
  const { path, ...params } = req.query
  params.key = process.env.DATAGOLF_KEY
  const q   = new URLSearchParams(params)
  const url = `https://feeds.datagolf.com/${path}?${q.toString()}`
  const resp = await fetch(url)
  const text = await resp.text()
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  res.status(resp.status).send(text)
}
