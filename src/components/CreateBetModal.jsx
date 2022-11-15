import { useEffect } from 'react'
import {
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { isDraw, isNum } from '../helpers/helperFunctions'

export default function CreateBetModal({
  matchId,
  onClose,
  info: {
    away_team,
    away_team_goals,
    away_team_sm_flag_url,
    home_team,
    home_team_goals,
    home_team_sm_flag_url,
    userId,
  },
}) {
  const [loading, setLoading] = useState(false)
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
    const draw = isDraw(home_score, away_score)

    try {
      const betInfo = {
        away_team_goals: away_score,
        away_team,
        is_draw: draw,
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
              {/* {isUpdateBet
                ? 'update your bet on your profile'
                : 'place your bet'} */}
              Place Your Bet
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
                    value={home_score}
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
                    value={away_score}
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
          </div>
        </div>
      </div>
    </>
  )
}
