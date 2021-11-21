import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { notFound } from '@hapi/boom'
import { ok } from 'assert'

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

export default async function HandleGeoSerachPostCode(req: NextApiRequest, res: NextApiResponse) {
    await runsWithMethods(req, res, { methods: ['GET'] })
    const { keyword } = req.query

    try {
        const { data } = await axios.get<LongdoMapSearchAddress>('https://api.longdo.com/POIService/json/address', {
            params: { postcode: decodeURIComponent(keyword.toString()), key: apiKey, locale: 'th' },
        })

        ok(data, notFound('data not found'))

        const addresses = data.address.map((addr) => {
            addr
            return {
                province: addr.province.replace('จ.', ''),
                district: addr.district.replace('อ.', ''),
                subdistrict: addr.subdistrict.replace('ต.', ''),
                postcode: keyword,
            }
        })
        res.status(200).json(addresses)
    } catch (error) {
        console.error({ keyword, error: error.output })
        res.status(200).json([])
    }
}
