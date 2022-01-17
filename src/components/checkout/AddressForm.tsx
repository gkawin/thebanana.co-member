import { useUserInfoContext } from '@/core/RootContext'
import { useFormContext } from 'react-hook-form'

export type CheckoutFormField = {
    studentName: string
    school: string
    nickname: string
    shippingAddress: string
}

export type AddressFormProps = {}

export const AddressForm: React.VFC<AddressFormProps> = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext()
    const { addresses } = useUserInfoContext()
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
            <small className="text-red-500">{errors.shippingAddress?.message}</small>
        </ul>
    )
}
