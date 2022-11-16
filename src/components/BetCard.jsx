import { useState } from 'react'
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { dateToString, matchResult } from '../helpers/helperFunctions'

export default function BetCard({ data, setLoading, id }) {
  const [changeScore, setChangeScore] = useState(false)
  const [score, setScore] = useState({
    home_score: data.home_team_goals,
    away_score: data.away_team_goals,
  })
  const { home_score, away_score } = score
  let matchDate = dateToString(data.matchTime)

  const updateBet = async (matchDate) => {
    //call the matchtime directly from db
    const today = new Date()
    if (matchDate < today.getTime() / 1000) {
      return toast.error('Bets are closed for this game')
    }
    setLoading(true)
    const result = matchResult(
      home_score,
      away_score,
      data.away_team_id,
      data.home_team_id
    )

    const updatedBetinfo = {
      away_team_goals: away_score,
      home_team_goals: home_score,
      is_draw: result.isDraw,
      winner: result.winner,
      loser: result.loser,
      updateTimeStamp: serverTimestamp(),
    }
    try {
      const userBetRef = doc(db, 'user_bet', id)

      await updateDoc(userBetRef, updatedBetinfo)
      setLoading(false)
      toast.success('Chages saved')
    } catch (error) {
      setLoading(false)
      toast.error('Could not update your bet')
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
      <div className='scoreGrid'>
        <div className='adminCard'>
          <div className='scoreCardHeader scoreCardHeaderUpdate '>
            Update Bet Before: {matchDate}
          </div>
          <div className='scoreCardBody'>
            <div className='teamInfoModal'>
              <p className='teamNameModal'>{data.home_team}</p>
              <div className='flagScoreContainerModal'>
                <img
                  className='team_flag_img'
                  src={data.home_team_sm_flag_url}
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
              <p className='teamNameModal'>{data.away_team}</p>
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
                  src={data.away_team_sm_flag_url}
                  alt='flag'
                />
              </div>
            </div>
          </div>
          <div className='betCardButtonContainer'>
            <button
              type='button'
              className='logOut'
              onClick={() => {
                changeScore && updateBet(data.matchTime.seconds)
                setChangeScore((prevState) => !prevState)
              }}
            >
              {changeScore ? 'Submit' : 'Edit score '}
            </button>
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
    </>
  )
}
