import { BookingModel } from '@/models/BookingModel'
import { ProductModel } from '@/models/ProductModel'
import { CheckoutProductCard } from './CheckoutProductCard'

export type RegistrationSummaryProps = { product: ProductModel; booking: BookingModel }

const calcVAT = (price: number, ratio = 0.07) => Number(price * ratio)

export const RegistrationSummary: React.VFC<RegistrationSummaryProps> = ({ product, booking }) => {
    return (
        <div className="p-4 border shadow-md rounded">
            <CheckoutProductCard key={booking.product} product={product} />

            <div className="border w-full"></div>

            <div className="flex flex-row justify-between pt-2 text-sm text-gray-500">
                <span>ราคาไม่รวมภาษีมูลค่าเพิ่ม 7%</span>
                <span>
                    {`${Number(product.price - calcVAT(product.price)).toLocaleString('th', {
                        minimumFractionDigits: 2,
                        minimumIntegerDigits: 2,
                    })} บาท`}
                </span>
            </div>

            <div className="flex flex-row justify-between pt-2 text-sm text-gray-500">
                <span>ภาษีมูลค่าเพิ่ม 7%</span>
                <span>
                    {`${calcVAT(product.price).toLocaleString('th', {
                        minimumFractionDigits: 2,
                        minimumIntegerDigits: 2,
                    })} บาท`}
                </span>
            </div>
            <div className="p-2 mt-4 bg-yellow-400 rounded text-2xl font-semibold flex flex-row justify-between">
                <span>ยอดชำระ</span>
                <span>{`${product.price.toLocaleString('th', {
                    minimumFractionDigits: 2,
                    minimumIntegerDigits: 2,
                })} บาท`}</span>
            </div>
        </div>
    )
}
