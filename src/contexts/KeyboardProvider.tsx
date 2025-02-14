import * as React from 'react'
import { useWindowDimensions } from 'react-native'
import { KeyboardProps, ContextValues, KeyboardContext, OnEmojiSelected } from './KeyboardContext'
import en from '../translation/en'
import emojisByGroup from '../assets/emojis.json'
import { useKeyboardStore } from '../store/useKeyboardStore'
import type { EmojiType, CategoryTypes, EmojisByCategory } from '../types'
import { CATEGORIES } from '../types'
import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'

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
  enableSearchBarIcon: false,
  SearchBarIcon: () => (
    <Icon iconName={'Close'} isActive={true} normalColor={'white'} activeColor={'white'} />
  ),
  searchBarIconContainerStyle: {},
  searchBarIconOnPress: () => {},
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
const fil = <_, K>(fn: (i: K) => boolean, array: K[]) => {
  const f = [] //final
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      f.push(array[i])
    }
  }
  return f
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

  const [renderList, setRenderList] = useState<EmojisByCategory[]>(
    emojisByGroup as EmojisByCategory[]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
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
      if (props.enableSearchBar && searchPhrase.length > 1) {
        data = [
          {
            title: 'search' as CategoryTypes,
            data: fil((emoji) => {
              if (searchPhrase.length < 1) return false
              return (
                emoji.name.toLowerCase().includes(searchPhrase.toLowerCase()) ||
                emoji.emoji.toLowerCase().includes(searchPhrase)
              )
            }, emojisByGroup.map((group) => group.data).flat()),
          },
          ...data,
        ]
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
      setRenderList(data as EmojisByCategory[])
    }, 200)
    return () => clearTimeout(timeout)
  }, [
    keyboardState.recentlyUsed,
    props.categoryOrder,
    props.disabledCategories,
    props.enableRecentlyUsed,
    props.enableSearchBar,
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
