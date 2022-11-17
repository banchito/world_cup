import { useEffect } from 'react'
import {
  getDocs,
  query,
  addDoc,
  serverTimestamp,
  collection,
  where,
  doc,
  writeBatch,
  updateDoc,
  onSnapshotsInSync,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { matchResult, isNum } from '../helpers/helperFunctions'

export default function CreateBetModal({
  matchId,
  updateScoreAdmin,
  onClose,
  isAdmin,
  info: {
    away_team_id,
    away_team,
    away_team_goals,
    away_team_sm_flag_url,
    home_team,
    home_team_id,
    home_team_goals,
    home_team_sm_flag_url,
    userId,
    time,
  },
}) {
  const [loading, setLoading] = useState(false)
  const [existingBet, setExistingBet] = useState([])
  const [changeScore, setChangeScore] = useState(false)
  const [score, setScore] = useState({
    home_score: home_team_goals ? home_team_goals : 0,
    away_score: away_team_goals ? away_team_goals : 0,
  })
  const { home_score, away_score } = score
  const submitBet = async () => {
    if (!isNum(score.home_score) || !isNum(score.away_score)) {
      setChangeScore((prevState) => !prevState)
      return toast.error(`provide a valid score`)
    }
    setLoading(true)
    const result = matchResult(
      home_score,
      away_score,
      away_team_id,
      home_team_id
    )

    try {
      const betInfo = {
        away_team_id,
        home_team_id,
        away_team_sm_flag_url,
        away_team_goals: parseInt(away_score),
        away_team,
        is_draw: result.is_draw,
        winner: result.winner,
        loser: result.loser,
        home_team_sm_flag_url,
        home_team_goals: parseInt(home_score),
        home_team,
        points_won: 0,
        matchId,
        userId,
        matchTime: time,
        timestamp: serverTimestamp(),
      }
      await addDoc(collection(db, 'user_bet'), betInfo)
      setLoading(false)
      toast.success('Bet Saved')
      onClose()
    } catch (error) {
      console.log(error)
      toast.error(`could not save bet`)
    }
  }

  const submitMatchResult = async () => {
    if (!isAdmin) return toast.error(`No credentials for this task`)
    if (!isNum(score.home_score) || !isNum(score.away_score)) {
      setChangeScore((prevState) => !prevState)
      return toast.error(`provide a valid score`)
    }

    setLoading(true)
    const result = matchResult(
      home_score,
      away_score,
      away_team_id,
      home_team_id
    )

    const matchResultInfo = {
      away_team_goals: parseInt(away_score),
      home_team_goals: parseInt(home_score),
      is_draw: result.is_draw,
      winner: result.winner,
      loser: result.loser,
      updateTimeStamp: serverTimestamp(),
    }

    try {
      //update match result
      //const matchRef = doc(db, 'matches', matchId)
      // await updateDoc(matchRef, matchResultInfo)

      //update all bets for this match
      const betsRef = collection(db, 'user_bet')
      const q = query(betsRef, where('matchId', '==', matchId))
      const querySnap = await getDocs(q)
      const bets = []

      querySnap.forEach((doc) => {
        return bets.push({ id: doc.id, data: doc.data() })
      })
      //2 pointer array
      let betsWithTwoPoints = []
      //5 pointer array
      let betsWithFivePoints = []

      betsWithTwoPoints = await bets.filter((doc) => {
        //console.log(doc.data.is_draw)
        // console.log(doc.data.is_draw, matchResultInfo.is_draw)
        // console.log(doc.data.winner === matchResultInfo.winner)
        // console.log(doc.data.loser === matchResultInfo.loser)
        return (
          doc.data.is_draw === matchResultInfo.is_draw &&
          doc.data.winner === matchResultInfo.winner &&
          doc.data.loser === matchResultInfo.loser &&
          (doc.data.away_team_goals !== matchResultInfo.away_team_goals ||
            doc.data.home_team_goals !== matchResultInfo.home_team_goals)
        )
      })

      betsWithFivePoints = bets.filter((doc) => {
        return (
          doc.data.away_team_goals === matchResultInfo.away_team_goals &&
          doc.data.home_team_goals === matchResultInfo.home_team_goals
        )
      })

      console.log(betsWithTwoPoints, betsWithFivePoints)

      const batch = writeBatch(db)

      betsWithTwoPoints.forEach(async (bet) => {
        const docRef = doc(db, 'user_bet', bet.id)
        return batch.update(docRef, {
          points_won: 2,
        })
      })

      betsWithFivePoints.forEach(async (bet) => {
        const docRef = doc(db, 'user_bet', bet.id)
        return batch.update(docRef, {
          points_won: 5,
        })
      })

      await batch.commit()

      // querySnap.forEach((doc) => {
      //   return bets.push({ id: doc.id, data: doc.data() })
      // })
      // const batch = writeBatch(db)
      // querySnap.forEach(async (bet) => {
      //   console.log(bet.id)
      //   const docRef = doc(db, 'user_bet', bet.id)
      //   console.log(bet.id)
      //   return batch.update(docRef, {
      //     points_won: 10,
      //   })
      // })

      // for (let bet of bets) {
      //   console.log(bet)
      //   const docRef = doc(db, 'user_bet', bet.id)
      //   if (
      //     bet.data().away_team_goals === matchResultInfo.away_team_goals &&
      //     bet.data().home_team_goals === matchResultInfo.home_team_goals
      //   ) {
      //     return batch.update(docRef, {
      //       points_won: 10,
      //     })
      //   }
      // }

      // let points = 0
      // querySnap.forEach(async (item) => {
      //   console.log(item.id)
      //   if (
      //     item.data().away_team_goals === matchResultInfo.away_team_goals &&
      //     item.data().home_team_goals === matchResultInfo.home_team_goals
      //   ) {
      //     await updateDoc(doc(db, 'user_bet', item.id), { points_won: 1 })
      //   }
      // if (
      //   doc.data().isDraw === matchResultInfo.isDraw ||
      //   doc.data().winner === matchResultInfo.winner ||
      //   doc.data().matchResultInfo.loser === matchResultInfo.loser
      // ) {
      //   points = points + 2
      // }
      // doc.update({ points_won: points })
      //})

      // db.collection('user_bet')
      //   .where('matchId', '==', matchId)
      //   .get()
      //   .then(async (snaps) => {
      //     const updates = []
      //     snaps.forEach((doc) => {
      //       let points = 0
      //       if (
      //         doc.data().away_team_goals === matchResultInfo.away_team_goals &&
      //         doc.data().home_team_goals === matchResultInfo.home_team_goals
      //       ) {
      //         points = 3
      //         updates.push(doc.ref.update({ points_won: 3 }))
      //       }
      //       if (
      //         doc.data().isDraw === matchResultInfo.isDraw ||
      //         doc.data().winner === matchResultInfo.winner ||
      //         doc.data().matchResultInfo.loser === matchResultInfo.loser
      //       ) {
      //         updates.push(doc.ref.update({ points_won: points + 2 }))
      //       }
      //     })
      //     await Promise.all(updates)
      //   })

      setLoading(false)
      toast.success('Match Result Updated')
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error('Could Not Update Match Result')
    }
  }

  const onChange = (e) => {
    setScore((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  useEffect(() => {
    const fetchUserBets = async () => {
      try {
        const betsRef = collection(db, 'user_bet')
        const q = query(
          betsRef,
          where('userId', '==', userId),
          where('matchId', '==', matchId)
        )
        const querySnap = await getDocs(q)
        const result = []
        querySnap.forEach((doc) => {
          return result.push({ id: doc.id, data: doc.data() })
        })
        setExistingBet(result)
      } catch (error) {
        return 'error'
      }
    }
    fetchUserBets()
  }, [matchId, userId])

  const handleClick = () => {
    if (!updateScoreAdmin) {
      changeScore && submitBet()
      setChangeScore((prevState) => !prevState)
    } else {
      changeScore && submitMatchResult()
      setChangeScore((prevState) => !prevState)
    }
  }

  return (
    <>
      {' '}
      {loading && <Spinner />}
      <div className='backgroundOverlay' onMouseDown={onClose}>
        <div
          className='modalContainer'
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className='scoreCardModal'>
            {updateScoreAdmin ? (
              <div className='scoreCardHeaderModal'>Set Match Result</div>
            ) : (
              <div className='scoreCardHeaderModal'>
                {existingBet.length > 0
                  ? 'Update Bet On Profile'
                  : 'Place Your Bet'}
              </div>
            )}
            <div className='scoreCardBodyModal'>
              <div className='teamInfoModal'>
                <p className='teamNameModal'>{home_team}</p>
                <div className='flagScoreContainerModal'>
                  <img
                    className='team_flag_img'
                    src={home_team_sm_flag_url}
                    alt='flag'
                  />
                  <input
                    type='number'
                    id='home_score'
                    className={!changeScore ? 'homeScore' : 'editScoreActive'}
                    disabled={!changeScore}
                    value={
                      existingBet.length > 0 && !updateScoreAdmin
                        ? existingBet[0].data.home_team_goals
                        : home_score
                    }
                    maxLength='4'
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className='teamInfoModal'>
                <p className='teamNameModal'>{away_team}</p>
                <div className='flagScoreContainerModal'>
                  <input
                    type='number'
                    id='away_score'
                    className={!changeScore ? 'awayScore' : 'editScoreActive'}
                    disabled={!changeScore}
                    value={
                      existingBet.length > 0 && !updateScoreAdmin
                        ? existingBet[0].data.away_team_goals
                        : away_score
                    }
                    maxLength='4'
                    onChange={onChange}
                  />
                  <img
                    className='team_flag_img'
                    src={away_team_sm_flag_url}
                    alt='flag'
                  />
                </div>
              </div>
            </div>
            <div className='betCardButtonContainer'>
              {existingBet.length > 0 && !updateScoreAdmin ? (
                <>
                  <Link type='button' className='logOut' to='/profile'>
                    {'To Profile'}
                  </Link>
                  <button
                    onClick={() => {
                      onClose()
                    }}
                    type='button'
                    className='logOut buttonOutline'
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button type='button' className='logOut' onClick={handleClick}>
                  {changeScore ? 'Submit' : 'Edit score '}
                </button>
              )}
              {changeScore && (
                <button
                  onClick={() => {
                    setChangeScore((prevState) => !prevState)
                  }}
                  type='button'
                  className='logOut buttonOutline'
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
