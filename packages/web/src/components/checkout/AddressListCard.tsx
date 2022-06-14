import { addrCollection } from '@/concerns/query'
import { useUser } from '@/core/RootContext'
import { UserAddressModel } from '@thebanana-members/core/lib/models'
import { getFirestore, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { NewAddressForm } from './NewAddressForm'

export const AddressListCard: React.FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext()
    const db = getFirestore()
    const { uid } = useUser()
    const [addresses, setAddresses] = useState<UserAddressModel[]>([])

    useEffect(() => {
        if (uid) {
            const unsubscribe = onSnapshot(addrCollection(db, uid), (addr) => {
                const addresses = addr.docs.map((doc) => doc.data())
                setAddresses(addresses)
            })
            return () => unsubscribe()
        }
        return () => {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid])

    return (
        <div className="p-4 rounded shadow-md border">
            <h2 className="text-sub-title font-semibold">ที่อยู่ในการจัดส่งเอกสาร</h2>
            <ul>
                {addresses.map(({ id, address }) => (
                    <li key={id} className="py-2">
                        <input
                            className="form-radio self-center"
                            id={id}
                            type="radio"
                            value={id}
                            {...register('shippingAddressId', { required: 'กรุณาเลือก' })}
                        />
                        <label htmlFor={id} className="ml-4">
                            {address}
                        </label>
                    </li>
                ))}
                <NewAddressForm enabled />
                <small className="text-red-500">{errors.shippingAddressId?.message}</small>
            </ul>
        </div>
    )
}
