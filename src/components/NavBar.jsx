import { useNavigate, useLocation } from 'react-router-dom'
import { FaRegFutbol as MatchesIcon } from 'react-icons/fa'
import { FaRegCompass as ExploreIcon } from 'react-icons/fa'
import { FaRegUser as ProfileIcon } from 'react-icons/fa'

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true
    }
  }
  return (
    <footer className='navbar'>
      <nav className='navbarNav'>
        <ul className='navbarListItems'>
          <li
            className='navbarListItem'
            style={
              pathMatchRoute('/bet-stats')
                ? { color: '#2c2c2c' }
                : { color: '#8f8f8f' }
            }
            onClick={() => navigate('/bet-stats')}
          >
            <ExploreIcon size='1.5em' />
            <p
              className={
                pathMatchRoute('/bet-stats')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Bet Stats
            </p>
          </li>
          <li
            className='navbarListItem'
            style={
              pathMatchRoute('/') ? { color: '#2c2c2c' } : { color: '#8f8f8f' }
            }
            onClick={() => navigate('/')}
          >
            <MatchesIcon size='1.5em' />
            <p
              className={
                pathMatchRoute('/')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Matches
            </p>
          </li>
          <li
            className='navbarListItem'
            style={
              pathMatchRoute('/profile')
                ? { color: '#2c2c2c' }
                : { color: '#8f8f8f' }
            }
            onClick={() => navigate('/profile')}
          >
            <ProfileIcon size='1.5em' />
            <p
              className={
                pathMatchRoute('/profile')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default NavBar
