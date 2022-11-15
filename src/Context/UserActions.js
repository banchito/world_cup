import { db } from '../firebase.config'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

export const fetchUserBets = async (uid) => {
  console.log({ uid })
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
    return 'error'
  }
}
