/* eslint-disable react-native/no-inline-styles */
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { KeyboardAvoidingView, Platform, View, ViewStyle } from 'react-native'
import { ChatStackScreenProps, navigate } from 'app/navigators'
import { ListView, Message, MessageIdeas, MessageInput, Screen } from 'app/components'
import { colors, spacing } from 'app/theme'
import { Sender, TMessageData } from 'app/utils/models'
import { Avatar } from 'react-native-paper'
import { useMMKVString } from 'react-native-mmkv'
import { StorageMMKV } from 'app/utils/storage'
import OpenAI from 'react-native-openai'
import { useSQLiteContext } from 'expo-sqlite/next'
import { addChats, addMessage, getMessages } from 'app/utils/database'
import { FlashList } from '@shopify/flash-list'
interface ChatScreenProps extends ChatStackScreenProps<'Chat'> { }
export type ChatListItemProp = {
  id: string
  title: string
  screen: string
}
const logoWhite = require('assets/images/gpt/logo-white.png')
export const ChatScreen: FC<ChatScreenProps> = observer(function ChatScreen(_props) {
  // const $bottomContainerInsets = useSafeAreaInsetsStyle(['bottom'] as ExtendedEdge[], 'margin')
  const db = useSQLiteContext()
  const chatIdParam = _props.route.params.chatId as string
  const [chatContentHeight, setChatContentHeight] = useState(0)
  const [key] = useMMKVString('apiKey', StorageMMKV)
  const [gptVersion] = useMMKVString('version', StorageMMKV)
  const [organization] = useMMKVString('org', StorageMMKV)
  const [chatId, setChatId] = useState<string | undefined>(chatIdParam)
  const chatIdRef = useRef('')
  const scrollViewRef = useRef<FlatList>(null)
  const [messages, setMessages] = useState<TMessageData[]>([])

  useEffect(() => {
    console.log(chatIdParam)
    if (chatIdParam) {
      handleLoadMessages(chatIdParam)
    }
  }, [chatIdParam])

  const handleLoadMessages = async (chatId: string) => {
    const messages = await getMessages(db, parseInt(chatId))
    setMessages(messages)
  }

  useEffect(() => {
    chatIdRef.current = chatId ?? ''
  }, [chatId])

  useEffect(() => {
    console.log(messages)
    if (!key || key === '' || !organization || organization === '') {
      navigate('Setting')
    }
  }, [key, organization])
  //connect to openAI
  const openAI = useMemo(() => {
    try {
      return new OpenAI({
        apiKey: key ?? '',
        organization: organization ?? '',
      })
    } catch (error) {
      return null
    }
  }, [])

  useEffect(() => {
    const handleMessage = (payload: any) => {
      setMessages((messages) => {
        const newMessage = payload.choices[0]?.delta.content
        console.log(newMessage)
        if (newMessage && messages.length > 0) {
          messages[messages.length - 1].content += newMessage
          return [...messages]
        }
        if (payload.choices[0]?.finishReason && messages.length > 0) {
          // save the last message
          addMessage(db, parseInt(chatIdRef.current), {
            content: messages[messages.length - 1].content,
            role: Sender.Bot,
          })
        }
        return messages
      })
    }
    if (!openAI) return
    openAI.chat.addListener('onChatMessageReceived', handleMessage)
    return () => {
      openAI.chat.removeListener('onChatMessageReceived')
    }
  }, [openAI])


  function handleScrollToEnd(width, height) {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({offset: height});
    }
  }

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
      {
        id: messages.length + 2,
        role: Sender.Bot,
        content: '',
      },
    ])
  }

  const handleCallGptApi = async (message: string) => {
    try {
      await openAI?.chat.stream({
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        model: gptVersion === '4' ? 'gpt-4' : 'gpt-3.5-turbo',
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onSend = async (message: string) => {
    if (messages.length === 0) {
      const result = await addChats(db, message)
      const chatId = result.lastInsertRowId
      setChatId(chatId.toString())
      addMessage(db, chatId, {
        content: message,
        role: Sender.User,
      })
    }
    handleInitNewChat(message)
    handleCallGptApi(message)
  }

  return (
    <Screen preset="fixed" keyboardOffset={70} contentContainerStyle={$container}>
      <View style={$chatContainer} onLayout={onLayout}>
        {messages.length <= 0 && (
          <View
            style={{
              marginTop: chatContentHeight,
            }}
          >
            <Avatar.Icon size={50} style={$icon} icon={logoWhite} />
          </View>
        )}
        <ListView
          ref={scrollViewRef}
          estimatedItemSize={100}
          renderItem={({ item }) => <Message style={{ marginBottom: 12 }} data={item} />}
          data={messages}
          contentContainerStyle={$chatContentContainer}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={handleScrollToEnd}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={$bottomContainer}
      >
        {messages.length <= 0 && <MessageIdeas onSelectedIdea={onSend} />}
        <MessageInput onShouldSend={onSend} />
      </KeyboardAvoidingView>
    </Screen>
  )
})

// const $drawer: ViewStyle = {
//   flex: 1,
//   paddingTop: 16,
// }
const $chatContainer: ViewStyle = {
  height: '90%',
  paddingBottom: spacing.lg,
  paddingHorizontal: spacing.lg,
  backgroundColor: colors.background,
}
const $chatContentContainer: ViewStyle = {
  paddingTop: spacing.lg,
  paddingBottom: spacing.lg,
}

const $container: ViewStyle = {
  flexDirection: 'column',
  height: '100%',
}

const $bottomContainer: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  // borderTopWidth: StyleSheet.hairlineWidth,
}
const $icon: ViewStyle = {
  backgroundColor: '#000',
  alignSelf: 'center',
}
// const $listContentContainer: ContentStyle = {
//   paddingHorizontal: spacing.lg,
// }
// const $menuContainer: ViewStyle = {
//   paddingBottom: spacing.xs,
//   paddingTop: spacing.lg,
// }
