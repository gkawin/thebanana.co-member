import { BookingGroup } from 'packages/web/src/constants'

export type BookingFilterPanelProps = { setBookingGroup: (group: BookingGroup) => void; bookingGroup: BookingGroup }

export const BookingFilterPanel: React.VFC<BookingFilterPanelProps> = (props) => {
    const getTabClasses = (definedGroup: BookingGroup) =>
        definedGroup === props.bookingGroup
            ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'

    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-500">
            <ul className="flex flex-wrap -mb-px">
                <li className="mr-2">
                    <div
                        onClick={() => props.setBookingGroup(BookingGroup.UpComming)}
                        className={`inline-block p-2 rounded-t-lg border-b-2 ${getTabClasses(BookingGroup.UpComming)}`}
                    >
                        กำลังจะมาถึง
                    </div>
                </li>
                <li className="mr-2">
                    <div
                        onClick={() => props.setBookingGroup(BookingGroup.Past)}
                        className={`inline-block p-2 rounded-t-lg border-b-2 ${getTabClasses(BookingGroup.Past)}`}
                        aria-current="page"
                    >
                        เรียนแล้ว
                    </div>
                </li>
                <li className="mr-2">
                    <div
                        onClick={() => props.setBookingGroup(BookingGroup.Cancelled)}
                        className={`inline-block p-2 rounded-t-lg border-b-2 ${getTabClasses(BookingGroup.Cancelled)}`}
                    >
                        ยกเลิก
                    </div>
                </li>
            </ul>
        </div>
    )
}
