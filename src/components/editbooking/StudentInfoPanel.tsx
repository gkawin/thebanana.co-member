import type { BookingModel } from '@/models/BookingModel'

export type StudentInfoPanelProps = {
    studentInfo?: BookingModel['studentInfo']
}

export const StudentInfoPanel: React.FC<StudentInfoPanelProps> = ({ studentInfo }) => {
    if (!studentInfo) return null

    return (
        <div className="px-2 py-4 rounded shadow-gray-300 shadow-md border border-gray-50 space-y-1">
            <h2>ข้อมูลผู้เรียน</h2>
            <div className="text-sm">
                <h3>
                    {studentInfo?.studentName} ({studentInfo?.nickname})
                </h3>
                <div className="text-gray-500 text-xs">โรงเรียน{studentInfo?.school}</div>
            </div>
        </div>
    )
}
