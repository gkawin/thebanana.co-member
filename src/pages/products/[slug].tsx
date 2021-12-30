import { ProductDescription } from '@/components/products/ProductDescription'
import { ProductCoverImage } from '@/components/products/ProductCoverImage'
import { ProductModel } from '@/models/ProductModel'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import useUserCart from '@/concerns/use-user-histories'
import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useAxios, useFirebase } from '@/core/RootContext'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { instanceToPlain } from 'class-transformer'

export type CourseInfoProps = { slug: string; product: ProductModel }

const CourseInfo: NextPage<CourseInfoProps> = ({ product }) => {
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
                    {isEnrolled() ? 'ไปยังหน้าชำระเงิน' : 'ลงทะเบียน และ ชำระเงิน'}
                </button>
            </div>
        </main>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const sdk = adminSDK()
    const productCol = await sdk.firestore().collection('products').withConverter(Model.transform(ProductModel)).get()

    if (productCol.empty) {
        return {
            paths: [{ params: { slug: 'not-found' } }],
            fallback: false,
        }
    }

    const allPaths = productCol.docs.map((doc) => ({ params: { slug: doc.data()?.slug ?? 'not-found' } }))
    return {
        paths: allPaths,
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps<CourseInfoProps> = async ({ params }) => {
    const sdk = adminSDK()
    const productCol = await sdk
        .firestore()
        .collection('products')
        .withConverter(Model.transform(ProductModel))
        .where('slug', '==', params?.slug)
        .orderBy('effectiveDate', 'desc')
        .limit(1)
        .get()

    if (productCol.empty) {
        return { notFound: true, props: { slug: null, product: null } } as any
    }

    return {
        props: {
            slug: params?.slug?.toString() ?? null,
            product: instanceToPlain(productCol.docs[0].data()),
        },
    }
}

export default CourseInfo
