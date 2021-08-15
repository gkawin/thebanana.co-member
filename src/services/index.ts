import 'reflect-metadata'

import { container } from 'tsyringe'
import { LineService } from './LineService'
import { UserService } from './UserService'

export const lineService = container.resolve(LineService)
export const userService = container.resolve(UserService)
