import * as React from 'react'
import { useWindowDimensions } from 'react-native'
import { KeyboardProps, ContextValues, KeyboardContext, OnEmojiSelected } from './KeyboardContext'
import en from '../translation/en'
import emojisByGroup from '../assets/emojis.json'
import { useKeyboardStore } from '../store/useKeyboardStore'
import type { EmojiType, CategoryTypes, EmojisByCategory } from '../types'
import { CATEGORIES } from '../types'

type ProviderProps = Partial<KeyboardProps> & {
  children: React.ReactNode
  onEmojiSelected: OnEmojiSelected
}

export const defaultKeyboardContext: Required<KeyboardProps> = {
  open: false,
  onClose: () => {},
  onEmojiSelected: (_emoji: EmojiType) => {},
  emojiSize: 28,
  containerStyles: {},
  knobStyles: {},
  headerStyles: {},
  expandable: true,
  hideHeader: false,
  defaultHeight: '50%',
  expandedHeight: '80%',
  backdropColor: '#00000055',
  categoryColor: '#000000',
  activeCategoryColor: '#005b96',
  categoryContainerColor: '#e3dbcd',
  activeCategoryContainerColor: '#ffffff',
  onCategoryChangeFailed: (info) => {
    console.warn(info)
  },
  translation: en,
  disabledCategories: [],
  enableRecentlyUsed: false,
  categoryPosition: 'floating',
  enableSearchBar: false,
  closeSearchColor: '#00000055',
  searchBarStyles: {},
  searchBarTextStyles: {},
  searchBarPlaceholderColor: '#00000055',
  categoryOrder: [...CATEGORIES],
  onRequestClose: () => {},
  categoryContainerStyles: {},
  disableSafeArea: true,
}

export const defaultKeyboardValues: ContextValues = {
  activeCategoryIndex: 0,
  setActiveCategoryIndex: () => {},
  numberOfColumns: 5,
  width: 0,
  searchPhrase: '',
  setSearchPhrase: (_phrase: string) => {},
  renderList: [],
}

export const KeyboardProvider: React.FC<ProviderProps> = React.memo((props) => {
  const { width } = useWindowDimensions()
  const [activeCategoryIndex, setActiveCategoryIndex] = React.useState(0)
  const [searchPhrase, setSearchPhrase] = React.useState('')
  const { keyboardState } = useKeyboardStore()

  const numberOfColumns = React.useRef<number>(
    Math.floor(width / ((props.emojiSize ? props.emojiSize : defaultKeyboardContext.emojiSize) * 2))
  )
  React.useEffect(() => {
    if (props.open) setActiveCategoryIndex(0)
    setSearchPhrase('')
  }, [props.open])

  const renderList = React.useMemo(() => {
    let data = emojisByGroup.filter((category) => {
      const title = category.title as CategoryTypes
      if (props.disabledCategories) return !props.disabledCategories.includes(title)
      return true
    })
    if (keyboardState.recentlyUsed.length && props.enableRecentlyUsed) {
      data.push({
        title: 'recently_used' as CategoryTypes,
        data: keyboardState.recentlyUsed,
      })
    }
    if (props.enableSearchBar) {
      data.push({
        title: 'search' as CategoryTypes,
        data: emojisByGroup
          .map((group) => group.data)
          .flat()
          .filter((emoji) => {
            return (
              emoji.name.toLowerCase().includes(searchPhrase.toLowerCase()) ||
              emoji.emoji.toLowerCase().includes(searchPhrase)
            )
          }),
      })
    }
    if (props.categoryOrder) {
      const orderedData = props.categoryOrder.flatMap((name) =>
        data.filter((el) => el.title === name)
      )
      const restData = data.filter(
        (el) => !props?.categoryOrder?.includes(el.title as CategoryTypes)
      )
      data = [...orderedData, ...restData]
    }
    return data as EmojisByCategory[]
  }, [
    keyboardState.recentlyUsed,
    props.enableRecentlyUsed,
    props.enableSearchBar,
    props.categoryOrder,
    props.disabledCategories,
    searchPhrase,
  ])

  const value: Required<KeyboardProps> & ContextValues = {
    ...defaultKeyboardContext,
    ...defaultKeyboardValues,
    ...props,
    activeCategoryIndex,
    setActiveCategoryIndex,
    numberOfColumns: numberOfColumns.current,
    width,
    searchPhrase,
    setSearchPhrase,
    renderList,
  }
  return <KeyboardContext.Provider value={value}>{props.children}</KeyboardContext.Provider>
})

KeyboardProvider.displayName = 'KeyboardProvider'
