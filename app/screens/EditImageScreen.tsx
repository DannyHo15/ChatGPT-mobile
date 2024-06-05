import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { ImageStyle, TouchableOpacity, View, ViewStyle, Text, TextStyle } from 'react-native'
import { AppStackScreenProps, goBack } from 'app/navigators'
import { Button, DropdownMenuComponent, Screen } from 'app/components'
import { ImageZoom } from '@likashefqet/react-native-image-zoom'
import { colors, typography } from 'app/theme'
import { BlurView } from 'expo-blur'
import IonIcons from '@expo/vector-icons/Ionicons'
import OctIcons from '@expo/vector-icons/Octicons'
import { useSafeAreaInsetsStyle } from 'app/utils/useSafeAreaInsetsStyle'
import { downloadAndSaveImage, shareImage } from 'app/utils/image-helper'
import { useNavigation } from '@react-navigation/native'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { RootSiblingParent } from 'react-native-root-siblings'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-toast-message'
interface EditImageScreenProps extends AppStackScreenProps<'EditImage'> { }

export const EditImageScreen: FC<EditImageScreenProps> = observer(function EditImageScreen({
  route,
  ...props
}) {
  const { uri } = route.params
  const $bottomSafeArea = useSafeAreaInsetsStyle(['bottom'], 'padding')
  const navigation = useNavigation()
  const snapPoints = useMemo(() => ['25%', '50%'], [])
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss()
  }, [])
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const onCopyPrompt = () => {
    Clipboard.setStringAsync(route.params.prompt!)
    Toast.show({
      type: 'success',
      text1: 'Prompt',
      text2: 'Copied to clipboard',
    })
  }
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <DropdownMenuComponent
          items={[
            { key: '1', title: 'View prompt', icon: 'info.circle' },
            { key: '2', title: 'Learn more', icon: 'questionmark.circle' },
          ]}
          onSelect={handlePresentModalPress}
        />
      ),
      headerLeft: () => {
        return (
          props.navigation.canGoBack() && (
            <IonIcons
              color={colors.palette.light}
              name="close"
              size={32}
              onPress={() => goBack()}
            />
          )
        )
      },
    })
  }, [])
  return (
    <BottomSheetModalProvider>
      <Screen style={$root} contentContainerStyle={$contentContainer} preset="auto">
        <ImageZoom
          minScale={0.5}
          maxScale={5}
          minPanPointers={1}
          doubleTapScale={2}
          isPanEnabled={true}
          isDoubleTapEnabled={true}
          isSingleTapEnabled={true}
          style={$imageContainer}
          uri={uri}
          resizeMode="contain"
        />
        <BlurView intensity={80} tint="dark" style={[$blurView, $bottomSafeArea]}>
          <View style={$groupBtn}>
            <TouchableOpacity style={$btn} onPress={() => { }}>
              <IonIcons name="chatbubble-ellipses-outline" size={24} color="#fff" />
              <Text style={$btnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={$btn} onPress={() => { }}>
              <IonIcons name="brush-outline" size={24} color="#fff" />
              <Text style={$btnText}>Select</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={$btn}
              onPress={() => {
                downloadAndSaveImage(uri)
              }}
            >
              <OctIcons name="download" size={25} color="#fff" />
              <Text style={$btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={$btn}
              onPress={() => {
                shareImage(uri)
              }}
            >
              <OctIcons name="share" size={24} color="#fff" />
              <Text style={$btnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          handleIndicatorStyle={{ backgroundColor: colors.palette.greyLight }}
          backgroundStyle={{ backgroundColor: colors.palette.grey }}

        >
          <Toast />

          <View style={[$modalContainer, $bottomSafeArea]}>
            <View style={$sheetContentHeader}>
              <Text style={$textTitle}>Prompt</Text>
              <IonIcons
                name="close-circle"
                size={30}
                color="#fff"
                onPress={handleCloseModalPress} />
            </View>
            <BottomSheetScrollView>
              <View style={$bottomSheetcontentContainer}>
                <View style={$sheetContentContainer}>
                  <Text style={$text}>{route.params.prompt}</Text>
                </View>
              </View>
            </BottomSheetScrollView>
            <Button style={[$btn, $customBtn]} onPress={onCopyPrompt}>
              <Text>Copy</Text>
            </Button>

          </View>
        </BottomSheetModal>
      </Screen>
    </BottomSheetModalProvider>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.transparent,
}
const $modalContainer: ViewStyle = {
  paddingHorizontal: 20,
  flex: 1,
}
const $customBtn = {
  borderRadius: 10
}

const $contentContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000',
}
const $bottomSheetcontentContainer: ViewStyle = {
  flex: 1,
}
const $sheetContentHeader: ViewStyle = {
  flexDirection: 'row',
  paddingVertical: 10,
  justifyContent: 'space-between',
}
const $sheetContentContainer: ViewStyle = {
  paddingVertical: 20,
}
const $textTitle: TextStyle = {
  color: colors.palette.light,
  fontSize: 20,
  fontFamily: typography.primary.semiBold,
}
const $text: TextStyle = {
  color: colors.palette.light,
  fontSize: 16,
  fontFamily: typography.primary.normal,
}
const $imageContainer: ImageStyle = {
  flex: 1,
  width: '100%',
  height: '100%',
}

const $blurView: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: 'auto',
  bottom: 0,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}

const $groupBtn: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingVertical: 16,
  paddingHorizontal: 20,
}
const $btnText: TextStyle = {
  color: '#fff',
  fontSize: 16,
  fontFamily: typography.primary.normal,
}
const $btn: ViewStyle = {
  alignItems: 'center',
  gap: 10,
}
