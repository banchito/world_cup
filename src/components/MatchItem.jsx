import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineCasino, MdEdit } from 'react-icons/md'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner.jsx'
import CreateBetModal from './CreateBetModal.jsx'
import { toast } from 'react-toastify'
import { dateToString } from '../helpers/helperFunctions'

function MatchItem({
  matchId,
  userId,
  isAdmin,
  email,
  match: {
    group,
    home_team,
    home_team_sm_flag_url,
    home_team_goals,
    home_team_id,
    away_team,
    away_team_sm_flag_url,
    away_team_goals,
    away_team_id,
    time,
  },
}) {
  const { loggedIn, checkingStatus } = useAuthStatus()
  const [showModal, setShowModal] = useState(null)

  let matchDate = dateToString(time)

  const showMatchBet = useCallback(() => {
    const today = new Date()
    if (time.seconds < today.getTime() / 1000) {
      return toast.error('Bets are closed for this game')
    }
    setShowModal({
      onClose() {
        setShowModal(null)
      },
      updateScoreAdmin: false,
    })
  }, [setShowModal, time.seconds])

  const updateScoreAdmin = useCallback(() => {
    setShowModal({
      onClose() {
        setShowModal(null)
      },
      updateScoreAdmin: true,
    })
  }, [setShowModal])

  if (checkingStatus) {
    return <Spinner />
  }
  return (
    <>
      {showModal && (
        <CreateBetModal
          onClose={showModal.onClose}
          isAdmin={isAdmin}
          updateScoreAdmin={showModal.updateScoreAdmin}
          matchId={matchId}
          info={{
            home_team_sm_flag_url,
            home_team_id,
            home_team,
            home_team_goals,
            away_team,
            away_team_sm_flag_url,
            away_team_id,
            away_team_goals,
            userId,
            email,
            time,
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
                <MdEdit size='2.5em' onClick={updateScoreAdmin} />
              </li>
            )}
            {loggedIn ? (
              <li onClick={showMatchBet} className='cardHeaderIcons'>
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
              <p>{matchDate}</p>
            </div>
          </div>
        </div>

        <div className='scoreCardFooter'></div>
      </div>
    </>
  )
}

export default MatchItem
