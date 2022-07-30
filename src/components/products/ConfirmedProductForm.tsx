import { useAxios, useUserInfo } from '@/core/RootContext'
import React from 'react'
import { useRouter } from 'next/dist/client/router'
import { CourseModel } from '@/models/course/course.model'

export type ConfirmedProductFormProps = {
    courseInfo: CourseModel
}

export const ConfirmedProductForm: React.FC<ConfirmedProductFormProps> = ({ courseInfo }) => {
    const { uid } = useUserInfo()
    const axios = useAxios()
    const router = useRouter()

    const handleOnSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        await axios.post('/api/enrollment', { productId: courseInfo.id, userId: uid })
        router.push('/checkout')
    }

    if (!courseInfo) return null

    return (
        <form onSubmit={handleOnSubmit}>
            <section className="py-4">
                <h2 className="text-xl font-semibold">สรุปรายการลงทะเบียน</h2>
                <div className="grid grid-flow-row">
                    <div>คอร์สเรียน</div>
                    <div>{courseInfo.title}</div>
                    <div>ราคา</div>
                    <div>{courseInfo.pricing}</div>
                </div>
            </section>

            <button type="submit" className="p-2 bg-yellow-400  w-full rounded">
                จองคอร์สเรียน
            </button>
        </form>
    )
}
