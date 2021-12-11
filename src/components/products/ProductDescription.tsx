export type ProductDescriptionProps = { name: string; description: string; className?: string }

export const ProductDescription: React.VFC<ProductDescriptionProps> = ({ name, description, className = '' }) => {
    return (
        <div className={`product-description ${className}`}>
            <span className="text-yellow-700">คอร์สออนไลน์ผ่าน ZOOM</span>
            <h1 className="text-xl font-semibold">{name}</h1>
            <p className="text-sm text-gray-500 py-2 truncate whitespace-pre-line">{description}</p>
        </div>
    )
}
