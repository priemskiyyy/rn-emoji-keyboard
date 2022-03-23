import * as React from 'react'
import { FlatList, StyleSheet, View, ViewStyle } from 'react-native'
import { defaultKeyboardContext } from '../contexts/KeyboardProvider'
import { KeyboardContext } from '../contexts/KeyboardContext'
import { CATEGORIES_NAVIGATION, CategoryNavigationItem, CategoryTypes } from '../types'
import { CategoryItem } from './CategoryItem'
import { exhaustiveTypeCheck } from '../utils'
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useRef } from 'react'

const CATEGORY_ELEMENT_WIDTH = 37

export const Categories = () => {
  const {
    activeCategoryIndex,
    categoryContainerColor,
    onCategoryChangeFailed,
    activeCategoryContainerColor,
    categoryPosition,
    renderList,
    setActiveCategoryIndex,
    categoryContainerStyles,
  } = React.useContext(KeyboardContext)
  const _scrollNav = useSharedValue(0)
  const flatlistRef = useRef<FlatList>(null)
  const handleScrollToCategory = React.useCallback(
    (category: CategoryTypes) => {
      setActiveCategoryIndex(renderList.findIndex((cat) => cat.title === category))
    },
    [renderList, setActiveCategoryIndex]
  )

  const renderItem = React.useCallback(
    ({ item, index }: { item: CategoryNavigationItem; index: number }) => (
      <CategoryItem item={item} index={index} handleScrollToCategory={handleScrollToCategory} />
    ),
    [handleScrollToCategory]
  )
  React.useEffect(() => {
    flatlistRef.current?.scrollToIndex({
      index: activeCategoryIndex,
      viewOffset: CATEGORY_ELEMENT_WIDTH * 2,
      animated: true,
    })
    _scrollNav.value = withTiming(activeCategoryIndex * CATEGORY_ELEMENT_WIDTH)
  }, [_scrollNav, activeCategoryIndex])

  const animatedTranslationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: _scrollNav.value,
      },
    ],
  }))
  const activeIndicator = React.useCallback(
    () => (
      <Reanimated.View
        style={[
          styles.activeIndicator,
          {
            backgroundColor: activeCategoryContainerColor,
          },
          animatedTranslationStyle,
        ]}
      />
    ),
    [activeCategoryContainerColor, animatedTranslationStyle]
  )

  const getStylesBasedOnPosition = () => {
    const style: ViewStyle[] = [styles.navigation, categoryContainerStyles]
    switch (categoryPosition) {
      case 'floating':
        style.push(styles.navigationFloating)
        break
      case 'top':
        style.push(styles.navigationTop)
        break
      case 'bottom':
        style.push(styles.navigationBottom)
        break
      default:
        exhaustiveTypeCheck(categoryPosition)
        break
    }

    if (
      categoryContainerColor !== defaultKeyboardContext.categoryContainerColor ||
      categoryPosition === 'floating'
    )
      style.push({
        backgroundColor: categoryContainerColor,
      })
    return style
  }

  const renderData = React.useMemo(() => {
    return renderList.map((category) => ({
      category: category.title,
      icon:
        CATEGORIES_NAVIGATION.find((cat) => cat.category === category.title)?.icon ||
        'QuestionMark',
    })) as CategoryNavigationItem[]
  }, [renderList])

  return (
    <View style={[categoryPosition === 'floating' && styles.floating]}>
      <View style={getStylesBasedOnPosition()}>
        <FlatList
          ref={flatlistRef}
          data={renderData}
          keyExtractor={(item) => item.category}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          onScrollToIndexFailed={onCategoryChangeFailed}
          ListHeaderComponent={activeIndicator}
          ListHeaderComponentStyle={styles.activeIndicatorContainer}
          extraData={activeCategoryIndex}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  navigation: {
    padding: 3,
    alignItems: 'center',
    borderColor: '#00000011',
  },
  navigationFloating: {
    borderRadius: 8,
  },
  navigationBottom: {
    paddingVertical: 6,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 1,
  },
  navigationTop: {
    paddingTop: 12,
    paddingBottom: 6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
  },
  separator: {
    width: 1,
    height: 28,
    backgroundColor: '#00000011',
    marginHorizontal: 4,
  },
  activeIndicator: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  activeIndicatorContainer: {
    position: 'absolute',
    width: 28,
    height: 28,
  },
})
