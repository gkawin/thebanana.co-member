import { ProductCard } from '@/components/products/ProductCard'
import useCourses from '@/concerns/use-courses'
import { useUserInfo } from '@/core/RootContext'
import { faAddressCard } from '@fortawesome/free-regular-svg-icons'
import { faHistory } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
    const courses = useCourses()
    const { profile } = useUserInfo()

    return (
        <section className="container mx-auto">
            <div className="py-4 grid grid-cols-[64px_1fr] gap-x-4">
                <div>
                    {profile?.pictureUrl && (
                        <Image
                            unoptimized
                            className="rounded-full"
                            src={profile.pictureUrl}
                            width={64}
                            height={64}
                            alt="avatar"
                        />
                    )}
                </div>
                <div>
                    <h1 className="font-semibold text-xl text-gray-700">{profile.displayName}</h1>
                    <h2 className="font-light text-gray-700 text-sm">{profile.statusMessage}</h2>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4">
                <Link href="/my/booking">
                    <a className="rounded border border-gray-200 shadow p-4 flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition duration-150">
                        <FontAwesomeIcon icon={faHistory} size="2x" />
                        <span>การจองของฉัน</span>
                    </a>
                </Link>
                <Link href="/my/info">
                    <a className="rounded border border-gray-200 shadow p-4 flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition duration-150">
                        <FontAwesomeIcon icon={faAddressCard} size="2x" />
                        <span>ข้อมูลส่วนตัว</span>
                    </a>
                </Link>
            </div>
            <h2 className="text-2xl font-semibold">กำลังเปิดรับสมัคร</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-4">
                {courses.map((course) => (
                    <ProductCard
                        slug={`/courses/${course.slug}`}
                        disabled={false}
                        onClick={() => {}}
                        course={course}
                        key={course.code}
                    />
                ))}
            </div>
        </section>
    )
}
