export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const dateIsValid = (date) => {
  return date instanceof Date && !isNaN(date)
}

export const isNum = (number) => {
  let isnum = /^\d+$/.test(number)
  return isnum
}

export const dateToString = (dateTime) => {
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  let dateString = dateTime
    .toDate()
    .toLocaleDateString(undefined, options)
    .replace(',', '')
    .replace(',', '')

  return dateString
}

export const matchResult = (
  homeScore,
  awayScore,
  away_team_id,
  home_team_id
) => {

  const scoreA = parseInt(homeScore)
  const scoreB = parseInt(awayScore)

  if (scoreA === scoreB)
    return {
      is_draw: true,
      loser: '',
      winner: '',
    }
  if (scoreA > scoreB)
    return {
      is_draw: false,
      loser: away_team_id,
      winner: home_team_id,
    }
  if (scoreA < scoreB)
    return {
      is_draw: false,
      loser: home_team_id,
      winner: away_team_id,
    }
}


