export type ProductSummaryProps = { productId: string }

export const ProductSummary: React.VFC<ProductSummaryProps> = ({ productId }) => {
    return (
        <section className="py-4">
            <h2 className="text-xl font-semibold">สรุปรายการลงทะเบียน</h2>
            <div className="grid grid-cols-2">
                <div>คอร์สเรียน</div>
                <div>ราคา</div>
                <div>ดนน</div>
                <div>10900</div>
            </div>
        </section>
    )
}
