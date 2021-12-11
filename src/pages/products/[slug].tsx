import { ProductContent, ProductDescription } from '@/components/products/ProductDescription'
import { ProductCoverImage } from '@/components/products/ProductCoverImage'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { ProductModel } from '@/models/ProductModel'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'

export type CourseInfoProps = { slug: string; product: ProductModel }

const CourseInfo: NextPage<CourseInfoProps> = ({ slug, product }) => {
    if (!product) return <div>Loading</div>

    return (
        <main>
            <ProductCoverImage src={product.coverImage} alt={product.name} layout="responsive" />
            <ProductDescription className="py-4" description={product.description} name={product.name} />
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
