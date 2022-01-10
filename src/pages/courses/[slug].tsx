import { ProductDescription } from '@/components/products/ProductDescription'
import { ProductCoverImage } from '@/components/products/ProductCoverImage'
import { ProductModel } from '@/models/ProductModel'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import useUserCart from '@/concerns/use-user-histories'
import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useAxios, useFirebase } from '@/core/RootContext'
// import { serialize } from 'typescript-json-serializer'

import { BookingStatus } from '@/models/BookingModel'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'

export type CourseInfoProps = { slug: string; product: ProductModel }

const CourseInfo: NextPage<CourseInfoProps> = ({ product }) => {
    const userCart = useUserCart()
    const router = useRouter()
    const axios = useAxios()
    const { auth } = useFirebase()

    const isEnrolled = useCallback(() => {
        return !!userCart[BookingStatus.WAITING_FOR_PAYMENT].find(
            (item: any) => (item.product as ProductModel).id === product.id
        )
    }, [product.id, userCart])

    const createBooking = useCallback(async () => {
        await axios.post('/api/products/checkout', { product: product.id, user: auth.currentUser.uid })
        router.push('/checkout')
    }, [auth.currentUser.uid, axios, product.id, router])

    const handleOnClick = async () => {
        if (isEnrolled()) {
            router.push('/checkout')
        } else {
            await createBooking()
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
                    {isEnrolled() ? 'ไปยังหน้าชำระเงิน' : 'ลงทะเบียน และ ชำระเงิน'}
                </button>
            </div>
        </main>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { db } = adminSDK()
    const productCol = await db.collection('products').withConverter(Model.convert(ProductModel)).get()
    const paths = productCol.docs.map((doc) => ({ params: { slug: doc.data().slug.toString() } }))
    return {
        paths,
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps<CourseInfoProps> = async ({ params }) => {
    const { db } = adminSDK()
    const slug = String(params.slug)
    const productCol = await db
        .collection('products')
        .where('slug', '==', slug)
        .withConverter(Model.convert(ProductModel))
        .get()

    if (productCol.empty) {
        return { notFound: true, props: { slug: null, product: null } } as any
    }

    return {
        props: {
            slug,
            product: {},
        },
    }
}

export default CourseInfo
