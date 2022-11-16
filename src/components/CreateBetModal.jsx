import { useEffect } from 'react'
import {
  getDocs,
  query,
  addDoc,
  serverTimestamp,
  collection,
  where,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { matchResult, isNum } from '../helpers/helperFunctions'

export default function CreateBetModal({
  matchId,
  onClose,
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
        away_team_goals: away_score,
        away_team,
        is_draw: result.isDraw,
        winner: result.winner,
        loser: result.loser,
        home_team_sm_flag_url,
        home_team_goals: home_score,
        home_team,
        matchId,
        userId,
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
            <div className='scoreCardHeaderModal'>
              {existingBet.length > 0
                ? 'Update Bet On Profile'
                : 'Place Your Bet'}
            </div>
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
                      existingBet.length > 0
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
                      existingBet.length > 0
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
              {existingBet.length > 0 ? (
                <Link type='button' className='logOut' to='/profile'>
                  {'Go to Profile'}
                </Link>
              ) : (
                <button
                  type='button'
                  className='logOut'
                  onClick={() => {
                    changeScore && submitBet()
                    setChangeScore((prevState) => !prevState)
                  }}
                >
                  {changeScore ? 'done' : 'Edit score '}
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
