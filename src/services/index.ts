import 'reflect-metadata'

import { container } from 'tsyringe'
import { AdminSDKService } from './AdminSDK.service'

export const admin = container.resolve(AdminSDKService)
