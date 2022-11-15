import { useEffect, useState, useContext } from 'react'
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import MatchItem from '../components/MatchItem'
// import UserContext from '../Context/UserContext.js'
import { getAuth } from 'firebase/auth'
import { useIsAdmin } from '../hooks/useIsAdmin.js'
import { fetchUserBets } from '../Context/UserActions'

export default function Matches() {
  // const { userId } = useContext(UserContext)
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedMatch, setLastFetchedMatch] = useState(null)
  const [existingBets, setExistingBets] = useState([])
  const userId = getAuth().currentUser?.uid
  const { isAdmin } = useIsAdmin(userId)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        //Get reference to the collection
        const matchesRef = collection(db, 'matches')

        //create query
        const q = query(matchesRef, orderBy('time'), limit(5))

        //execute query
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedMatch(lastVisible)
        const matches = []
        querySnap.forEach((doc) => {
          return matches.push({ id: doc.id, data: doc.data() })
        })

        setMatches(matches)
        setLoading(false)
      } catch (error) {
        toast.error('could not fetch matches')
      }
    }
    fetchMatches()
  }, [])

  useEffect(() => {
    const getUserBets = async () => {
      const { bets } = await fetchUserBets(userId)
      setExistingBets(bets)
    }
    getUserBets()
  }, [userId])

  useEffect(() => {
    if (!matches) return
    // let bets = matches.filter((match) =>
    //   existingBets.data.matchId.includes(match.id)
    // )
  }, [existingBets, matches])

  // const addExistingBetState = (matches, bets) => {
  //   console.log(matches, bets)

  //   let existingBets = matches.filter((match) =>
  //     bets.data.matchId.includes(match.id)
  //   )
  //   console.log(existingBets)
  //   var pcNumbers = [1, 2, 3, 4, 5]
  //   var userNumbers = [1, 2, 7, 8, 9]
  //   var commonNumbers = pcNumbers.filter((i) => userNumbers.includes(i))
  //   console.log(commonNumbers)
  // }

  const onFetchMoreMatches = async () => {
    try {
      //Get reference to the collection
      const matchesRef = collection(db, 'matches')

      //create query
      const q = query(
        matchesRef,
        orderBy('time'),
        startAfter(lastFetchedMatch),
        limit(10)
      )

      //execute query
      const querySnap = await getDocs(q)
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedMatch(lastVisible)
      const matches = []
      querySnap.forEach((doc) => {
        return matches.push({ id: doc.id, data: doc.data() })
      })

      setMatches((prevState) => [...prevState, ...matches])
      setLoading(false)
    } catch (error) {
      toast.error('could not fetch matches')
    }
  }

  // useEffect(() => {
  //   if (bets.length > 0) {
  //     setMatches(
  //       bets.map((existingBet) => existingBet.data.matchId.includes(matchId))
  //     )
  //   }
  // }, [userId])

  return (
    <>
      <h1 className='explore'>
        <header>
          {' '}
          <p className='pageHeader'>Explore Matches</p>
        </header>
      </h1>
      <div className='explore pageHeader'>
        <main>
          {loading ? (
            <Spinner />
          ) : matches && matches.length > 0 ? (
            <>
              <div className='categoryListings'>
                <div className='scoreGrid'>
                  {matches.map((match) => (
                    <MatchItem
                      key={match.id}
                      matchId={match.id}
                      match={match.data}
                      isAdmin={isAdmin}
                      userId={userId}
                    />
                  ))}
                </div>
                {lastFetchedMatch && (
                  <p className='loadMore' onClick={onFetchMoreMatches}>
                    Load more
                  </p>
                )}
              </div>
            </>
          ) : (
            <p>No matches to show</p>
          )}
        </main>
      </div>
    </>
  )
}
