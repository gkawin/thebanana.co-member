import { DocumentReference, Timestamp } from 'firebase/firestore'

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
