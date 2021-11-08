import { AvaliableProducts } from '@/components/products/AvaliableProducts'
import { ConfirmedProductForm } from '@/components/products/ConfirmedProductForm'
import { UserCard } from '@/components/user/UserCard'
import { ProductModel } from '@/models/ProductModel'
import { useState } from 'react'

export default function Home() {
    const [productInfo, setProductInfo] = useState<ProductModel>(null)
    return (
        <div className="max-w-xl container mx-auto p-4" style={{ minWidth: '20rem' }}>
            <UserCard />
            <AvaliableProducts onChange={setProductInfo} />
            <ConfirmedProductForm productInfo={productInfo} />
        </div>
    )
}
