import { firestore } from 'firebase-admin'

export const withServerTimestampToISO = (v: any) => {
    if (v instanceof firestore.Timestamp) {
        return v.toDate().toISOString()
    }
    return v
}
export const withISOToServerTimestamp = (v: string | Date) => {
    if (v instanceof Date) return v.toISOString()
    if (!v) return null
    return new Date(v).toISOString()
}
