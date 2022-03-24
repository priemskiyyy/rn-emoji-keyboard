import * as React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { defaultKeyboardContext, defaultKeyboardValues } from './KeyboardProvider'
import type {
  CategoryTranslation,
  EmojiType,
  CategoryTypes,
  CategoryPosition,
  EmojisByCategory,
} from '../types'

export type OnEmojiSelected = (emoji: EmojiType) => void

export type KeyboardProps = {
  open: boolean
  onClose: () => void
  onEmojiSelected: OnEmojiSelected
  emojiSize?: number
  containerStyles?: ViewStyle
  knobStyles?: ViewStyle
  headerStyles?: TextStyle
  expandable?: boolean
  hideHeader?: boolean
  defaultHeight?: number | string
  expandedHeight?: number | string
  backdropColor?: string
  categoryColor?: string
  activeCategoryColor?: string
  categoryContainerColor?: string
  activeCategoryContainerColor?: string
  onCategoryChangeFailed?: (info: {
    index: number
    highestMeasuredFrameIndex: number
    averageItemLength: number
  }) => void
  translation?: CategoryTranslation
  disabledCategories?: CategoryTypes[]
  enableRecentlyUsed?: boolean
  categoryPosition?: CategoryPosition
  enableSearchBar?: boolean
  closeSearchColor?: string
  searchBarStyles?: ViewStyle
  searchBarTextStyles?: TextStyle
  searchBarPlaceholderColor?: string
  categoryOrder?: CategoryTypes[]
  onRequestClose?: () => void
  categoryContainerStyles?: ViewStyle
  disableSafeArea?: boolean
  enableSearchBarIcon?: boolean
  SearchBarIcon?: () => JSX.Element
  searchBarIconContainerStyle?: ViewStyle
  searchBarIconOnPress?: () => unknown | Promise<unknown>
}
export type ContextValues = {
  activeCategoryIndex: number
  setActiveCategoryIndex: (index: number) => void
  numberOfColumns: number
  width: number
  searchPhrase: string
  setSearchPhrase: (phrase: string) => void
  renderList: EmojisByCategory[]
}

export const KeyboardContext = React.createContext<Required<KeyboardProps> & ContextValues>({
  ...defaultKeyboardContext,
  ...defaultKeyboardValues,
})
