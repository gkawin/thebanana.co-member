import { getDocs, getFirestore, query, where } from 'firebase/firestore'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { courseCollection } from './query'
import { CourseModel } from '@/models/course/course.model'

export default function useCourses() {
    const [courses, setCourses] = useState<CourseModel[]>([])
    const db = getFirestore()

    useEffect(() => {
        const courseRef = query(courseCollection(db), where('enrollmentAt', '<=', new Date()))
        getDocs(courseRef).then(({ docs }) => {
            const results = docs.reduce((prev, item) => {
                const data = item.data()
                const notExpired = dayjs().isBefore(data.closeEnrollAt, 'second')
                if (notExpired) {
                    prev.push(data)
                }
                return prev
            }, [])
            setCourses(results)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return useMemo(() => courses, [courses])
}
