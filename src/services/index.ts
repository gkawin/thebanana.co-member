import 'reflect-metadata'

import { container } from 'tsyringe'
import { LineService } from './Line.service'
import { UserService } from './User.service'

export const lineService = container.resolve(LineService)
export const userService = container.resolve(UserService)
