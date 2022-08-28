import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export abstract class BaseHandler {
    request: NextApiRequest
    response: NextApiResponse

    abstract main: <TResult = any>() => Promise<TResult>

    protected handler: NextApiHandler = async (req, res) => {
        this.request = req
        this.response = res
        return this.main()
    }
}
