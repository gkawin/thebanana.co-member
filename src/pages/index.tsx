import { useProfile } from '@/concerns/UserProvider'
import { Container, Typography } from '@material-ui/core'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'

export default function Home() {
    const user = useProfile()
    const router = useRouter()
    useEffect(() => {
        if (!user.isLoggedIn) {
            router.push('/signup')
        }
    }, [router, user.isLoggedIn])

    return (
        <Container maxWidth="lg">
            <Typography variant="h2">{user.displayName}</Typography>
        </Container>
    )
}
