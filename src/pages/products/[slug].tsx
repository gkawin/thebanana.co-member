import { ProductDescription } from '@/components/products/ProductDescription'
import { ProductCoverImage } from '@/components/products/ProductCoverImage'
import { ProductModel } from '@/models/ProductModel'
import { NextPage } from 'next'
import useUserCart from '@/concerns/use-user-histories'
import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAxios, useFirebase } from '@/core/RootContext'
import { collection, query, where } from 'firebase/firestore'

export type CourseInfoProps = { slug: string; product: ProductModel }

const CourseInfo: NextPage<CourseInfoProps> = ({ slug, product }) => {
    const userCart = useUserCart()
    const router = useRouter()
    const axios = useAxios()
    const { auth, db } = useFirebase()

    const isEnrolled = useCallback(() => {
        return !!userCart.items.find((item) => item.product === product.id)
    }, [product.id, userCart.items])

    const createBooking = useCallback(async () => {
        await axios.post('/api/products/checkout', { product: product.id, user: auth.currentUser.uid })
        router.push('/checkout')
    }, [auth.currentUser.uid, axios, product.id, router])

    const handleOnClick = () => {
        if (isEnrolled()) {
            router.push('/checkout')
        } else {
            createBooking()
        }
    }

    useEffect(() => {
        if (!product) {
            query(collection(db, 'products'), where('slug', '==', slug))
        }
    }, [])

    if (!product) return <div>Loading</div>

    return (
        <main>
            <figure className="md:w-full md:pb-4 bg-yellow-100">
                <div className="max-w-xl mx-auto">
                    <ProductCoverImage
                        className="rounded-b-xl"
                        src={product.coverImage}
                        alt={product.name}
                        layout="responsive"
                    />
                </div>
            </figure>
            <div className="container grid gap-y-4">
                <ProductDescription className="py-4" description={product.description} name={product.name} />
                <div className="text-xl font-semibold">{product.pricing}</div>
                <button type="button" className="bg-yellow-500 text-white rounded p-2" onClick={handleOnClick}>
                    ชำระเงิน
                </button>
            </div>
        </main>
    )
}

export default CourseInfo
