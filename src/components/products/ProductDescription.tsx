export type ProductDescriptionProps = { session: string; title: string; description: string; className?: string }

export const ProductDescription: React.VFC<ProductDescriptionProps> = ({
    title,
    description,
    session,
    className = '',
}) => {
    return (
        <div className={`product-description ${className}`}>
            <span className="text-yellow-700">{session}</span>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-sm text-gray-500 py-2 truncate whitespace-pre-line">{description}</p>
        </div>
    )
}
