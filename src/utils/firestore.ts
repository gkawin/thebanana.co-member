import { Timestamp } from 'firebase/firestore'

export const withTimeToDate = (v: any) => {
    if (v instanceof Timestamp || typeof v.toDate !== undefined) {
        return v.toDate()
    }
    return v
}

export const withISOToServerTimestamp = (v: string | Date) => {
    if (v instanceof Date) return v.toISOString()
    if (!v) return null
    return new Date(v).toISOString()
}
