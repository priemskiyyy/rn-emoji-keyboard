import * as React from 'react'
import { EmojiStaticKeyboard } from './components/EmojiStaticKeyboard'
import { KeyboardProvider } from './contexts/KeyboardProvider'
import type { KeyboardProps } from './contexts/KeyboardContext'
import { memo } from 'react'

type EmojiKeyboardProps = Omit<Partial<KeyboardProps>, 'open' | 'onClose'> &
  Pick<KeyboardProps, 'onEmojiSelected'>

export const EmojiKeyboard = memo((props: EmojiKeyboardProps) => {
  return (
    <KeyboardProvider {...props} open={true} onClose={() => {}}>
      <EmojiStaticKeyboard />
    </KeyboardProvider>
  )
})
