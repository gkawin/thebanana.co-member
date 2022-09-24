import 'reflect-metadata'
import { AdminSDK } from '@/libs/adminSDK'
import { injectable } from 'tsyringe'

import { UserModelV2 } from '@/models/user/user.model'
import Model from '@/models/Model'

import { badRequest, notFound } from '@hapi/boom'
import { ok } from 'assert'
import { HandlerApi } from '@/core/BaseHandler'
import { Body, Post, Query, UseGuard } from '@/core/http-decorators'
import { BearerGuard } from '@/core/guards/bearer.guard'
import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class CreateUserModel {
    @JsonProperty()
    userId: string
}

@injectable()
class UserCreatedApi extends HandlerApi {
    #userRef: FirebaseFirestore.CollectionReference<UserModelV2>
    constructor(private sdk: AdminSDK) {
        super()
        this.#userRef = this.sdk.db.collection('users').withConverter(Model.convert(UserModelV2))
    }

    @Post()
    @UseGuard(BearerGuard)
    async main(@Query() query: CreateUserModel, @Body() body: any) {
        ok(query?.userId, notFound('user not found'))
        ok(body, badRequest())

        const writeResult = await this.#userRef.doc(query.userId.toString()).set(body)
        return writeResult
    }
}

export default HandlerApi.handle(UserCreatedApi)
