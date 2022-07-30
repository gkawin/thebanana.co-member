import { addrCollection } from '@/concerns/query'
import { useUserInfo } from '@/core/RootContext'
import type { PaymentChargeBodyModel } from '@/models/payment/PaymentChargeBody.model'
import { UserAddressModel } from '@/models/UserAddressModel'
import { getFirestore, onSnapshot } from 'firebase/firestore'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

export const AddressListCard: React.FC<PropsWithChildren> = ({ children }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<PaymentChargeBodyModel>()
    const db = getFirestore()
    const { uid } = useUserInfo()
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
                {children}
                <small className="text-red-500">{errors.shippingAddressId?.message}</small>
            </ul>
        </div>
    )
}
