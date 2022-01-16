import useUserInfo from '@/concerns/use-user-info'
import { useEffect, useState } from 'react'

export type CheckoutFormField = {
    studentName: string
    school: string
    nickname: string
    shippingAddress: string
}

export type AddressFormProps = any

export const AddressForm: React.VFC<AddressFormProps> = ({ register, errors }) => {
    const { getAddrList } = useUserInfo()
    const [addresses, setAddresses] = useState<{ id: string; address: string }[]>([])

    useEffect(() => {
        getAddrList().then((doc) => {
            setAddresses(doc.docs.map((item) => ({ id: item.id, address: item.data().address })))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ul>
            {addresses.map(({ id, address }) => (
                <li key={id} className="py-2">
                    <input
                        className="self-center"
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
            <small className="text-red-500">{errors.shippingAddressId?.message}</small>
        </ul>
    )
}
