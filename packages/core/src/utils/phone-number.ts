export const mobileToThaiNumber = (number: string, prefix = '+') => {
    if (new RegExp(/^0+/gim).test(number)) {
        if (!prefix) return `66${number.slice(1)}`
        return `${prefix}66${number.slice(1)}`
    }
    return number
}

export const mobileThaiNumberToRegulary = (number: string) => {
    if (new RegExp(/^66+/gim).test(number)) {
        return number.replace(/^66+/gim, '0')
    }
    return number
}
