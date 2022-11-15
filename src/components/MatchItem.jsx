import { useCallback, useState, useContext } from 'react'
// import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { MdOutlineCasino, MdEdit } from 'react-icons/md'
import { useAuthStatus } from '../hooks/useAuthStatus'
import UserContext from '../Context/UserContext.js'
import Spinner from './Spinner.jsx'
import CreateBetModal from './CreateBetModal.jsx'

function MatchItem({
  isAdmin,
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
    id,
  },
}) {
  const {
    userId,
    userBets: { bets },
  } = useContext(UserContext)
  const { loggedIn, checkingStatus } = useAuthStatus()
  const [showModal, setShowModal] = useState(null)
  const [isUpdateBet, setIsUpdateBet] = useState(false)

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

  const showBetOnMatch = useCallback(() => {
    setShowModal({
      onClose() {
        setShowModal(null)
      },
    })
  }, [setShowModal])

  // useEffect(() => {
  //   console.log('in use effect')
  //   setIsUpdateBet(
  //     existingBets.map((existingBet) =>
  //       existingBet.data.matchId.includes(matchId)
  //     )
  //   )
  // }, [])

  if (checkingStatus) {
    return <Spinner />
  }
  return (
    <>
      {showModal && (
        <CreateBetModal
          onClose={showModal.onClose}
          matchId={id}
          info={{
            home_team_sm_flag_url,
            home_team,
            home_team_goals,
            away_team,
            away_team_sm_flag_url,
            away_team_goals,
            userId,
          }}
        />
      )}
      <div className='scoreCard'>
        <div className='scoreCardHeader'>
          Group {group}
          <ul className='headerIcons'>
            {isAdmin && (
              <li className='cardHeaderIcons'>
                {' '}
                <MdEdit size='2.5em' />
              </li>
            )}
            {loggedIn ? (
              <li onClick={showBetOnMatch} className='cardHeaderIcons'>
                <MdOutlineCasino size='2.5em' />
              </li>
            ) : (
              <li className='cardHeaderIcons'>
                {' '}
                <Link to={`/sign-in`}>Sing-in</Link>
              </li>
            )}
          </ul>
        </div>
        <div className='scoreCardBody'>
          <div className='scoreCardInfoGrid'>
            <div className='teamInfoContainer'>
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

        <div className='scoreCardFooter'></div>
      </div>
    </>
  )
}

export default MatchItem
