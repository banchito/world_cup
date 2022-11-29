import { db } from '../firebase.config'
import {
  collection,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
} from 'firebase/firestore'

export const fetchUserBets = async (uid) => {
  try {
    const betsRef = collection(db, 'user_bet')
    const q = query(
      betsRef,
      where('userId', '==', uid),
      orderBy('timestamp', 'desc')
    )
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

export const fetchMatchResults = async ({ matchId }) => {
  try {
    const matchRef = doc(db, 'matches', matchId)
    const docSnap = await getDoc(matchRef)
    let matchResults = docSnap.data()

    return matchResults
  } catch (error) {
    console.log(error)
    return error
  }
}

export const fetchUserPoints = async (userId) => {
  try {
    const usersRef = doc(db, 'users', userId)
    const docSnap = await getDoc(usersRef)
    let points = docSnap.data()

    return points
  } catch (error) {
    console.log(error)
    return error
  }
}
