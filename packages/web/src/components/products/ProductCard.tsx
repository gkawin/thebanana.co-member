import { CourseModel } from '@thebanana/core/lib/models'
import Image from 'next/image'
import Link from 'next/link'
import { ProductCoverImage } from './ProductCoverImage'
import { ProductDescription } from './ProductDescription'

export type ProductCardProps = {
    course: CourseModel
    disabled: boolean
    onClick: (val: CourseModel) => void
    slug: string
}

export const ProductCard: React.VFC<ProductCardProps> = ({ course, onClick, slug, disabled = false }) => {
    return (
        <Link href={slug}>
            <a
                className={`product-card rounded border-2 border-yellow-700 relative transform hover:-translate-y-2 transition-all duration-200 ease-linear hover:shadow-2xl shadow-black${
                    disabled ? 'filter grayscale bg-opacity-20' : ''
                } `}
                onClick={() => onClick(course)}
                style={{ display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)' }}
            >
                <ProductCoverImage alt={course.title} layout="responsive" src={course.coverImage} />
                <ProductDescription
                    className="p-2"
                    description={course.description}
                    session={course.session}
                    title={course.title}
                />

                <figure className="p-2 row-span-2">
                    <div></div>
                    <div className="inline-block align-middle">
                        <Image
                            src="https://fakeimg.pl/48x48"
                            className="rounded-full "
                            alt="avatar"
                            width="48"
                            height="48"
                        />
                    </div>
                    <figcaption className="inline-block ml-2">ครูพี่เดียร์</figcaption>
                </figure>

                <div className="border-t border-gray-400 p-2">
                    <span>เรียน 12 สัปดาห์</span>
                </div>
            </a>
        </Link>
    )
}
