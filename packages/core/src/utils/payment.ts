export const withPricing = (price: number) =>
    `${(price ?? 0).toLocaleString('th', {
        minimumFractionDigits: 2,
        minimumIntegerDigits: 1,
    })} บาท`
