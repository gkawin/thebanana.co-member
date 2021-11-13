import React from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'

export const NewAddressForm: React.VFC = () => {
    const { register, handleSubmit } = useForm()
    const handleSubmitNewAddress = async () => {}

    return (
        <>
            <Modal isOpen>
                <form className="new-address-form grid" onSubmit={handleSubmit(handleSubmitNewAddress)}>
                    <h2 className="text-sub-title font-semibold">เพิ่มที่อยู่ใหม่</h2>
                    <label htmlFor="commonAddr">ที่อยู่</label>
                    <textarea
                        id="commonAddr"
                        className="form-textarea rounded resize-none text-sm"
                        {...register('commonAddr', { required: 'กรุณาระบุ' })}
                    />

                    <label htmlFor="subDistrict">แขวง/ตำบล</label>
                    <input
                        id="subDistrict"
                        className="form-input rounded text-sm"
                        type="text"
                        {...register('subDistrict', { required: 'กรุณาระบุ' })}
                    />

                    <label htmlFor="city">เขต/อำเภอ</label>
                    <input
                        id="city"
                        className="form-input rounded text-sm"
                        type="text"
                        {...register('city', { required: 'กรุณาระบุ' })}
                    />

                    <label htmlFor="province">จังหวัด</label>
                    <input
                        id="province"
                        className="form-input rounded text-sm"
                        type="text"
                        {...register('province', { required: 'กรุณาระบุ' })}
                    />

                    <label htmlFor="postcode">รหัสไปรณีย์</label>
                    <input
                        id="postcode"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="form-input rounded text-sm"
                        {...register('postcode', { required: 'กรุณาระบุ' })}
                    />
                </form>
            </Modal>
            <button type="button" className="border border-indigo-500 rounded p-2 my-2 block w-full">
                <span>+</span>
                <span>เพิ่มที่อยู่ใหม่</span>
            </button>
        </>
    )
}
