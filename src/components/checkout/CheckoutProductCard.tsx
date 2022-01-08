export type CheckoutProductCardProps = { productName: string; pricing: string }

export const CheckoutProductCard: React.VFC<CheckoutProductCardProps> = ({ pricing, productName }) => {
    return (
        <div className="grid grid-rows-2 grid-cols-2 gap-4 ">
            <div className=" text-lg col-span-2">{productName}</div>
            <div className="self-end">ราคา/คน</div>
            <div className="self-end justify-self-end font-semibold text-black">{pricing}</div>
        </div>
    )
}
