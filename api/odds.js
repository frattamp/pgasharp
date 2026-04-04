export default async function handler(req, res) {
  const response = await fetch(
    `https://api.the-odds-api.com/v4/sports/golf_masters_tournament_winner/odds/?apiKey=${process.env.ODDS_API_KEY}&regions=us,us2,ca&markets=outrights&oddsFormat=american`
  )
  const data = await response.json()
  res.status(200).json(data)
}