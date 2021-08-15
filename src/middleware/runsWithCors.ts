import cors from 'cors'

import runsWith from './runsWith'

export default runsWith((req: any, res: any, next: any) =>
    cors({
        origin: process.env.NODE_ENV === 'development' ? '*' : 'https://www.thebanana.co',
    })(req, res, next)
)
