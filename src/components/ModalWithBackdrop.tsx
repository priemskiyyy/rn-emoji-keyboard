import * as React from 'react'
import {
  Modal,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ModalProps,
} from 'react-native'
import { KeyboardContext } from '../contexts/KeyboardContext'
import { useTimeout } from '../hooks/useTimeout'
import { IsSafeAreaWrapper } from './ConditionalContainer'
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

type ModalWithBackdropProps = {
  isOpen: boolean
  backdropPress: () => void
  children: React.ReactNode
}

export const ModalWithBackdrop = ({
  isOpen,
  backdropPress,
  children,
  ...rest
}: ModalWithBackdropProps & ModalProps) => {
  const { height: screenHeight } = useWindowDimensions()
  const _translateY = useSharedValue(screenHeight)
  const { backdropColor, disableSafeArea } = React.useContext(KeyboardContext)
  const handleTimeout = useTimeout()

  React.useEffect(() => {
    _translateY.value = withDelay(100, withTiming(isOpen ? 0 : screenHeight, { duration: 300 }))
  }, [_translateY, isOpen, screenHeight])

  const handleClose = () => {
    _translateY.value = withTiming(screenHeight, { duration: 200 })
    handleTimeout(() => backdropPress(), 200)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: _translateY.value,
      },
    ],
  }))

  return (
    <Modal visible={isOpen} animationType="fade" transparent={true} {...rest}>
      <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={handleClose}>
        <View style={[styles.modalContainer, { backgroundColor: backdropColor }]}>
          <IsSafeAreaWrapper style={styles.modalContainer} isSafeArea={!disableSafeArea}>
            <TouchableOpacity activeOpacity={1}>
              <Reanimated.View style={[animatedStyle]}>{children}</Reanimated.View>
            </TouchableOpacity>
          </IsSafeAreaWrapper>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 10,
  },
})
