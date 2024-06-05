import * as React from 'react'
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native'
import { observer } from 'mobx-react-lite'
import { colors, typography } from 'app/theme'
import { Text } from 'app/components/Text'
import { useCallback, useRef } from 'react'
import { $pageContainer } from 'app/theme/style'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
export interface BottomSheetProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  snapPoints?: string[],
  children?: React.ReactNode
}

/**
 * Describe your component here
 */
export const BottomSheetContainer = observer(function BottomSheetContainer(props: BottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { style, snapPoints = ['50%', '50%'], children } = props
  const $styles = [$container, style]
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
    <View style={$styles}>
      <BottomSheet ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        style={$bottomSheetContainer}
        backgroundStyle={$bottomSheetContainer}
        handleIndicatorStyle={{ backgroundColor: colors.palette.light }}
      >
        <BottomSheetView style={$contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: 'center',
  padding: 24,
  borderTopRightRadius: 40,
  borderTopLeftRadius: 40,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  overflow: 'hidden',
  backgroundColor: colors.transparent,
}

const $bottomSheetContainer: ViewStyle = {
  backgroundColor: '#000000',
  borderTopRightRadius: 40,
  borderTopLeftRadius: 40,
  overflow: 'hidden',
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const $contentContainer: ViewStyle = {
  paddingHorizontal: 24,
  gap: 14,
}
