import { useFirebase } from '@/core/RootContext'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { useCallback } from 'react'

export default function useUserInfo() {
    const { db, auth } = useFirebase()
    const schoolCol = collection(db, 'users', auth.currentUser.uid, 'school')
    const addrCol = collection(db, 'users', auth.currentUser.uid, 'address')
    const userDoc = doc(db, 'users', auth.currentUser.uid)

    return {
        getSchoolList: useCallback(() => getDocs(query(schoolCol, orderBy('createdOn', 'desc'))), [schoolCol]),
        getAddrList: useCallback(() => getDocs(query(addrCol, orderBy('createdOn', 'desc'))), [addrCol]),
        getUser: useCallback(() => getDoc(userDoc), [userDoc]),
    }
}
