import { useEffect, useState, useRef } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'

export const useIsAdmin = (uid) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      const getIsAdmin = async () => {
        const docRef = doc(db, 'users', uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setIsAdmin(docSnap.data().isAdmin)
        }
      }

      getIsAdmin()
    }
    return () => {
      isMounted.current = false
    }
  }, [isMounted, uid])

  return { isAdmin }
}
