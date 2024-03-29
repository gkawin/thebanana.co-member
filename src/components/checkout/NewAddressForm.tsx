import { useAxios, useUserInfo } from '@/core/RootContext'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import Datalist from '../forms/Datalist'
import { Curtain } from '../portal/Curtain'
import { SpinLoading } from '../portal/SpinLoading'
import styles from './new-address-form.module.css'

export type NewAddressFormFields = {
    commonAddr: string
    subdistrict: string
    district: string
    province: string
    postcode: string
    phoneNumber: string
}
export type SavedNewAddressField = NewAddressFormFields & {
    id: string
}

const debounce = (callback: Function, wait = 500) => {
    let timeoutId: any = null
    return (...args: any[]) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            callback.apply(null, args)
        }, wait)
    }
}

export type NewAddressFormProps = {
    enabled?: boolean
}

export const NewAddressForm: React.FC<NewAddressFormProps> = ({ enabled = true }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        resetField,
        reset,
    } = useForm<NewAddressFormFields>()
    const $axios = useAxios()
    const db = getFirestore()
    const { uid } = useUserInfo()
    const [isOpen, setIsOpen] = useState(false)
    const [addrOptions, setAddrOptions] = useState<NewAddressFormFields[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmitNewAddress = async (data: NewAddressFormFields) => {
        if (!enabled) return

        try {
            setIsLoading(true)
            const newAddr = {
                address: `${data.commonAddr}, ต.${data.subdistrict} อ.${data.district} จ.${data.province}, ${data.postcode} โทร: ${data.phoneNumber}`,
                ...data,
                createdOn: new Date(),
            }
            await addDoc(collection(db, 'users', uid, 'address'), newAddr)
            setIsOpen(false)
        } catch (error) {
            alert('เพิ่มข้อมูลไม่สำเร็จ')
        } finally {
            setIsLoading(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDebounce = useCallback(
        debounce(async (fun: Function) => await fun(), 500),
        []
    )
    const handleSelectedOption = (idx: number) => {
        const addrInfo = addrOptions[idx]
        if (!addrInfo) return
        for (const addr in addrInfo) {
            const value = addrInfo[addr as keyof NewAddressFormFields]
            setValue(addr as keyof NewAddressFormFields, value, { shouldValidate: true })
        }
    }

    useEffect(() => {
        const subscrible = watch((value, { name, type }) => {
            if (name === 'postcode' && type === 'change') {
                resetField('district')
                resetField('province')
                resetField('subdistrict')
                setAddrOptions([])
            }

            handleDebounce(async () => {
                if (name === 'postcode' && type === 'change' && value[name].length === 5) {
                    const { data } = await $axios.get('/api/geo/search/postcode', {
                        params: { keyword: encodeURIComponent(value.postcode) },
                    })
                    setAddrOptions(data)
                }
            })
        })
        return () => {
            subscrible.unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isOpen) {
            reset({ commonAddr: '', district: '', phoneNumber: '', postcode: '', province: '', subdistrict: '' })
            setAddrOptions([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    return (
        <>
            {isLoading && (
                <Curtain>
                    <SpinLoading />
                </Curtain>
            )}
            <Modal isOpen={isOpen && enabled}>
                <form
                    autoComplete="off"
                    className={`${styles['new-address-form']}`}
                    onSubmit={handleSubmit(handleSubmitNewAddress)}
                >
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
                        <label htmlFor="commonAddr">เบอร์โทรศัพท์ที่ติดต่อได้</label>
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                            minLength={8}
                            className="form-input rounded text-sm relative  w-full"
                            {...register('phoneNumber', { required: true })}
                        />
                    </div>

                    <div className="flex flex-col mb-4 ">
                        <label htmlFor="postcode">รหัสไปรณีย์</label>
                        <div className="relative">
                            <input
                                autoComplete="false"
                                id="postcode"
                                name="postcode"
                                list="postcodelist"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={5}
                                minLength={5}
                                className="form-input rounded text-sm relative  w-full"
                                {...register('postcode', { required: true })}
                            />
                            <Datalist
                                options={addrOptions.map(({ district, postcode, province, subdistrict }, idx) => ({
                                    text: `${postcode}, ${subdistrict}, ${district}, ${province}`,
                                    value: idx,
                                }))}
                                handleSelectedOption={handleSelectedOption}
                            />
                        </div>

                        <small className="text-red-500">{errors.postcode?.message}</small>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="subDistrict">แขวง/ตำบล</label>
                        <input
                            id="subDistrict"
                            className="form-input rounded text-sm"
                            type="text"
                            readOnly
                            {...register('subdistrict', { required: 'กรุณาระบุ' })}
                        />
                        <small className="text-red-500">{errors.subdistrict?.message}</small>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="city">เขต/อำเภอ</label>
                        <input
                            id="city"
                            className="form-input rounded text-sm"
                            type="text"
                            readOnly
                            {...register('district', { required: 'กรุณาระบุ' })}
                        />
                        <small className="text-red-500">{errors.district?.message}</small>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="province">จังหวัด</label>
                        <input
                            id="province"
                            className="form-input rounded text-sm"
                            type="text"
                            readOnly
                            {...register('province', { required: 'กรุณาระบุ' })}
                        />
                        <small className="text-red-500">{errors.province?.message}</small>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`${
                            isLoading ? 'bg-indigo-300' : 'bg-indigo-500'
                        }  text-white rounded p-2 my-2 block w-full`}
                    >
                        {isLoading && <span>กำลังส่งข้อมูล</span>}
                        {!isLoading && <span>+ เพิ่มที่อยู่</span>}
                    </button>
                    <button
                        type="button"
                        className="border border-indigo-500  rounded p-2 my-2 block w-full"
                        onClick={() => setIsOpen(false)}
                    >
                        <span>ยกเลิก</span>
                    </button>
                </form>
            </Modal>

            <button
                type="button"
                className={`border  ${
                    enabled ? 'border-indigo-500' : 'border-gray-300 text-gray-300'
                } rounded p-2 my-2 block w-full`}
                onClick={() => setIsOpen(true)}
                disabled={!enabled}
            >
                <span>+</span>
                <span>เพิ่มที่อยู่ใหม่</span>
            </button>
        </>
    )
}
