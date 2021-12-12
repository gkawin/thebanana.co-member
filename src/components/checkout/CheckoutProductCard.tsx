import { ProductModel } from '@/models/ProductModel'

export type CheckoutProductCardProps = { product: ProductModel }

export const CheckoutProductCard: React.VFC<CheckoutProductCardProps> = ({ product }) => {
    return (
        <div className="grid grid-rows-2 grid-cols-2 gap-4 ">
            <div className=" text-lg col-span-2">{product.name}</div>
            <div className="self-end">ราคา/คน</div>
            <div className="self-end justify-self-end font-semibold text-black">{product.pricing}</div>
        </div>
    )
}
