import { useAxios } from '@/core/RootContext'

import { SelectSubjectForm } from '@/components/products/SelectSubjectForm'
import { UserCard } from '@/components/user/UserCard'
import { ProductSummary } from '@/components/products/ProductSummary'
import { useState } from 'react'

export default function Home() {
    const axios = useAxios()
    const [productId, setProductId] = useState('')

    return (
        <div className="min-w-max max-w-lg container mx-auto px-4">
            <UserCard />
            <SelectSubjectForm onSelected={setProductId} />
            <ProductSummary />
            <button type="button" className="p-2 bg-yellow-400  w-full rounded">
                ลงทะเบียน
            </button>
        </div>
    )
}
