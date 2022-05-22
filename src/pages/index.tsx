import { BrowseProductsNav } from '@/components/products/BrowseProductsNav'
import { ProductCard } from '@/components/products/ProductCard'
import useCourses from '@/concerns/use-courses'

export default function Home() {
    const products = useCourses()

    return (
        <section className="container mx-auto">
            <BrowseProductsNav className="overflow-x-scroll whitespace-pre text-right" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-4">
                {products.map((product) => (
                    <ProductCard
                        slug={`/courses/${product.slug}`}
                        disabled={false}
                        onClick={() => {}}
                        product={product}
                        key={product.code}
                    />
                ))}
            </div>
        </section>
    )
}
