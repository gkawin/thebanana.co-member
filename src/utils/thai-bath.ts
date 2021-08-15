const MAX_POSITION = 6
const UNIT_POSITION = 0
const TEN_POSITION = 1

const PRIMARY_UNIT = 'บาท'
const SECONDARY_UNIT = 'สตางค์'
const WHOLE_NUMBER_TEXT = 'ถ้วน'

const NUMBER_TEXTS = 'ศูนย์,หนึ่ง,สอง,สาม,สี่,ห้า,หก,เจ็ด,แปด,เก้า,สิบ'.split(',')
const UNIT_TEXTS = 'สิบ,ร้อย,พัน,หมื่น,แสน,ล้าน'.split(',')

const getIntegerDigits = (numberInput: any) => parseInt(numberInput.split('.')[0], 10).toString()
const getFractionalDigits = (numberInput: any) => parseInt(numberInput.split('.')[1], 10).toString()

const hasFractionalDigits = (numberInput: any) => numberInput !== undefined && numberInput != '0'

const isZeroValue = (number: any) => number == 0
const isUnitPosition = (position: any) => position == UNIT_POSITION
const isTenPosition = (position: any) => position % MAX_POSITION == TEN_POSITION
const isMillionsPosition = (position: any) => position >= MAX_POSITION && position % MAX_POSITION == 0
const isLastPosition = (position: any, lengthOfDigits: any) => position + 1 < lengthOfDigits

const reverseNumber = (number: any) => {
    const numberStr = number.toString()
    return numberStr.split('').reverse().join('')
}

const getBathUnit = (position: any, number: any) => {
    let unitText = ''

    if (!isUnitPosition(position)) {
        unitText = UNIT_TEXTS[Math.abs(position - 1) % MAX_POSITION]
    }

    if (isZeroValue(number) && !isMillionsPosition(position)) {
        unitText = ''
    }

    return unitText
}

const getBathText = (position: any, number: any, lengthOfDigits: any) => {
    let numberText = NUMBER_TEXTS[number]

    if (isZeroValue(number)) {
        return ''
    }

    if (isTenPosition(position) && number == 1) {
        numberText = ''
    }

    if (isTenPosition(position) && number == 2) {
        numberText = 'ยี่'
    }

    if (isMillionsPosition(position) && isLastPosition(position, lengthOfDigits) && number == 1) {
        numberText = 'เอ็ด'
    }

    if (lengthOfDigits == 2 && isLastPosition(position, lengthOfDigits) && number == 1) {
        numberText = 'เอ็ด'
    }

    if (lengthOfDigits > 1 && isUnitPosition(position) && number == 1) {
        numberText = 'เอ็ด'
    }

    return numberText
}

// convert function without async
const convert = (numberInput: any) => {
    const numberReverse = reverseNumber(numberInput)
    let textOutput = ''
    // console.log('>', numberReverse.split(''))
    numberReverse.split('').forEach((number: any, i: any) => {
        textOutput = `${getBathText(i, number, numberReverse.length)}${getBathUnit(i, number)}${textOutput}`
    })
    return textOutput
}

const parseFloatWithPrecision = (number: any, precision = 2) => {
    const numberFloatStr = parseFloat(number).toString().split('.')
    const integerUnitStr = numberFloatStr[0]
    const fractionalUnitStr = numberFloatStr.length == 2 ? numberFloatStr[1].substring(0, precision) : '00'
    return parseFloat(`${integerUnitStr}.${fractionalUnitStr}`).toFixed(precision)
}

const thaiBaht = (numberInput: any) => {
    const numberStr = parseFloatWithPrecision(numberInput)

    const integerDigits = getIntegerDigits(numberStr)
    const fractionalDigits = getFractionalDigits(numberStr)

    const intTextOutput = convert(integerDigits)
    const textOutput = []
    if (intTextOutput) {
        textOutput.push(`${[intTextOutput, PRIMARY_UNIT].join('')}`)
    }
    if (intTextOutput && !hasFractionalDigits(fractionalDigits)) {
        textOutput.push(WHOLE_NUMBER_TEXT)
    }
    if (hasFractionalDigits(fractionalDigits) && convert(fractionalDigits)) {
        textOutput.push(`${[convert(fractionalDigits), SECONDARY_UNIT].join('')}`)
    }

    return textOutput.join('')
}

export default thaiBaht
