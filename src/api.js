const KEY = import.meta.env.VITE_DATAGOLF_KEY

const BASE = 'https://feeds.datagolf.com'

export async function getField() {
  const res = await fetch(`${BASE}/field-updates?tour=pga&file_format=json&key=${KEY}`)
  const data = await res.json()
  return data
}

export async function getDFSProjections() {
  const res = await fetch(`${BASE}/preds/fantasy-projection-defaults?tour=pga&site=draftkings&slate=main&file_format=json&key=${KEY}`)
  const data = await res.json()
  return data
}

export async function getSkillRatings() {
  const res = await fetch(`${BASE}/preds/skill-ratings?display=value&file_format=json&key=${KEY}`)
  const data = await res.json()
  return data
}