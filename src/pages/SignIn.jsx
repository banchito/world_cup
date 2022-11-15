import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from '../components/OAuth'
import UserContext from '../Context/UserContext'
import { fetchUserBets } from '../Context/UserActions'

function SignIn() {
  const { dispatch } = useContext(UserContext)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredentail = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      if (userCredentail.user) {
        dispatch({ type: 'GET_USER_ID', payload: userCredentail.user.uid })
        getUserBets(userCredentail.user.uid)
        navigate('/')
      }
    } catch (error) {
      toast.error('Bad User Credentials')
    }
  }
  const getUserBets = async (userId) => {
    const bets = await fetchUserBets(userId)
    console.log(bets)
    if (bets === 'error') {
      toast.error('Could not retrieve user bets')
    }
    dispatch({ type: 'GET_USER_BETS', payload: bets })
  }
  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back</p>
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            <input
              type='email'
              className='emailInput'
              placeholder='Email'
              id='email'
              value={email}
              onChange={onChange}
            />
            <div className='passwordInputDiv'>
              <input
                className='passwordInput'
                placeholder='Password'
                id='password'
                value={password}
                type={showPassword ? 'text' : 'password'}
                onChange={onChange}
              />
              <img
                src={visibilityIcon}
                alt='show password'
                className='showPassword'
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>
            <div className='forgotPasswordLinkContainer'>
              <Link to='/forgot-password' className='forgotPasswordLink'>
                Forgot Password
              </Link>
            </div>
            <div className='signInBar'>
              <p className='signInText'>Sign In</p>
              <button className='signInButton'>
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
              </button>
            </div>
          </form>
          <OAuth />
          <div className='registerLinkContainer'>
            <Link to='/sign-up' className='registerLink'>
              Sign Up Instead
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}

export default SignIn
