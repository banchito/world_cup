import { Link } from 'react-router-dom'
import { MdOutlineCasino } from 'react-icons/md'
import { MdEdit } from 'react-icons/md'
import { useIsAdmin } from '../hooks/useIsAdmin.js'
import { getAuth } from 'firebase/auth'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner.jsx'

function MatchItem({
  id,
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
  const { loggedIn, checkingStatus } = useAuthStatus()
  const { isAdmin } = useIsAdmin(getAuth().currentUser?.uid)

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

  if (checkingStatus) {
    return <Spinner />
  }
  return (
    <div className='scoreCard'>
      <div className='scoreCardHeader'>
        Group {group}
        {loggedIn ? (
          <Link to={`/create-bet/${id}`}>
            <MdOutlineCasino size='2.5em' />
          </Link>
        ) : (
          <Link to={`/sign-in`}>Sing-in</Link>
        )}
      </div>
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

      <div className='scoreCardFooter'>{isAdmin && <MdEdit size='1em' />}</div>
    </div>
  )
}

export default MatchItem
