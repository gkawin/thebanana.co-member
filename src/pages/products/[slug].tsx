import { ProductDescription } from '@/components/products/ProductDescription'
import { ProductCoverImage } from '@/components/products/ProductCoverImage'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { ProductModel } from '@/models/ProductModel'
import { GetServerSideProps, NextPage } from 'next'
import useUserCart from '@/concerns/use-user-histories'
import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useAxios, useFirebase } from '@/core/RootContext'

export type CourseInfoProps = { slug: string; product: ProductModel }

const CourseInfo: NextPage<CourseInfoProps> = ({ slug, product }) => {
    const userCart = useUserCart()
    const router = useRouter()
    const axios = useAxios()
    const { auth } = useFirebase()

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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const slug = query?.slug ?? 'not-found'
    const sdk = adminSDK()
    const productRef = await sdk
        .firestore()
        .collection('products')
        .withConverter(Model.transform(ProductModel))
        .where('slug', '==', slug)
        .limit(1)
        .get()

    const product = productRef.docs[0]?.data() ?? null

    if (!product) return { notFound: true }

    return {
        props: {
            slug,
            product: {
                code: product.code,
                coverImage: product.coverImage,
                name: product.name,
                description: product.description,
                id: product.id,
                pricing: product.pricing,
            } as ProductModel,
        },
    }
}

export default CourseInfo
