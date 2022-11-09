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
      <p className='categoryListingName'> Group: {group}</p>
      <p className='categoryListingName'> {dateString}</p>

      <div className=''>
        <img src={home_team_flag_url} alt='flag' />
        <p className='categoryListingName'>{home_team}</p>
        <p className='categoryListingName'>{home_team_goals}</p>
      </div>

      <div className=''>
        <img src={away_team_flag_url} alt='flag' />
        <p className='categoryListingName'>{away_team}</p>
        <p className='categoryListingLocation'>{away_team_goals}</p>
      </div>
    </li>
  )
}

export default MatchItem
