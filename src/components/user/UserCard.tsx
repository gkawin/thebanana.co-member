import { useFirebase } from '@/core/RootContext'

export const UserCard: React.VFC = () => {
    const { auth } = useFirebase()

    return (
        <div className="border-none  bg-gradient-to-b from-yellow-200 to-yellow-500 rounded-lg p-4">
            <div>สวัสดี {auth.currentUser.displayName}</div>
            <h1 className="text-2xl"></h1>
        </div>
    )
}
