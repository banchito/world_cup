import { Link } from 'react-router-dom'

// import bedIcon from '../assets/svg/badgeIcon.svg'
// import bathtubIcon from '../assets/svg/bathtubIcon.svg'

function MatchItem({
  match: {
    group,
    home_team,
    home_team_flag_url,
    home_team_sm_flag_url,
    home_team_goals,
    home_team_id,
    away_team,
    away_team_flag_url,
    away_team_sm_flag_url,
    away_team_goals,
    away_team_id,
    time,
  },
}) {
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  let dateString = time
    .toDate()
    .toLocaleDateString(undefined, options)
    .replace(',', '')
    .replace(',', '')

  return (
    <div className='scoreCard'>
      <div className='scoreCardHeader'>Group {group}</div>
      <div className='scoreCardBody'>
        <div className='scoreCardInfoGrid'>
          <div className='test'>
            <div className='teamInfo'>
              <img
                className='team_flag_img'
                src={home_team_sm_flag_url}
                alt='flag'
              />
              <p className='team_name'>{home_team}</p>
              <p className='team_goals'>{home_team_goals}</p>
            </div>
            <div className='teamInfo'>
              <img
                className='team_flag_img'
                src={away_team_sm_flag_url}
                alt='flag'
              />
              <p className='team_name'>{away_team}</p>
              <p className='team_goals'>{away_team_goals}</p>
            </div>
          </div>
          <div className='matchDateTime'>
            <p>{dateString}</p>{' '}
          </div>
        </div>
      </div>

      <div className='scoreCardFooter'>footer</div>
    </div>
  )
}

export default MatchItem
