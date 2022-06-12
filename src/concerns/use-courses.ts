import { getDocs, getFirestore, query, where } from 'firebase/firestore'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { courseCollection } from './query'
import { CourseModel } from '@/models/course/course.model'

export default function useCourses() {
    const [productsList, setProductsList] = useState<CourseModel[]>([])
    const db = getFirestore()

    useEffect(() => {
        const productsRef = query(courseCollection(db), where('effectiveDate', '<=', new Date()))
        getDocs(productsRef).then(({ docs }) => {
            const results = docs.reduce((prev, item) => {
                const data = item.data()

                const notExpired = dayjs().isBefore(data.expiredDate, 'second')

                if (notExpired) {
                    prev.push(data)
                }

                return prev
            }, [])
            setProductsList(results)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return useMemo(() => productsList, [productsList])
}
