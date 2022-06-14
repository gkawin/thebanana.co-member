import Image, { ImageProps } from 'next/image'

export type ProductCoverImageProps = {
    src: string
    alt: string
    layout: 'fixed' | 'responsive' | 'fill' | 'intrinsic'
} & ImageProps

export const ProductCoverImage: React.VFC<ProductCoverImageProps> = ({ alt, layout, src, ...allProps }) => {
    return <Image layout={layout} src={src} alt={alt} {...allProps} width="320" height="120" />
}
