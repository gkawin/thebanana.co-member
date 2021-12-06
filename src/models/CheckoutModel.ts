import { Type } from 'class-transformer'
import { BookingModel } from './BookingModel'
import { ProductModel } from './ProductModel'

export class CheckoutModel extends BookingModel {
    @Type(() => ProductModel)
    product: ProductModel
}
