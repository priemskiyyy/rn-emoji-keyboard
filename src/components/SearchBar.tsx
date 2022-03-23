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

  return (
    <View style={[styles.container, searchBarStyles]}>
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
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#00000011',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  button: {
    marginRight: 8,
  },
})
