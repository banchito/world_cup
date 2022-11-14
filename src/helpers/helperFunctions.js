import { db } from '../firebase.config'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

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

export const fetchUserBets = async (uid) => {
  try {
    const betsRef = collection(db, 'user_bet')
    const q = query(betsRef, where('userId', '==', uid), orderBy('timestamp'))
    const querySnap = await getDocs(q)
    const bets = []
    querySnap.forEach((doc) => {
      return bets.push({ id: doc.id, data: doc.data() })
    })
    return bets
  } catch (error) {
    return 'error'
  }
}
