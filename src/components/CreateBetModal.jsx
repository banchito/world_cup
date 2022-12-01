import { useEffect } from 'react'
import {
  getDocs,
  query,
  addDoc,
  serverTimestamp,
  collection,
  where,
  increment,
  doc,
  writeBatch,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import RadioPenalty from './RadioPenalty'
import { matchResult, isNum } from '../helpers/helperFunctions'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Avatar from '@mui/material/Avatar'

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
    round,
    time,
    email,
  },
}) {
  const [loading, setLoading] = useState(false)
  const [existingBet, setExistingBet] = useState([])
  const [score, setScore] = useState({
    home_score: home_team_goals ? home_team_goals : 0,
    away_score: away_team_goals ? away_team_goals : 0,
  })
  const [penaltyWinner, setPenaltyWinner] = useState({
    pkWinner: 'none',
  })
  const { home_score, away_score } = score
  const { pkWinner } = penaltyWinner

  const submitBet = async () => {
    const today = new Date()
    if (time.seconds < today.getTime() / 1000) {
      return toast.error('Bets are closed for this game')
    }
    if (!isNum(score.home_score) || !isNum(score.away_score)) {
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
        email,
        pkWinner,
        isMatchResultUpdated: false,
        matchTime: time,
        timestamp: serverTimestamp(),
      }
      await addDoc(collection(db, 'user_bet'), betInfo)
      setLoading(false)
      toast.success('Bet Saved')
      onClose()
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(`could not save bet`)
    }
  }

  //Update match result
  const submitMatchResult = async () => {
    if (!isAdmin) return toast.error(`No credentials for this task`)
    if (!isNum(score.home_score) || !isNum(score.away_score)) {
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
      pkWinner: home_score !== away_score ? 'none' : pkWinner,
      match_finished: true,
      updateTimeStamp: serverTimestamp(),
    }

    try {
      //update match result
      const matchRef = doc(db, 'matches', matchId)
      await updateDoc(matchRef, matchResultInfo)

      //update all bets for this match and user points
      const betsRef = collection(db, 'user_bet')
      const q = query(betsRef, where('matchId', '==', matchId))
      const querySnap = await getDocs(q)
      const bets = []

      querySnap.forEach((doc) => {
        return bets.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      //1 pointer array
      let betsWithtOnePoint = []
      //2 pointer array
      let betsWithTwoPoints = []
      //3 pointer array
      let betsWithtThreePoints = []

      betsWithTwoPoints = await bets.filter((doc) => {
        return (
          doc.data.is_draw === matchResultInfo.is_draw &&
          doc.data.winner === matchResultInfo.winner &&
          doc.data.loser === matchResultInfo.loser &&
          (doc.data.away_team_goals !== matchResultInfo.away_team_goals ||
            doc.data.home_team_goals !== matchResultInfo.home_team_goals)
        )
      })

      betsWithtThreePoints = bets.filter((doc) => {
        return (
          doc.data.away_team_goals === matchResultInfo.away_team_goals &&
          doc.data.home_team_goals === matchResultInfo.home_team_goals
        )
      })

      betsWithtOnePoint = bets.filter((doc) => {
        return (
          doc.data.pkWinner !== 'none' &&
          matchResultInfo.pkWinner !== 'none' &&
          doc.data.pkWinner === matchResultInfo.pkWinner
        )
      })

      const batch = writeBatch(db)

      Promise.all([
        betsWithtOnePoint.map(async (bet) => {
          const docRef = doc(db, 'user_bet', bet.id)
          return await batch.update(docRef, {
            points_won: increment(1),
            isMatchResultUpdated: true,
          })
        }),
        betsWithtOnePoint.map(async (bet) => {
          const docRef = doc(db, 'users', bet.data.userId)
          return await batch.update(docRef, {
            points: increment(1),
          })
        }),
        betsWithTwoPoints.map(async (bet) => {
          const docRef = doc(db, 'user_bet', bet.id)
          return await batch.update(docRef, {
            points_won: increment(2),
            isMatchResultUpdated: true,
          })
        }),
        betsWithTwoPoints.map(async (bet) => {
          const docRef = doc(db, 'users', bet.data.userId)
          return await batch.update(docRef, {
            points: increment(2),
          })
        }),
        betsWithtThreePoints.map(async (bet) => {
          const docRef = doc(db, 'user_bet', bet.id)
          return batch.update(docRef, {
            points_won: increment(3),
            isMatchResultUpdated: true,
          })
        }),
        betsWithtThreePoints.map(async (bet) => {
          const docRef = doc(db, 'users', bet.data.userId)
          return await batch.update(docRef, {
            points: increment(3),
          })
        }),
        bets.map(async (bet) => {
          const docRef = doc(db, 'user_bet', bet.id)
          return batch.update(docRef, {
            isMatchResultUpdated: true,
          })
        }),
      ])

      await batch.commit()

      setLoading(false)
      toast.success('Match Result Updated')
      onClose()
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error('Could Not Update Match Result')
    }
  }

  const onChange = (e, newValue) => {
    setScore((prevState) => ({
      ...prevState,
      [e.target.name]: newValue,
    }))
  }

  const onChangePenaltyWinner = (e) => {
    setPenaltyWinner({ pkWinner: e.target.value })
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
      submitBet()
    } else {
      submitMatchResult()
    }
  }

  return (
    <>
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
            {existingBet.length > 0 && !updateScoreAdmin ? (
              <></>
            ) : (
              <div className='scoreCardBodyModal'>
                <div className='teamInfoModal'>
                  <p className='teamNameModal'>{home_team}</p>
                  <div className='flagScoreContainerModal'>
                    <img
                      className='team_flag_img'
                      src={home_team_sm_flag_url}
                      alt='flag'
                    />
                    <Avatar>{home_score}</Avatar>
                  </div>
                </div>
                <div className='teamInfoModal'>
                  <p className='teamNameModal'>{away_team}</p>
                  <div className='flagScoreContainerModal'>
                    <Avatar>{away_score}</Avatar>
                    <img
                      className='team_flag_img'
                      src={away_team_sm_flag_url}
                      alt='flag'
                    />
                  </div>
                </div>
              </div>
            )}
            {(existingBet.length < 1 || updateScoreAdmin) && (
              <>
                <Box sx={{ width: 200 }}>
                  <Slider
                    style={{ color: '#00cc66' }}
                    aria-label='Score'
                    defaultValue={0}
                    name={'home_score'}
                    valueLabelDisplay='auto'
                    step={1}
                    marks
                    min={0}
                    max={10}
                    onChange={onChange}
                  />

                  <Slider
                    style={{ color: '#00cc66' }}
                    aria-label='Score'
                    defaultValue={0}
                    name={'away_score'}
                    valueLabelDisplay='auto'
                    step={1}
                    marks
                    min={0}
                    max={10}
                    onChange={onChange}
                  />
                </Box>
                {round && (
                  <>
                    <span className='scoreCardHeaderModal'>
                      {updateScoreAdmin
                        ? `Set Pk Winner`
                        : `If there is a penalty shoot-out who wins?`}
                    </span>
                    <RadioPenalty
                      away_team={away_team}
                      away_team_id={away_team_id}
                      disabled={updateScoreAdmin && home_score !== away_score}
                      home_team={home_team}
                      home_team_id={home_team_id}
                      pkWinner={pkWinner}
                      onChangePenaltyWinner={onChangePenaltyWinner}
                    />
                  </>
                )}
              </>
            )}

            <div className='betCardButtonContainer'>
              {existingBet.length > 0 && !updateScoreAdmin ? (
                <Link type='button' className='logOut' to='/profile'>
                  {'To Profile'}
                </Link>
              ) : (
                <button type='button' className='logOut' onClick={handleClick}>
                  Submit
                </button>
              )}
              <button
                onClick={() => {
                  onClose()
                }}
                type='button'
                className='logOut buttonOutline'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
