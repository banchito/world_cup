import { useCallback, useState, useEffect } from 'react'
// import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
// import { db } from '../firebase.config'
// import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { MdOutlineCasino, MdEdit } from 'react-icons/md'
import { useIsAdmin } from '../hooks/useIsAdmin.js'
import { useAuthStatus } from '../hooks/useAuthStatus'
import { getAuth } from 'firebase/auth'
import Spinner from './Spinner.jsx'
import CreateBetModal from './CreateBetModal.jsx'
import { fetchUserBets } from '../helpers/helperFunctions.js'

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
  const userId = getAuth().currentUser?.uid
  const { isAdmin } = useIsAdmin(userId)
  const [showModal, setShowModal] = useState(null)
  const [existingBets, setExistingBets] = useState([])
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    const getUserBets = async () => {
      setLoading(true)
      const bets = await fetchUserBets(userId)

      setLoading(false)
      setExistingBets(bets)
    }
    getUserBets()
  }, [userId])

  if (checkingStatus || loading) {
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
