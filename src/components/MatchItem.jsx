import { Link } from 'react-router-dom'
// import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
// import bedIcon from '../assets/svg/badgeIcon.svg'
// import bathtubIcon from '../assets/svg/bathtubIcon.svg'

function MatchItem({
  match: {
    group,
    home_team,
    home_team_flag_url,
    home_team_goals,
    home_team_id,
    away_team,
    away_team_flag_url,
    away_team_goals,
    away_team_id,
    time,
  },
}) {

  let dateString = time.toDate().toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return (
    <li className='categoryListing'>
      <Link className='categoryListingLink'>
        <p className='categoryListingLocation'> Group: {group}</p>
        <p className='categoryListingLocation'> {dateString}</p>

        <div className='categoryListingDetails'>
          <img src={home_team_flag_url} alt='flag' />
          <p className='categoryListingLocation'>{home_team}</p>
          <p className='categoryListingLocation'>{home_team_goals}</p>
        </div>

        <div className='categoryListingDetails'>
          <img src={away_team_flag_url} alt='flag' />
          <p className='categoryListingLocation'>{away_team}</p>
          <p className='categoryListingLocation'>{away_team_goals}</p>
        </div>
      </Link>
    </li>
  )
}

export default MatchItem
