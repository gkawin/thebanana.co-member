import { IsString } from 'class-validator'

export class EnrollDto {
    @IsString()
    product: string

    @IsString()
    user: string
}
