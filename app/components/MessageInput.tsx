import * as React from "react"
import {  StyleProp, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors } from "app/theme"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import { TextField } from "./TextField"
import { useState } from "react"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { BlurView } from "expo-blur"
import { IconButton } from "react-native-paper"
import * as DocumentPicker from "expo-document-picker"
import * as ImagePicker from "expo-image-picker"
export interface MessageInputProps {
  /**
   * An optional style override useful for padding & margin.
   */
  onShouldSend: (message: string) => void
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */

const ATouchableOpacity = Animated.createAnimatedComponent(IconButton)

export const MessageInput = observer(function MessageInput(props: MessageInputProps) {
  const { onShouldSend } = props
  const $bottomSafeArea = useSafeAreaInsetsStyle(["bottom"], "padding")
  const [message, setMessage] = useState("")
  const expanded = useSharedValue(0)
  // const permission = ImagePicker.useCameraPermissions()
  // useEffect(() => {
  //  console.log(permission)
  // },[])
  const onSend = () => {
    onShouldSend(message)
    setMessage("")
  }
  const onChangeText = (text: string) => {
    collapseItems()
    setMessage(text)
  }
  const expandItems = () => {
    expanded.value = withTiming(1, { duration: 400 })
  }
  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: 400 })
  }
  const $expandedStyle = useAnimatedStyle(() => {
    const opacityInterpolation = interpolate(expanded.value, [0, 1], [1, 0], Extrapolation.CLAMP)
    const widthInterpolation = interpolate(expanded.value, [0, 1], [33, 0], Extrapolation.CLAMP)
    return {
      opacity: opacityInterpolation,
      width: widthInterpolation,
    }
  })
  const $groupButtonViewStyle = useAnimatedStyle(() => {
    const widthInterpolation = interpolate(expanded.value, [0, 1], [0, 100], Extrapolation.CLAMP)
    return {
      opacity: expanded.value,
      width: widthInterpolation,
    }
  })
  return (
    <BlurView intensity={80} tint="extraLight" style={[$inputMessageContainer, $bottomSafeArea]}>
      <View style={$inputMessageOuter}>
        <ATouchableOpacity
          icon={() => <Ionicons name="add" size={20} color={colors.palette.grey} />}
          iconColor={colors.palette.grey}
          size={18}
          mode="contained-tonal"
          onPress={expandItems}
          style={$expandedStyle}
        />
        <Animated.View style={[$groupButtonViewStyle, $groupButtonView]}>
          <TouchableOpacity onPress={() => ImagePicker.launchCameraAsync()}>
            <Ionicons name="camera-outline" size={24} color={colors.palette.grey} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => ImagePicker.launchImageLibraryAsync()}>
            <Ionicons name="image-outline" size={24} color={colors.palette.grey} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => DocumentPicker.getDocumentAsync()}>
            <Ionicons name="folder-outline" size={24} color={colors.palette.grey} />
          </TouchableOpacity>
        </Animated.View>
        <TextField
          placeholderTx="chat.placeholder"
          containerStyle={$inputMessage}
          inputWrapperStyle={$inputMessage}
          multiline
          onChangeText={onChangeText}
          onFocus={collapseItems}
          value={message}
        />
        {message.length > 0 ? (
          <TouchableOpacity onPress={onSend}>
            <Ionicons name="send" size={24} color={colors.palette.grey} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <FontAwesome5 name="headphones" size={24} color={colors.palette.grey} />
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  )
})

const $inputMessageContainer: ViewStyle = {
  flex: 1,
  borderRadius: 20,
  paddingTop: 10,
}

// const $drawerIcon: ViewStyle = {
//   backgroundColor: colors.palette.primary,
// }

const $groupButtonView: ViewStyle = {
  flexDirection: "row",
  alignItems: "stretch",
  gap: 12,
}
const $inputMessageOuter: ViewStyle = {
  borderTopStartRadius: 20,
  borderBottomStartRadius: 20,
  paddingHorizontal: 20,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.transparent,
}
const $inputMessage: ViewStyle = {
  borderRadius: 20,
  minHeight: 40,
  flex: 1,
  overflow: "hidden",
  marginHorizontal: 10,
  backgroundColor: colors.background,
}
