/* eslint-disable react-native/no-inline-styles */
import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, KeyboardAvoidingView, Platform, TextStyle } from "react-native"
import { ChatStackScreenProps, navigate } from "app/navigators"
import { ListView, Message, MessageInput, Screen, Text } from "app/components"
import { colors, spacing } from "app/theme"
import { Sender, TMessageData } from "app/utils/models"
import { StorageMMKV } from "app/utils/storage"
import { useMMKVString } from "react-native-mmkv"
import OpenAI from "react-native-openai"
import { Avatar } from "react-native-paper"

interface DalleScreenProps extends ChatStackScreenProps<"Dalle"> { }
const logoDallE = require("assets/images/gpt/dalle.png")
const dummyMessages = [
  {
    id: 1,
    role: Sender.Bot,
    content: "",
    imageUrl: "https://galaxies.dev/img/meerkat_2.jpg",
    prompt:
      "A meerkat astronaut in a futuristic spacesuit, meerkat astronaut in a futuristic spacesuit, standing upright on a rocky, alien landscape resembling the surface of Mars. The spacesuit is highly detailed with reflective visor and intricate life-support systems. The background shows a distant starry sky and a small Earth visible in the far horizon. The meerkat looks curious and brave, embodying the spirit of exploration.",
  },
]
export const DalleScreen: FC<DalleScreenProps> = observer(function DalleScreen() {
  const [chatContentHeight, setChatContentHeight] = useState(0)
  const [key] = useMMKVString("apiKey", StorageMMKV)
  // const [gptVersion] = useMMKVString("version", StorageMMKV)
  const [organization] = useMMKVString("org", StorageMMKV)
  const [working, setWorking] = useState(false)
  const [messages, setMessages] = useState<TMessageData[]>(dummyMessages)

  useEffect(() => {
    if (!key || key === "" || !organization || organization === "") {
      navigate("Setting")
    }
  }, [key, organization])
  const openAI = useMemo(() => {
    try {
      return new OpenAI({
        apiKey: key ?? "",
        organization: organization ?? "",
      })
    } catch (error) {
      return null
    }
  }, [])


  const calculateChatContentHeight = useCallback((height: number) => {
    setChatContentHeight(height / 2 - 100)
  }, [])
  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout
    calculateChatContentHeight(height)
  }

  const handleInitNewChat = (message: string) => {
    setMessages(() => [
      ...messages,
      {
        id: messages.length + 1,
        role: Sender.User,
        content: message,
      },
    ])
  }

  const handleCallGptApi = async (message: string): Promise<any> => {
    try {
      return await openAI?.image.create({
        prompt: message,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onSend = async (message: string) => {
    if (messages.length === 0) {
      // Create chat later, store to DB
    }
    setWorking(true)
    handleInitNewChat(message)

    const result = await handleCallGptApi(message)
    if (result.data && result.data.length > 0) {
      const imageUrl = result?.data[0].url
      setMessages((prev) => [...prev, { id: messages.length + 2, role: Sender.Bot, content: "", imageUrl, prompt: message }])
    }
    setWorking(false)
  }
  // const onSelectedIdea = (message: string) => {
  //   handleInitNewChat(message)
  //   handleCallGptApi(message)
  // }
  return (
    <Screen preset="fixed" keyboardOffset={70} contentContainerStyle={$container}>
      <View style={$chatContainer} onLayout={onLayout}>
        {messages.length <= 0 && (
          <View
            style={{
              marginTop: chatContentHeight,
            }}
          >
            <Avatar.Image size={50} style={$icon} source={logoDallE} />
            <Text style={$label}>Let me turn your imagination into imagery.</Text>
          </View>
        )}
        <ListView
          estimatedItemSize={100}
          renderItem={({ item }) => <Message style={{ marginBottom: 10 }} data={item} />}
          data={messages}
          contentContainerStyle={$chatContentContainer}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<>{working && <Message style={{ marginBottom: 10 }} data={{ role: Sender.Bot, content: '' }} loading={true} />}</>}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={$bottomContainer}
      >
        <MessageInput onShouldSend={onSend} />
      </KeyboardAvoidingView>
    </Screen>
  )
})

const $chatContainer: ViewStyle = {
  height: "90%",
  paddingBottom: spacing.lg,
  paddingHorizontal: spacing.lg,
  backgroundColor: colors.background,
}
const $chatContentContainer: ViewStyle = {
  paddingTop: spacing.lg,
  paddingBottom: spacing.lg,
}

const $container: ViewStyle = {
  flexDirection: "column",
  height: "100%",
}

const $bottomContainer: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  width: "100%",
  // borderTopWidth: StyleSheet.hairlineWidth,
}
const $icon: ViewStyle = {
  backgroundColor: "#000",
  alignSelf: "center",
  marginBottom: 16,
}

const $label: TextStyle = {
  color: colors.palette.grey,
  fontSize: 16,
}

