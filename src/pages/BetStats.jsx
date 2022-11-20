import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db } from "../firebase.config";
import { toast } from 'react-toastify'
import Spinner from "../components/Spinner";
import UserItem from '../components/UserItem'


function Users(){
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async() => {
      try {
        const usersRef = collection(db, 'users')

        const q = query(usersRef, orderBy('points', 'desc')) 

        const querySnap = await getDocs(q)

        const users = []
        querySnap.forEach((doc) => {
          return users.push({data: doc.data()})
        })

        setUsers(users)
        setLoading(false)

      } catch (error) {
        toast.error('could not fetch matches')
      }
    }
    fetchUsers()
  }, [])
  return (
    <h1>
      <header>
        {' '}
        <p className='pageHeader'>Standings</p>
        <main>
          {loading ? (<Spinner />) : users && users.length > 0 ? (
            <div>
                <UserItem
                data={users}
                />                
            </div>
          ) : (
            <p> No users to show</p>
          )}
        </main>
      </header>
    </h1>
  )
}


export default Users
