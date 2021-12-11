import type { ProductModel } from '@/models/ProductModel'
import Image from 'next/image'

export type ProductCardProps = {
    product: ProductModel
    disabled: boolean
    onClick: (val: ProductModel) => void
}

export const ProductCard: React.VFC<ProductCardProps> = ({ product, onClick, disabled = false }) => {
    return (
        <div
            className={`product-card  rounded border-2 border-yellow-700 relative ${
                disabled ? 'filter grayscale bg-opacity-20' : ''
            } `}
            onClick={() => onClick(product)}
        >
            <Image layout="responsive" src={product.coverImage} alt="classNaja" width="320" height="120" />
            <section className="grid" style={{ gridTemplateRows: 'auto minmax(5rem, 8rem) auto' }}>
                <div className="p-2">
                    <div className="text-yellow-600">คอร์สออนไลน์</div>
                    <h2 className={`text-xl font-semibold ${disabled ? 'text-gray-500' : ''}`}>{product.name}</h2>
                </div>

                <p className="text-sm text-gray-500 p-2 truncate whitespace-pre-line">{product.description}</p>

                <figure className="p-2">
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
            </section>

            <div className="grid"></div>
        </div>
    )
}
