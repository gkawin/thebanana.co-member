import { useUserInfoContext } from '@/core/RootContext'
import { useFormContext } from 'react-hook-form'
import { NewAddressForm } from './NewAddressForm'

export const AddressListCard: React.FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext()
    const { addresses } = useUserInfoContext()
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
