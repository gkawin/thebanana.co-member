export type BookingInfoFormProps = any
export const BookingInfoForm: React.VFC<BookingInfoFormProps> = ({ register, errors }) => {
    return (
        <>
            <label htmlFor="studentName">ชื่อผู้เรียน</label>
            <input
                type="text"
                className="form-input rounded"
                id="studentName"
                {...register('studentName', { required: 'กรุณาระบุ' })}
            />
            <small className="text-red-500 mb-2">{errors.studentName?.message}</small>

            <label htmlFor="nickname">ชื่อเล่น</label>
            <input
                type="text"
                className="form-input rounded"
                id="nickname"
                {...register('nickname', { required: 'กรุณาระบุ' })}
            />
            <small className="text-red-500 mb-2">{errors.nickname?.message}</small>

            <label htmlFor="school">โรงเรียน</label>
            <input
                type="text"
                className="form-input rounded"
                id="school"
                {...register('school', { required: 'กรุณาระบุ' })}
            />
            <small className="text-red-500 mb-2">{errors.school?.message}</small>
        </>
    )
}
