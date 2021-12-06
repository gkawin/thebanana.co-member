import { IsString } from 'class-validator'

export class EnrollDto {
    @IsString()
    productId: string

    @IsString()
    userId: string
}
