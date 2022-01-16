import { ProductDescription } from '@/components/products/ProductDescription'
import { ProductCoverImage } from '@/components/products/ProductCoverImage'
import { ProductModel } from '@/models/ProductModel'
import { GetServerSideProps, NextPage } from 'next'
import useUserCart from '@/concerns/use-user-histories'
import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useAxios, useFirebase } from '@/core/RootContext'
import { BookingModel, BookingStatus } from '@/models/BookingModel'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { serialize } from 'typescript-json-serializer'
import { collection, doc, DocumentReference, getDoc } from 'firebase/firestore'

export type CourseInfoProps = { slug: string; product: ProductModel }

const CourseInfo: NextPage<CourseInfoProps> = ({ product }) => {
    const axios = useAxios()
    const route = useRouter()
    const { auth } = useFirebase()

    const createBooking = useCallback(async () => {
        const { data } = await axios.post<{ bookingCode: string }>('/api/products/checkout', {
            product: product.id,
            user: auth.currentUser.uid,
        })
        return data.bookingCode || null
    }, [auth.currentUser.uid, axios, product.id])

    const handleOnClick = async () => {
        const bookingCode = await createBooking()
        if (!bookingCode) {
            // error
        } else {
            await route.push('/checkout', `/checkout/${bookingCode}`)
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
                    จองและชำระเงิน
                </button>
            </div>
        </main>
    )
}

export const getServerSideProps: GetServerSideProps<CourseInfoProps> = async ({ params }) => {
    const { db } = adminSDK()
    const slug = String(params.slug)
    const productCol = await db
        .collection('products')
        .withConverter(Model.convert(ProductModel))
        .orderBy('slug')
        .startAt(slug)
        .endAt(`${slug}\uf8ff`)
        .get()

    if (productCol.empty) {
        return { notFound: true, props: { slug: null, product: null } } as any
    }

    const product = productCol.docs[0].data()

    return {
        props: {
            slug,
            product: serialize(product),
        },
    }
}

export default CourseInfo
