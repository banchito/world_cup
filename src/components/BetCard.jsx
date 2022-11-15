import { useState } from 'react'

export default function BetCard({ data }) {
  console.log(data)
  const [changeScore, setChangeScore] = useState(false)
  const [score, setScore] = useState({
    home_score: data.home_team_goals,
    away_score: data.away_team_goals,
  })

  const updateBet = async () => {}
  const onChange = (e) => {
    setScore((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  return (
    <>
      <div className='modalContainer'>
        <div className='scoreCardModal'>
          <div className='scoreCardHeaderModal'>Update Bet</div>
          <div className='scoreCardBodyModal'>
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
                  value={data.home_team_goals}
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
                  value={data.away_team_goals}
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
          <button
            type='button'
            className='logOut'
            onClick={() => {
              changeScore && updateBet()
              setChangeScore((prevState) => !prevState)
            }}
          >
            {changeScore ? 'done' : 'Edit score '}
          </button>
        </div>
      </div>
    </>
  )
}
