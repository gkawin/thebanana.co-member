import { BrowseProductsNav } from '@/components/products/BrowseProductsNav'
import useUserCart from '@/concerns/use-user-cart'
import useProductsList from '@/concerns/use-products-list'
import { ProductCard } from '@/components/products/ProductCard'

export default function Home() {
    const userCart = useUserCart()
    // const products = useProductsList(userCart.items)

    console.log(userCart)

    return (
        <section className="container mx-auto">
            <BrowseProductsNav className="overflow-x-scroll whitespace-pre text-right" />
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-4">
                {products.map((product) => {
                    return <ProductCard disabled={false} onClick={() => {}} product={product} key={product.code} />
                })}
            </div> */}
        </section>
    )
}
