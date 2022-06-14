import { useLoading } from '@/core/LoadingContext'
import React from 'react'
import Lottie, { LottieProps } from 'react-lottie'
import { Curtain } from './Curtain'

export type SpinLoadingProps = { global: boolean } & Partial<LottieProps>

export const SpinLoading: React.VFC<SpinLoadingProps> = ({ global = false, ...lottieProps }) => {
    const { isLoading } = useLoading()

    return !isLoading
        ? null
        : React.createElement(
              global ? Curtain : 'span',
              null,
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
