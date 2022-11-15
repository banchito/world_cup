import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'
import UserContext from '../Context/UserContext'
import { fetchUserBets } from '../Context/UserActions'

function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { dispatch } = useContext(UserContext)

  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      //check for user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      //if user does not exist create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
          isAdmin: false,
          points: 0,
        })
      }
      dispatch({ type: 'GET_USER_ID', payload: user.uid })
      getUserBets(user.uid)
      navigate('/')
    } catch (error) {
      toast.error('could not authorize with Google')
    }
  }

  const getUserBets = async (userId) => {
    const bets = await fetchUserBets(userId)
    if (bets === 'error') {
      toast.error('Could not retrieve user bets')
    }
    dispatch({ type: 'GET_USER_BETS', payload: bets })
  }
  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with </p>
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img className='socialIconImg' src={googleIcon} alt='google' />
      </button>
    </div>
  )
}

export default OAuth
