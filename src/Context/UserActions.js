import { db } from '../firebase.config'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

export const fetchUserBets = async (uid) => {
  try {
    const betsRef = collection(db, 'user_bet')
    const q = query(betsRef, where('userId', '==', uid), orderBy('timestamp'))
    const querySnap = await getDocs(q)
    const bets = []
    querySnap.forEach((doc) => {
      return bets.push({ id: doc.id, data: doc.data() })
    })
    return { bets }
  } catch (error) {
    console.log(error)
    return error
  }
}

export const fetchMatchResults = async (info) => {
  try {
    const matchRef = collection(db, 'matches')
    const q = query(
      matchRef,
      where('away_team', '==', info.away_team),
      where('home_team', '==', info.home_team),
      where('time', '==', info.matchTime)
    )
    const querySnap = await getDocs(q)
    const matches = []
    querySnap.forEach((doc) => {
      return matches.push({ id: doc.id, data: doc.data() })
    })
    return { matches }
  } catch (error) {
    console.log(error)
    return error
  }
}

export const fetchUserPoints = async (email) => {
  try {
    const usersRef = collection(db, 'users')

    const q = query(usersRef, where('email', '==', email))

    const querySnap = await getDocs(q)

    const points = []
    querySnap.forEach((doc) => {
      return points.push({ points: doc.data().points })
    })
    console.log(points)
    return { points }
  } catch (error) {
    console.log(error)
    return error
  }
}
