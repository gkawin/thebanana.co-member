import { withPricing } from '@thebanana/core/lib/utils'

export type RegistrationSummaryProps = { name: string; price: number }

const calcVAT = (price: number, ratio = 0.07) => Number(price * ratio)

export const RegistrationSummary: React.VFC<RegistrationSummaryProps> = ({ name, price = 0 }) => {
    return (
        <div className="p-4 border shadow-md rounded">
            <div className="grid grid-rows-2 grid-cols-2 gap-4 ">
                <div className=" text-lg col-span-2">{name}</div>
                <div className="self-end">ราคา/คน</div>
                <div className="self-end justify-self-end font-semibold text-black">{withPricing(price)}</div>
            </div>

            <div className="border w-full"></div>

            <div className="flex flex-row justify-between pt-2 text-sm text-gray-500">
                <span>ราคาไม่รวมภาษีมูลค่าเพิ่ม 7%</span>
                <span>{`${withPricing(Number(price - calcVAT(price)))} บาท`}</span>
            </div>

            <div className="flex flex-row justify-between pt-2 text-sm text-gray-500">
                <span>ภาษีมูลค่าเพิ่ม 7%</span>
                <span>{`${withPricing(calcVAT(price))} บาท`}</span>
            </div>
            <div className="p-2 mt-4 bg-yellow-400 rounded text-2xl font-semibold flex flex-row justify-between">
                <span>ยอดชำระ</span>
                <span>{withPricing(price)}</span>
            </div>
        </div>
    )
}
