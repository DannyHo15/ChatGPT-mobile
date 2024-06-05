import * as React from "react"
import { Image, Pressable, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Card } from "./Card"
import { Sender, TMessageData } from "app/utils/models"
import { ActivityIndicator, Avatar } from "react-native-paper"
import { ImageStyle } from "expo-image"
import * as ContextMenu from "zeego/context-menu"
import { copyImageToClipboard, downloadAndSaveImage, shareImage } from "app/utils/image-helper"
import { navigate } from "app/navigators"
const logoWhite = require("assets/images/gpt/logo-white.png")

export interface MessageProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Data that this component needs to render.
   */
  data: TMessageData
  loading?: boolean
}

/**
 * Describe your component here
 */
export const Message = observer(function Message(props: MessageProps) {
  const { style, data } = props
  const $styles = [$container, style]
  const contextItems = [
    {
      title: "Copy",
      systemIcon: "doc.on.doc",
      action: () => data.imageUrl && copyImageToClipboard(data.imageUrl),
    },
    {
      title: "Save to Photos",
      systemIcon: "arrow.down.to.line",
      action: () => data.imageUrl && downloadAndSaveImage(data.imageUrl),
    },
    {
      title: "Share",
      systemIcon: "square.and.arrow.up",
      action: () => data.imageUrl && shareImage(data.imageUrl),
    },
  ]
  const gotoEditImage = () => {
    navigate("EditImage", { uri: data.imageUrl, prompt: data.prompt })
  }
  return (
    <Card
      verticalAlignment="space-between"
      HeadingComponent={
        <View style={$heading}>
          <View style={$avatarContainer}>
            {data.role === Sender.User ? (
              <Avatar.Image size={30} source={{ uri: "https://galaxies.dev/img/meerkat_2.jpg" }} />
            ) : (
              <Avatar.Icon size={30} style={$icon} icon={logoWhite} />
            )}
          </View>
          <View style={$headerTextContainer}>
            <Text style={$headerText}>{data.role}</Text>
          </View>
        </View>
      }
      ContentComponent={
        props.loading ? (
          <View style={$loading}>
            <ActivityIndicator color={colors.palette.primary} size="small" />
          </View>
        ) : data.content === "" && data.imageUrl ? (
          <View style={$contentContainer}>
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <Pressable onPress={gotoEditImage}>
                  <Image source={{ uri: data.imageUrl }} style={$previewImage} />
                </Pressable>
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                {contextItems.map((item) => (
                  <ContextMenu.Item key={item.title} onSelect={item.action}>
                    <ContextMenu.ItemTitle>{item.title}</ContextMenu.ItemTitle>
                    <ContextMenu.ItemIcon ios={{ name: item.systemIcon, pointSize: 18 }} />
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Content>
            </ContextMenu.Root>
          </View>
        ) : (
          <Text style={$messageContent}>{data.content}</Text>
        )
      }
      contentStyle={$messageContent}
      style={$styles}
    ></Card>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  backgroundColor: colors.transparent,
  shadowColor: colors.transparent,
  borderColor: colors.transparent,
}

const $heading: ViewStyle = {
  flexDirection: "row",
}

const $headerTextContainer: ViewStyle = {
  alignItems: "flex-start",
  flex: 1,
}

const $headerText: TextStyle = {
  fontFamily: typography.primary.semiBold,
  fontSize: 16,
  paddingLeft: 10,
  color: colors.palette.neutral900,
}

const $avatarContainer: ViewStyle = {
  width: 28,
  height: 28,
  borderRadius: 25,
  justifyContent: "center",
  alignItems: "center",
}
const $messageContent: TextStyle = {
  color: colors.text,
  marginLeft: 40,
  flex: 1,
}
const $icon: ViewStyle = {
  backgroundColor: "#000",
  alignSelf: "center",
}

const $loading: ViewStyle = {
  justifyContent: "flex-start",
  height: 26,
  width: 26,
  marginLeft: 40,
}

const $previewImage: ImageStyle = {
  width: 240,
  height: 240,
  borderRadius: 10,
}

const $contentContainer: ViewStyle = {
  width: 240,
  height: 240,
  marginLeft: 40,
}
