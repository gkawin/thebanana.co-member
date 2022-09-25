import axios from 'axios'
import { injectable } from 'tsyringe'
import { HandlerApi } from '@/core/BaseHandler'
import { Get, Query, UseGuard } from '@/core/http-decorators'
import { BearerGuard } from '@/core/guards/bearer.guard'

export type LongdoMapSearchAddress = {
    address: {
        geocode: string
        province: string
        district: string
        subdistrict: string
        lat: number
        lon: number
    }[]
}
const apiKey = process.env.LONGDO_API_KEY || ''

@injectable()
class HandleGeoSerachPostCode extends HandlerApi {
    @Get()
    @UseGuard(BearerGuard)
    async main(@Query() query: { keyword: string }) {
        const { keyword } = query

        if (!keyword) return []

        try {
            const { data } = await axios.get<LongdoMapSearchAddress>('https://api.longdo.com/POIService/json/address', {
                params: { postcode: decodeURIComponent(keyword.toString()), key: apiKey, locale: 'th' },
            })
            const addresses = data.address.map((addr) => {
                addr
                return {
                    province: addr.province.replace('จ.', ''),
                    district: addr.district.replace('อ.', ''),
                    subdistrict: addr.subdistrict.replace('ต.', ''),
                    postcode: keyword,
                }
            })
            return addresses
        } catch (error) {
            console.error({ keyword, error: error.output })
            return []
        }
    }
}

export default HandlerApi.handle(HandleGeoSerachPostCode)
