import React, { useEffect, useState } from 'react'

import { ProductModel } from '@/models/ProductModel'

import useUserCart from '@/concerns/use-user-cart'
import useProductsList from '@/concerns/use-products-list'
import { BookingStatus } from '@/models/BookingModel'

export type AvaliableProductsProps = { onChange: (value: ProductModel) => void }

export const AvaliableProducts: React.VFC<AvaliableProductsProps> = ({ onChange }) => {
    const [productInfo, setProductInfo] = useState<ProductModel>(null)
    const userCart = useUserCart()
    const products = useProductsList()

    const handleToggleProduct = (product: ProductModel) => (e: React.SyntheticEvent) => {
        e.preventDefault()
        setProductInfo((state) => (state?.id === product.id ? null : product))
    }

    useEffect(() => {
        onChange(productInfo)
    }, [onChange, productInfo])

    return (
        <>
            <section className="py-4">
                <h2 className="pt-4 text-lg">เลือกวิชา</h2>
                <div className="grid grid-flow-row gap-y-4">
                    {products.map((product) => {
                        const isAlreadyAtCart =
                            userCart.categories[BookingStatus.WAITING_FOR_PAYMENT].findIndex(
                                (cate) => cate.productPath === `products/${product.id}`
                            ) !== -1

                        return (
                            <button
                                type="button"
                                disabled={isAlreadyAtCart}
                                key={product.code}
                                onClick={handleToggleProduct(product)}
                                className={`border-2 rounded p-2 text-center w-full transition-all duration-400 ease-in-out ${
                                    product.code === productInfo?.code ? 'bg-indigo-500 text-white' : 'bg-white'
                                } ${
                                    isAlreadyAtCart
                                        ? 'border-gray-300 text-gray-300'
                                        : 'border-indigo-500 cursor-pointer'
                                }`}
                            >
                                {product.name}
                            </button>
                        )
                    })}
                </div>
            </section>
        </>
    )
}
