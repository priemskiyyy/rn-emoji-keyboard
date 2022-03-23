import * as React from 'react'
import { useWindowDimensions } from 'react-native'
import { EmojiStaticKeyboard } from './components/EmojiStaticKeyboard'
import { defaultKeyboardContext, KeyboardProvider } from './contexts/KeyboardProvider'
import type { KeyboardProps } from './contexts/KeyboardContext'
import type { EmojiType } from './types'
import { ModalWithBackdrop } from './components/ModalWithBackdrop'
import { getHeightWorklet } from './utils'
import Reanimated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import { useKeyboardAvoiding } from './hooks/useKeyobardAvoiding'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { memo } from 'react'

export const EmojiPicker = memo(
  ({
    onEmojiSelected,
    onRequestClose,
    open,
    onClose,
    expandable = defaultKeyboardContext.expandable,
    defaultHeight = defaultKeyboardContext.defaultHeight,
    ...props
  }: KeyboardProps) => {
    const { height: screenHeight } = useWindowDimensions()

    const { top } = useSafeAreaInsets()
    const defHeight = useDerivedValue(
      () => getHeightWorklet(defaultHeight, screenHeight),
      [defaultHeight, screenHeight]
    )
    const close = () => {
      onClose()
    }

    const { animatedStyle } = useKeyboardAvoiding((endCoordinates, isVisible) => {
      'worklet'
      const kbHeight = endCoordinates.value?.height ?? 0
      const emptySafeAreaSpace = screenHeight - defHeight.value - top
      return {
        bottom: withTiming(isVisible.value ? Math.min(kbHeight * 0.75, emptySafeAreaSpace) : 0),
      }
    })

    const defaultHeightStyle = useAnimatedStyle(() => ({
      height: defHeight.value,
    }))
    return (
      <KeyboardProvider
        onEmojiSelected={(emoji: EmojiType) => {
          onEmojiSelected(emoji)
          close()
        }}
        open={open}
        onClose={close}
        expandable={expandable}
        defaultHeight={defaultHeight}
        {...props}>
        <ModalWithBackdrop isOpen={open} backdropPress={close} onRequestClose={onRequestClose}>
          <Reanimated.View style={[animatedStyle, defaultHeightStyle]}>
            <EmojiStaticKeyboard />
          </Reanimated.View>
        </ModalWithBackdrop>
      </KeyboardProvider>
    )
  }
)
