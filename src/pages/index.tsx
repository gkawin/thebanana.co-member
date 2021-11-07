import { useAxios } from '@/core/RootContext'

import { SelectSubjectForm } from '@/components/products/SelectSubjectForm'
import { UserCard } from '@/components/user/UserCard'

export default function Home() {
    const axios = useAxios()

    return (
        <div className="min-w-max max-w-lg container mx-auto px-4">
            <UserCard />
            <SelectSubjectForm />

            <button type="button" className="p-2 bg-yellow-400  w-full rounded">
                ลงทะเบียน
            </button>
        </div>
    )
}
