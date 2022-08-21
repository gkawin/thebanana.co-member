import React, { useState } from 'react'
import { Player } from '@lottiefiles/react-lottie-player'
import type { AnimationItem } from 'lottie-web'

export type SpinLoadingProps = { isLoading?: boolean }

export const SpinLoading: React.FC<SpinLoadingProps> = ({ isLoading = false }) => {
    const [_, setLottie] = useState<AnimationItem>(null)
    return !isLoading ? null : (
        <Player
            lottieRef={(instance) => {
                setLottie(instance)
            }}
            autoplay
            src={require('@/public/loading')}
            style={{ height: '200px', width: '200px' }}
            loop
        />
    )
}
