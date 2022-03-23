import { useCallback, useEffect } from 'react'
import { Keyboard, KeyboardEventListener, ScreenRect } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export type KeyboardAvoidingStyleWorkletFn = (
  endCoordinates: Animated.SharedValue<ScreenRect | null>,
  isVisible: Animated.SharedValue<boolean>
) => ReturnType<typeof useAnimatedStyle>

export const useKeyboardAvoiding = (animatedStyleWorkletFn?: KeyboardAvoidingStyleWorkletFn) => {
  const keyboardVisible = useSharedValue(false)
  const keyboardEndCoordinates = useSharedValue<ScreenRect | null>(null)

  const animatedStyle = useAnimatedStyle(() => {
    const kbHeight = keyboardEndCoordinates.value?.height ?? 0

    return animatedStyleWorkletFn
      ? animatedStyleWorkletFn(keyboardEndCoordinates, keyboardVisible)
      : {
          bottom: withTiming(keyboardVisible.value ? kbHeight * 0.9 : 0),
        }
  }, [animatedStyleWorkletFn, keyboardEndCoordinates, keyboardVisible])

  const handleKeyboardWillChangeFrame = useCallback<KeyboardEventListener>(
    ({ endCoordinates }) => {
      keyboardVisible.value = true
      keyboardEndCoordinates.value = endCoordinates
    },
    [keyboardEndCoordinates, keyboardVisible]
  )

  const handleKeyboardWillHide = useCallback<KeyboardEventListener>(
    ({ endCoordinates }) => {
      keyboardVisible.value = false
      keyboardEndCoordinates.value = endCoordinates
    },
    [keyboardEndCoordinates, keyboardVisible]
  )

  useEffect(() => {
    const emitter = Keyboard.addListener('keyboardWillChangeFrame', handleKeyboardWillChangeFrame)

    return () => emitter.remove()
  }, [handleKeyboardWillChangeFrame])

  useEffect(() => {
    const emitter = Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide)

    return () => emitter.remove()
  }, [handleKeyboardWillHide])

  return { keyboardVisible, keyboardEndCoordinates, animatedStyle }
}
