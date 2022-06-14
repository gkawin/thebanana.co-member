import { useUser } from 'packages/web/src/core/RootContext'

export const UserCard: React.VFC = () => {
    const { lineProfile } = useUser()

    return (
        <div className="border-none  bg-gradient-to-b from-yellow-200 to-yellow-500 p-4">
            <div>สวัสดี {lineProfile.displayName}</div>
            <h1 className="text-2xl"></h1>
        </div>
    )
}
