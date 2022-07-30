import { useUserInfo } from '@/core/RootContext'

export const UserCard: React.FC = () => {
    const { profile } = useUserInfo()

    return (
        <div className="border-none  bg-gradient-to-b from-yellow-200 to-yellow-500 p-4">
            <div>สวัสดี {profile.displayName}</div>
            <h1 className="text-2xl"></h1>
        </div>
    )
}
