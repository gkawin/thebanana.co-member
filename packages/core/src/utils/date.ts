import dayjs from 'dayjs'
import dayjsTH from 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'

dayjs.extend(buddhistEra)
dayjs.locale(dayjsTH)

export const withThaiDateFormat = (date: string, customFormat = 'DD MMMM BBBB') => {
    if (dayjs(date).isValid()) {
        return dayjs(date).format(customFormat)
    }
    console.error('Invalid date format')
    return date
}
