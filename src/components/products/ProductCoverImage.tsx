import Image from 'next/image'

export type ProductCoverImageProps = { src: string; alt: string; layout: 'fixed' | 'responsive' | 'fill' | 'intrinsic' }
export const ProductCoverImage: React.VFC<ProductCoverImageProps> = ({ alt, layout, src }) => {
    return <Image layout={layout} src={src} alt={alt} width="320" height="120" />
}
