import { useEffect, useState } from 'react'
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

export default function Matches() {
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedMatch, setLastFetchedMatch] = useState(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        //Get reference to the collection
        const matchesRef = collection(db, 'matches')

        //create query
        const q = query(matchesRef, orderBy('time'), limit(10))

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

  return (
    <h1 className='explore'>
      <header>
        {' '}
        <p className='pageHeader'>Explore Matches</p>
        <main>
          {/* <div className='category'>
            <header>
              <p className='pageHeader'> 

              </p>
            </header>
          </div> */}
          {loading ? (
            <Spinner />
          ) : matches && matches.length > 0 ? (
            <>
              <main>
                <ul className='categoryListings'>
                  {matches.map((match) => (
                    <MatchItem
                      key={match.id}
                      match={match.data}
                      id={match.id}
                    />
                  ))}
                </ul>
              </main>
              {lastFetchedMatch && (
                <p className='loadMore' onClick={onFetchMoreMatches}>
                  Load more
                </p>
              )}
            </>
          ) : (
            <p>No matches to show</p>
          )}
        </main>
      </header>
    </h1>
  )
}
