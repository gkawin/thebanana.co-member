import React from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import styles from './new-address-form.module.css'

export type NewAddressFormFields = {
    commonAddr: string
    subDistrict: string
    city: string
    province: string
    postcode: string
}

export const NewAddressForm: React.VFC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewAddressFormFields>()
    const handleSubmitNewAddress = async (data: NewAddressFormFields) => {
        console.log(data)
    }

    return (
        <>
            <Modal isOpen>
                <form className={`${styles['new-address-form']}`} onSubmit={handleSubmit(handleSubmitNewAddress)}>
                    <h2 className="text-sub-title font-semibold">เพิ่มที่อยู่ใหม่</h2>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="commonAddr">ที่อยู่</label>
                        <textarea
                            id="commonAddr"
                            className="form-textarea rounded resize-none text-sm"
                            {...register('commonAddr', { required: 'กรุณาระบุ' })}
                        />
                        <small className="text-red-500">{errors.commonAddr?.message}</small>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="postcode">รหัสไปรณีย์</label>
                        <input
                            id="postcode"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="form-input rounded text-sm"
                            {...register('postcode', { required: 'กรุณาระบุ' })}
                        />
                        <small className="text-red-500">{errors.postcode?.message}</small>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="subDistrict">แขวง/ตำบล</label>
                        <input
                            id="subDistrict"
                            className="form-input rounded text-sm"
                            type="text"
                            {...register('subDistrict', { required: 'กรุณาระบุ' })}
                        />
                        <small className="text-red-500">{errors.subDistrict?.message}</small>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="city">เขต/อำเภอ</label>
                        <input
                            id="city"
                            className="form-input rounded text-sm"
                            type="text"
                            {...register('city', { required: 'กรุณาระบุ' })}
                        />
                        <small className="text-red-500">{errors.city?.message}</small>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="province">จังหวัด</label>
                        <input
                            id="province"
                            className="form-input rounded text-sm"
                            type="text"
                            {...register('province', { required: 'กรุณาระบุ' })}
                        />
                        <small className="text-red-500">{errors.province?.message}</small>
                    </div>

                    <button type="submit" className="bg-indigo-500 text-white rounded p-2 my-2 block w-full">
                        <span>+</span>
                        <span>เพิ่มที่อยู่ใหม่</span>
                    </button>
                </form>
            </Modal>
            <button type="button" className="border border-indigo-500 rounded p-2 my-2 block w-full">
                <span>+</span>
                <span>เพิ่มที่อยู่ใหม่</span>
            </button>
        </>
    )
}
