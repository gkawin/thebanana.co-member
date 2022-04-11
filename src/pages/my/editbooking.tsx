import { GetServerSideProps, NextPage } from 'next'

const MyEditBooking: NextPage = () => {
    return (
        <div>
            <ul>
                <li>ออกใบเสร็จออนไลน์</li>
                <li>หมายเลขการจอง</li>
            </ul>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    if (!query?.bookingCode) return { props: {}, notFound: true }
    return {
        props: {},
    }
}

export default MyEditBooking
