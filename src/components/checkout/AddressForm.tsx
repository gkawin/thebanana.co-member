import { useFirebase } from '@/core/RootContext'
import { collection, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export const AddressForm: React.VFC = () => {
    const {
        register,
        formState: { errors },
    } = useForm()
    const [addresses, setAddresses] = useState<{ id: string; address: string }[]>([])
    const { auth, db } = useFirebase()

    useEffect(() => {
        if (!auth.currentUser.uid) return () => {}
        const unsubscribe = onSnapshot(collection(db, 'users', auth.currentUser.uid, 'address'), (docs) => {
            setAddresses(docs.docs.map((item) => ({ id: item.id, address: item.data().address })))
        })
        return () => unsubscribe()
    }, [auth.currentUser.uid, db])

    return (
        <div>
            <h2>ที่อยู่ในการจัดส่งเอกสาร</h2>
            {addresses.map(({ id, address }) => (
                <div
                    className={`rounded ${errors.address ? 'bg-red-100' : 'bg-indigo-100'} p-4 flex flex-row`}
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
            <button type="button" className="border border-indigo-500 rounded p-2 my-2 block w-full">
                <span>+</span>
                <span>เพิ่มที่อยู่ใหม่</span>
            </button>
        </div>
    )
}
