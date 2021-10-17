import { useAuth } from '@/core/RootContext'
import { Container, Typography } from '@mui/material'

export default function Home() {
    const auth = useAuth()

    return (
        <Container maxWidth="lg">
            <Typography variant="h2">{auth.phoneNumber}</Typography>
        </Container>
    )
}
