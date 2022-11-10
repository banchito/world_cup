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
    // <li className='categoryListing'>
    //   <p className='categoryListingName'> Group: {group}</p>
    //   <p className='categoryListingName'> {dateString}</p>

    //   <div className=''>
    //     <img src={home_team_sm_flag_url} alt='flag' />
    //     <p className='categoryListingName'>{home_team}</p>
    //     <p className='categoryListingName'>{home_team_goals}</p>
    //   </div>

    //   <div className=''>
    //     <img src={away_team_sm_flag_url} alt='flag' />
    //     <p className='categoryListingName'>{away_team}</p>
    //     <p className='categoryListingName'>{away_team_goals}</p>
    //   </div>
    // </li>
    <section className='card'>
      <div className='contenedor'>
        <p className='categoryListingName'> Group: {group}</p>
        <div className='info'>
          <div className='flags'>
            <img src={home_team_sm_flag_url} alt='flag' />
            <img src={away_team_sm_flag_url} alt='flag' />
          </div>
          <div className='teams'>
            <span>{home_team}</span>
            <span>{away_team}</span>
          </div>
          <div className='score'>
            <span>{home_team_goals}</span>
            <span>{away_team_goals}</span>
          </div>
        </div>
        <div className='time'>
          <span>{dateString}</span>
        </div>
      </div>
    </section>
  )
}

export default MatchItem
