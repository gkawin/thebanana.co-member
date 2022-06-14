import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

import { ok } from 'assert'
import { notFound } from '@hapi/boom'
import runsWithMethods from '@/middleware/runsWithMethods'

export type LongdoMapSearch = {
    id: string
    name: string
    lat: number
    lon: number
    tag: string[]
    verified: boolean
    obsoleted: boolean
}

const apiKey = process.env.LONGDO_API_KEY || ''
export default async function HandleGeoSearchArea(req: NextApiRequest, res: NextApiResponse) {
    await runsWithMethods(req, res, { methods: ['GET'] })

    try {
        const { keyword, tag } = req.query
        const {
            data: { data },
        } = await axios.get<{ data?: LongdoMapSearch[] }>('https://search.longdo.com/mapsearch/json/search', {
            params: { keyword, key: apiKey, tag, limit: 10, version: 2 },
        })

        ok(Array.isArray(data), notFound('data not found'))

        const results = data.map((info) => {
            const cleanupName = info.name.replace(/(\ต\.|\อ\.|\จ\.)/gim, '')
            const [subdistrict = '', district = '', province] = cleanupName.split(/\s+/gim)
            const postcode = info.tag[0] !== 'subdistrict' ? '' : info.tag.pop().replace('__POST', '')
            return {
                province,
                district,
                subdistrict,
                postcode,
            }
        })

        res.status(200).json(results)
    } catch (error) {
        console.error(error)
        res.status(200).json([])
    }
}
