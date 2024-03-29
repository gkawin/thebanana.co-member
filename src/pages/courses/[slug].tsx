import { ProductDescription } from '@/components/products/ProductDescription'
import { ProductCoverImage } from '@/components/products/ProductCoverImage'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { serialize } from 'typescript-json-serializer'
import Link from 'next/link'
import { CourseModel } from '@/models/course/course.model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export type CourseInfoProps = { slug: string; product: CourseModel }

const CourseInfo: NextPage<CourseInfoProps> = ({ product, slug }) => {
    if (!product) return <div>Loading</div>

    return (
        <>
            <Link href="/">
                <a className="text-indigo-500 p-4 block">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    กลับหน้าหลัก
                </a>
            </Link>
            <section>
                <figure className="md:w-full md:pb-4 bg-yellow-100">
                    <div className="max-w-xl mx-auto">
                        <ProductCoverImage
                            className="rounded-b-xl"
                            src={product.coverImage}
                            alt={product.title}
                            layout="responsive"
                        />
                    </div>
                </figure>
                <div className="container grid gap-y-4">
                    <ProductDescription
                        className="py-4"
                        description={product.description}
                        session={product.session}
                        title={product.title}
                    />
                    <div className="text-xl font-semibold">{product.pricing}</div>
                    <Link href={`/purchase/${slug}`}>
                        <a type="button" className="bg-indigo-700 text-white rounded p-2 text-center">
                            จองและชำระเงิน
                        </a>
                    </Link>
                </div>
            </section>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<CourseInfoProps> = async ({ params }) => {
    const { db } = adminSDK()
    const slug = String(params.slug)
    const productCol = await db
        .collection('courses')
        .withConverter(Model.convert(CourseModel))
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
