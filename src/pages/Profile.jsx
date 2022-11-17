import { useState, useContext, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import {
  updateDoc,
  doc,
  serverTimestamp,
  addDoc,
  collection,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useIsAdmin } from '../hooks/useIsAdmin'
import Spinner from '../components/Spinner'
import AddMatch from '../components/AddMatch'
// import UserContext from '../Context/UserContext'
import BetCard from '../components/BetCard'
import { fetchUserBets } from '../Context/UserActions'

function Profile() {
  // const { dispatch } = useContext(UserContext)
  const auth = getAuth()
  const [loading, setLoading] = useState(false)
  const [changeDetails, setChangeDetails] = useState(false)
  const [addTeam, setAddTeam] = useState(false)
  const [showMyBets, setShowMyBets] = useState(false)
  const [userBets, setuserBets] = useState([])
  const [adminFormData, setAdminFormData] = useState({
    country: '',
    flag_url: '',
    group: '',
  })
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const { isAdmin } = useIsAdmin(auth.currentUser.uid)
  const { name, email } = formData
  const { country, flag_url, group } = adminFormData

  const navigate = useNavigate()

  const onLogout = () => {
    auth.signOut()
    // dispatch({ type: 'GET_USER_ID', payload: '' })
    // dispatch({ type: 'GET_USER_BETS', payload: [] })
    navigate('/')
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in fb
        await updateProfile(auth.currentUser, { displayName: name })
        //update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)

        await updateDoc(userRef, { name })
        setLoading(false)
        toast.success('Chages saved')
      }
    } catch (error) {
      toast.error('Could not update profile details')
    }
  }

  const onSubmitAdmin = async (e) => {
    if (!country || !flag_url || !group)
      return toast.error(`provide all team's info`)
    e.preventDefault()
    setLoading(true)
    try {
      const formDataCopy = { ...adminFormData }
      formDataCopy.timestamp = serverTimestamp()
      await addDoc(collection(db, 'teams'), formDataCopy)
      setLoading(false)
      toast.success('Team saved')
      setAdminFormData({ country: '', flag_url: '', group: '' })
      setAddTeam((prevState) => !prevState)
    } catch (error) {
      toast.error('Could not add new team')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onChangeAdmin = (e) => {
    setAdminFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  useEffect(() => {
    const getUserBets = async () => {
      const { bets } = await fetchUserBets(auth.currentUser.uid)
      setuserBets(bets)
    }
    getUserBets()
  }, [auth.currentUser.uid])

  return (
    <>
      <div className='profile'>
        {loading && <Spinner />}
        <header className='profileHeader'>
          <p className='pageHeader'>My Profile</p>
          <button type='button' onClick={onLogout} className='logOut'>
            Logout
          </button>
        </header>

        <main className='profileContainer'>
          <div className='profileDetailsHeader'>
            <p className='profileDetailsText'>Personal Details</p>
            <p
              onClick={() => {
                changeDetails && onSubmit()
                setChangeDetails((prevState) => !prevState)
              }}
              className='changePersonalDetails'
            >
              {changeDetails ? 'done' : 'change'}
            </p>
          </div>
          <div className='profileCard'>
            <form>
              <input
                type='text'
                id='name'
                className={!changeDetails ? 'profileName' : 'profileNameActive'}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
              <input
                type='text'
                id='email'
                className={
                  !changeDetails ? 'profileEmail' : 'profileEmailActive'
                }
                disabled={true}
                value={email}
                onChange={onChange}
              />
            </form>
          </div>
          {isAdmin && (
            <button
              type='button'
              className='logOut'
              onClick={() => {
                setShowMyBets((prevState) => !prevState)
              }}
            >
              {showMyBets ? 'Show my bets' : 'Show Admin'}
            </button>
          )}

          <div className='editBetSection'>
            <p className='personalDetailsText'>My Bets</p>
            {userBets.length > 0 &&
              userBets.map((userbet) => (
                <BetCard
                  key={userbet.id}
                  id={userbet.id}
                  setLoading={setLoading}
                  data={userbet.data}
                />
              ))}
          </div>
          {isAdmin && showMyBets && (
            <>
              <div className='profileDetailsHeader'>
                <p
                  onClick={() => {
                    setAddTeam((prevState) => !prevState)
                  }}
                  className='changePersonalDetails'
                >
                  {addTeam ? 'done' : 'add Team'}
                </p>
              </div>
              <div className='adminCard'>
                <form>
                  <label>
                    Country:
                    <input
                      type='text'
                      id='country'
                      className={!addTeam ? 'profileName' : 'profileNameActive'}
                      disabled={!addTeam}
                      value={country}
                      onChange={onChangeAdmin}
                    />
                  </label>
                  <label>
                    Flag Url:
                    <input
                      type='text'
                      id='flag_url'
                      className={!addTeam ? 'profileName' : 'profileNameActive'}
                      disabled={!addTeam}
                      value={flag_url}
                      onChange={onChangeAdmin}
                    />
                  </label>
                  <label>
                    Group:
                    <input
                      type='text'
                      id='group'
                      className={!addTeam ? 'profileName' : 'profileNameActive'}
                      disabled={!addTeam}
                      value={group}
                      onChange={onChangeAdmin}
                    />
                  </label>
                </form>
                {country && flag_url && group && (
                  <button
                    onClick={onSubmitAdmin}
                    disabled={!addTeam}
                    className={
                      country && flag_url && group ? 'submit' : 'submitDisabled'
                    }
                  >
                    Submit
                  </button>
                )}
              </div>
              <AddMatch />
            </>
          )}
        </main>
      </div>
    </>
  )
}

export default Profile
