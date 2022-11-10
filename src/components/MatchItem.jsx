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
  //   console.log(home_team_sm_flag_url, home_team_flag_url)
  const options = {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  let dateString = time.toDate().toLocaleDateString(undefined, options)
  return (
    <li className='categoryListing'>
      <div className='container'>
          <div className="flags">
            <img src={home_team_flag_url} alt='flag' />
            <img src={away_team_flag_url} alt='flag' />
          </div>
            <div className="teams">
              <p className='categoryListingLocation'>{home_team}</p>
              <p className='categoryListingLocation'>{away_team}</p>
            </div>
          <div className="score">
            <p className='categoryListingLocation'>{home_team_goals}</p>
            <p className='categoryListingLocation'>{away_team_goals}</p>
          </div>
          <div className='time'>
            <p className='categoryListingLocation'> Group: {group}</p>
            <p className='categoryListingLocation'> {dateString}</p>         
          </div>         
      </div>    
    </li>
  )
}

export default MatchItem
