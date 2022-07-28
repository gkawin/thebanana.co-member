import React from 'react'
import Lottie, { LottieProps } from 'react-lottie'

export type SpinLoadingProps = { global?: boolean } & Partial<LottieProps>

export const SpinLoading: React.FC<SpinLoadingProps> = ({ global = false, ...lottieProps }) => {
    return (
        <Lottie
            height={lottieProps?.height ?? 200}
            width={lottieProps?.width ?? 200}
            {...lottieProps}
            options={{
                loop: true,
                animationData: require('@/public/loading'),
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice',
                },
                ...(lottieProps?.options ?? {}),
            }}
        />
    )
}
