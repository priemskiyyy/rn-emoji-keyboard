import * as React from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { KeyboardContext } from '../contexts/KeyboardContext'
import { Icon } from './Icon'
import { useCallback } from 'react'

export const SearchBar = () => {
  const {
    searchPhrase,
    setSearchPhrase,
    translation,
    setActiveCategoryIndex,
    closeSearchColor,
    searchBarStyles,
    searchBarTextStyles,
    searchBarPlaceholderColor,
    renderList,
    enableSearchBarIcon,
    SearchBarIcon,
    searchBarIconContainerStyle,
    searchBarIconOnPress,
  } = React.useContext(KeyboardContext)
  const inputRef = React.useRef<TextInput>(null)
  const handleSearch = useCallback(
    (text: string) => {
      setSearchPhrase(text)
      if (text === '') return setActiveCategoryIndex(0)
      const searchIndex = renderList.findIndex((cat) => cat.title === 'search')
      if (searchIndex !== -1) setActiveCategoryIndex(searchIndex)
    },
    [renderList, setActiveCategoryIndex, setSearchPhrase]
  )
  const clearPhrase = () => {
    setSearchPhrase('')
    inputRef.current?.blur()
    setActiveCategoryIndex(0)
  }
  const focus = async () => {
    inputRef.current?.focus()
    await searchBarIconOnPress()
  }
  return (
    <View style={[styles.container, searchBarStyles]}>
      {enableSearchBarIcon && (
        <TouchableOpacity onPress={focus} style={[styles.button, searchBarIconContainerStyle]}>
          <SearchBarIcon />
        </TouchableOpacity>
      )}
      <TextInput
        style={[styles.input, searchBarTextStyles]}
        value={searchPhrase}
        onChangeText={handleSearch}
        placeholder={translation.search}
        ref={inputRef}
        placeholderTextColor={searchBarPlaceholderColor}
      />
      {!!searchPhrase && (
        <TouchableOpacity onPress={clearPhrase} style={styles.button}>
          <Icon
            iconName={'Close'}
            isActive={true}
            normalColor={closeSearchColor}
            activeColor={closeSearchColor}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00000011',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 34,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  button: {
    marginRight: 8,
  },
})
