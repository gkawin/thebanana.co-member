import { useFirebase } from '@/core/RootContext'
import Model from '@/models/Model'
import { UserModel } from '@/models/UserModel'
import { UserSchoolModel } from '@/models/UserSchoolModel'
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query } from '@firebase/firestore'
import { useCallback } from 'react'

export default function useUserInfo() {
    const { db, auth } = useFirebase()
    const schoolCol = collection(db, 'users', auth.currentUser.uid, 'school').withConverter(
        Model.convert(UserSchoolModel)
    )
    const addrCol = collection(db, 'users', auth.currentUser.uid, 'address')
    const userDoc = doc(db, 'users', auth.currentUser.uid).withConverter(Model.convert(UserModel))

    return {
        getSchoolList: useCallback(() => getDocs(query(schoolCol, orderBy('createdOn', 'desc'))), [schoolCol]),
        getAddrList: useCallback(() => getDocs(query(addrCol, orderBy('createdOn', 'desc'))), [addrCol]),
        getUser: useCallback(() => getDoc(userDoc), [userDoc]),
    }
}
