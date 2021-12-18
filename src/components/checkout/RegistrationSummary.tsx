import useProductsList from '@/concerns/use-products-list'
import useUserHistories from '@/concerns/use-user-histories'
import { BookingStatus } from '@/models/BookingModel'
import { ProductModel } from '@/models/ProductModel'
import { useCallback } from 'react'
import { CheckoutProductCard } from './CheckoutProductCard'

export type RegistrationSummaryProps = {}

const calcVAT = (price: number, ratio = 0.07) => Number(price * ratio)

export const RegistrationSummary: React.VFC<RegistrationSummaryProps> = () => {
    let totalPrice = 0
    const histories = useUserHistories()
    const products = useProductsList()

    const getProductInfo = useCallback(
        (productId: string) => {
            console.log(products)
            return products.find((product) => product.id === productId) || ({} as ProductModel)
        },
        [products]
    )

    return (
        <div className="p-4 border shadow-md rounded">
            {histories.category[BookingStatus.WAITING_FOR_PAYMENT].map((booking) => {
                const product = getProductInfo(booking.product)
                totalPrice += product.price
                return <CheckoutProductCard key={booking.product} product={product} />
            })}
            <div className="border w-full"></div>

            <div className="flex flex-row justify-between pt-2 text-sm text-gray-500">
                <span>ราคาไม่รวมภาษีมูลค่าเพิ่ม 7%</span>
                <span>
                    {`${Number(totalPrice - calcVAT(totalPrice)).toLocaleString('th', {
                        minimumFractionDigits: 2,
                        minimumIntegerDigits: 2,
                    })} บาท`}
                </span>
            </div>

            <div className="flex flex-row justify-between pt-2 text-sm text-gray-500">
                <span>ภาษีมูลค่าเพิ่ม 7%</span>
                <span>
                    {`${calcVAT(totalPrice).toLocaleString('th', {
                        minimumFractionDigits: 2,
                        minimumIntegerDigits: 2,
                    })} บาท`}
                </span>
            </div>
            <div className="p-2 mt-4 bg-yellow-400 rounded text-2xl font-semibold flex flex-row justify-between">
                <span>ยอดชำระ</span>
                <span>{`${totalPrice.toLocaleString('th', {
                    minimumFractionDigits: 2,
                    minimumIntegerDigits: 2,
                })} บาท`}</span>
            </div>
        </div>
    )
}
