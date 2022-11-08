import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import bedIcon from '../assets/svg/badgeIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

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
  //   console.log(
  //     group,
  //     home_team,
  //     home_team_flag_url,
  //     home_team_goals,
  //     home_team_id,
  //     away_team,
  //     away_team_flag_url,
  //     away_team_goals,
  //     away_team_id,
  //     time.toDate()
  //   )
  return (
    <li className='categoryListing'>
      <Link className='categoryListingLink'>
        <img alt='flag' className='categoryListingImg' />
        <div className='categoryListingDetails'>
          <p className='categoryListingLocation'></p>
        </div>
      </Link>
    </li>
  )
}

export default MatchItem
