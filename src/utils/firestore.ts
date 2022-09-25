import dayjs from 'dayjs'
import { DocumentReference } from 'firebase/firestore'

export const withTimeToDate = (v: any): Date => {
    if (typeof v === 'object') {
        if ('_seconds' in v) {
            return dayjs.unix(v._seconds).toDate()
        }

        // Note: For supporting Firebase Client side.
        if ('toDate' in v) {
            return v.toDate()
        }
    }

    if (typeof v === 'string') {
        if (dayjs(v).isValid()) {
            return dayjs(v).toDate()
        }
    }
    return v
}

export const withISOToServerTimestamp = (v: string | Date) => {
    if (v instanceof Date) return v.toISOString()
    if (!v) return null
    return new Date(v).toISOString()
}

export const withDocumentReferenceToPath = (val: any | any[]) => {
    if (Array.isArray(val)) {
        return val.map((v) => {
            if (v instanceof DocumentReference) {
                return v.path
            }
            if (v.get !== undefined) {
                return (v as FirebaseFirestore.DocumentReference).path
            }
            return v
        })
    }
    return val
}
