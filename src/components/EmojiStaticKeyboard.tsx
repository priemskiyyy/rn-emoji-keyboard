import * as React from 'react'

import { StyleSheet, View, FlatList, useWindowDimensions, Animated } from 'react-native'
import type { CategoryTypes } from '../types'
import { EmojiCategory } from './EmojiCategory'
import { KeyboardContext } from '../contexts/KeyboardContext'
import { Categories } from './Categories'
import { SearchBar } from './SearchBar'
import { useKeyboardStore } from '../store/useKeyboardStore'
import { useCallback } from 'react'
import { useKeyboardAvoiding } from '../hooks/useKeyobardAvoiding'
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated'

export const EmojiStaticKeyboard = React.memo(
  () => {
    const { width } = useWindowDimensions()
    const {
      activeCategoryIndex,
      containerStyles,
      onCategoryChangeFailed,
      categoryPosition,
      enableSearchBar,
      searchPhrase,
      renderList,
      disableSafeArea,
    } = React.useContext(KeyboardContext)
    const { keyboardState } = useKeyboardStore()
    const flatListRef = React.useRef<FlatList>(null)

    const getItemLayout = useCallback(
      (_: CategoryTypes[] | null | undefined, index: number) => ({
        length: width,
        offset: width * index,
        index,
      }),
      [width]
    )

    const renderItem = React.useCallback((props) => <EmojiCategory {...props} />, [])
    const keyExtractor = useCallback((item) => item.title, [])
    React.useEffect(() => {
      flatListRef.current?.scrollToIndex({
        index: activeCategoryIndex,
      })
    }, [activeCategoryIndex])
    const { keyboardVisible } = useKeyboardAvoiding()
    const animatedVisibility = useAnimatedStyle(() => ({
      display: keyboardVisible.value ? 'none' : 'flex',
    }))
    return (
      <View
        style={[
          styles.container,
          styles.containerShadow,
          categoryPosition === 'top' && disableSafeArea && styles.containerReverse,
          containerStyles,
        ]}>
        <>
          {enableSearchBar && <SearchBar />}
          <Animated.FlatList
            extraData={[keyboardState.recentlyUsed.length, searchPhrase]}
            data={renderList}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            removeClippedSubviews={true}
            ref={flatListRef}
            onScrollToIndexFailed={onCategoryChangeFailed}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            scrollEventThrottle={16}
            getItemLayout={getItemLayout}
            scrollEnabled={false}
            initialNumToRender={1}
            windowSize={1}
            maxToRenderPerBatch={1}
          />
          <Reanimated.View style={[animatedVisibility]}>
            <Categories />
          </Reanimated.View>
        </>
      </View>
    )
  },
  () => true
)

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  containerReverse: { flexDirection: 'column-reverse' },
  containerShadow: {
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 10,
  },
})
