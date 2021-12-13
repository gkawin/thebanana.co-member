import useUserInfo from '@/concerns/use-user-info'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NewAddressForm, SavedNewAddressField } from './NewAddressForm'

export type CheckoutFormField = {
    studentName: string
    school: string
    nickname: string
    shippingAddress: string
}

export type BookingInfoFormProps = {
    onSubmit: (value: CheckoutFormField) => Promise<void> | void
}

export const BookingInfoForm: React.VFC<BookingInfoFormProps> = ({ onSubmit }) => {
    const { getAddrList } = useUserInfo()
    const [addresses, setAddresses] = useState<{ id: string; address: string }[]>([])

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<CheckoutFormField>()

    const handleSetNewAddr = (addr: SavedNewAddressField) => {
        setAddresses((state) => [].concat(addr).concat(state))
    }

    useEffect(() => {
        getAddrList().then((doc) => {
            setAddresses(doc.docs.map((item) => ({ id: item.id, address: item.data().address })))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="py-4">
            <h2 className="text-2xl font-semibold">รายละเอียดผู้เรียน</h2>
            <div className="p-4 rounded shadow-md border flex flex-col mb-4">
                <label htmlFor="studentName">ชื่อผู้เรียน</label>
                <input
                    type="text"
                    className="form-input rounded"
                    id="studentName"
                    {...register('studentName', { required: 'กรุณาระบุ' })}
                />
                <small className="text-red-500 mb-2">{errors.studentName?.message}</small>

                <label htmlFor="nickname">ชื่อเล่น</label>
                <input
                    type="text"
                    className="form-input rounded"
                    id="nickname"
                    {...register('nickname', { required: 'กรุณาระบุ' })}
                />
                <small className="text-red-500 mb-2">{errors.nickname?.message}</small>

                <label htmlFor="school">โรงเรียน</label>
                <input
                    type="text"
                    className="form-input rounded"
                    id="school"
                    {...register('school', { required: 'กรุณาระบุ' })}
                />
                <small className="text-red-500 mb-2">{errors.school?.message}</small>
            </div>

            <h2 className="text-sub-title font-semibold">ที่อยู่ในการจัดส่งเอกสาร</h2>
            <ul className="p-4 rounded shadow-md border">
                {addresses.map(({ id, address }) => (
                    <li key={id} className="py-2">
                        <input
                            className="self-center"
                            id={id}
                            type="radio"
                            value={id}
                            {...register('shippingAddress', { required: 'กรุณาเลือก' })}
                        />
                        <label htmlFor={id} className="ml-4">
                            {address}
                        </label>
                    </li>
                ))}

                <small className="text-red-500">{errors.shippingAddress?.message}</small>
                <NewAddressForm enabled setNewAddr={handleSetNewAddr} />
            </ul>
            <button type="submit" className="bg-indigo-500 rounded p-2 my-2 block w-full text-white">
                ไปยังหน้าชำระเงิน
            </button>
        </form>
    )
}
