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

export const isDraw = (homeScore, awayScore) => {
  const scoreA = parseInt(homeScore)
  const scoreB = parseInt(awayScore)

  return scoreA === scoreB ? true : false
}
