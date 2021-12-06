import { useFirebase } from '@/core/RootContext'
import { collection, limit, onSnapshot, orderBy, query } from '@firebase/firestore'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NewAddressForm } from './NewAddressForm'

export const AddressForm: React.VFC = () => {
    const {
        register,
        formState: { errors },
    } = useForm()
    const [addresses, setAddresses] = useState<{ id: string; address: string }[]>([])
    const { auth, db } = useFirebase()

    useEffect(() => {
        const addrCol = collection(db, 'users', auth.currentUser.uid, 'address')
        const q = query(addrCol, orderBy('createdOn', 'desc'), limit(2))
        const unsubscribe = onSnapshot(q, (docs) => {
            setAddresses(docs.docs.map((item) => ({ id: item.id, address: item.data().address })))
        })
        return () => unsubscribe()
    }, [auth.currentUser.uid, db])

    return (
        <>
            <div className="text-sub-title font-semibold">ที่อยู่ในการจัดส่งเอกสาร</div>
            {addresses.map(({ id, address }) => (
                <div
                    className={`rounded ${errors.address ? 'bg-red-100' : 'bg-indigo-50 '} p-4 flex flex-row`}
                    key={id}
                >
                    <input
                        className="self-center"
                        id={id}
                        type="radio"
                        {...register('address', { required: 'กรุณาเลือก' })}
                    />
                    <label htmlFor={id} className="ml-4">
                        {address}
                    </label>
                </div>
            ))}
            <small className="text-red-500">{errors.address?.message}</small>
            <NewAddressForm enabled />
        </>
    )
}
