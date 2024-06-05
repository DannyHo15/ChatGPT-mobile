import * as React from 'react'
import { Alert, Keyboard, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { observer } from 'mobx-react-lite'
import { colors, typography } from 'app/theme'
import { Text } from 'app/components/Text'
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from '@react-navigation/drawer'
import { useSafeAreaInsetsStyle } from 'app/utils/useSafeAreaInsetsStyle'
import { Avatar, Searchbar } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { navigate } from 'app/navigators'
import { useEffect, useState } from 'react'
import { deleteChat, getChats, renameChat } from 'app/utils/database'
import { TChat } from 'app/utils/models'
import { useSQLiteContext } from 'expo-sqlite/next'
import * as ContextMenu from 'zeego/context-menu'
/**
 * Describe your component here
 */
const logoWhite = require("assets/images/gpt/logo-white.png")
export const DrawerContent = observer(function DrawerContent(props: any) {
  const db = useSQLiteContext()
  const $topSafeArea = useSafeAreaInsetsStyle(['top'], 'margin')
  const $bottomSafeArea = useSafeAreaInsetsStyle(['bottom'], 'margin')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [history, setHistory] = useState<TChat[]>([])
  const isDrawerOpen = useDrawerStatus() === 'open'
  const state = props['state']
  const { routes, index } = state
  const route = routes[index]
  useEffect(() => {
    if (isDrawerOpen) Keyboard.dismiss()
    loadChats()
    if (routes[index].name === 'Chat') {
      if (routes[index].params.chatId) {
      }
    }
  }, [isDrawerOpen])
  useEffect(() => {
    if(searchQuery){
      const filteredChats = history.filter((chat) => chat.title.includes(searchQuery))
      setHistory(filteredChats)
    } else {
      loadChats()
    }
  },[searchQuery])
  const loadChats = async () => {
    const chats = await getChats(db)
    setHistory(chats)
  }
  const onDeleteChat = (chatId: number) => {
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          // Delete the chat
          await deleteChat(db, chatId)
          navigate('Chat', { chatId: null })
          loadChats()
        },
      },
    ])
  }

  const onRenameChat = (chatId: number) => {
    Alert.prompt('Rename Chat', 'Enter a new name for the chat', async (newName) => {
      if (newName) {
        // Rename the chat
        await renameChat(db, chatId, newName)
        loadChats()
      }
    })
  }
  return (
    <View style={[$container, $topSafeArea]}>
      <View style={$searchbarOuter}>
        <Searchbar
          style={$searchbar}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          inputStyle={$inputStyle}
          rippleColor={colors.palette.selected}
        />
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={$contentContainer}>
        <DrawerItem
          label={'New Chat'}
          onPress={() => navigate('Chat', { chatId: null })}
          focused={route.name === 'Chat' && !route.params.chatId}
          inactiveTintColor="#000"
          labelStyle={{ marginLeft: -16 }}
          activeTintColor={colors.palette.primary}
          activeBackgroundColor={colors.palette.selected}
          icon={({ focused, color, size }) => (
            <Avatar.Icon size={28} style={$icon} icon={logoWhite} />
          )}
          style={{ borderRadius: 14, marginBottom: -4 }}
        />
        <DrawerItemList {...props} />
        {history.map((chat) => {
          return (
            <ContextMenu.Root key={chat.id}>
              <ContextMenu.Trigger>
                <DrawerItem
                  label={chat.title}
                  focused={route.name === 'Chat' && route.params.chatId === chat.id}
                  onPress={() => navigate('Chat', { chatId: chat.id })}
                  inactiveTintColor="#000"
                  activeTintColor={colors.palette.primary}
                  activeBackgroundColor={colors.palette.selected}
                  style={{ borderRadius: 14 }}
                />
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                <ContextMenu.Preview>
                  {() => (
                    <View style={{ padding: 16, backgroundColor: '#fff' }}>
                      <Text>{chat.title}</Text>
                    </View>
                  )}
                </ContextMenu.Preview>

                <ContextMenu.Item key={'rename'} onSelect={() => onRenameChat(chat.id)}>
                  <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
                  <ContextMenu.ItemIcon
                    ios={{
                      name: 'pencil',
                      pointSize: 18,
                    }}
                  />
                </ContextMenu.Item>
                <ContextMenu.Item key={'delete'} onSelect={() => onDeleteChat(chat.id)} destructive>
                  <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
                  <ContextMenu.ItemIcon
                    ios={{
                      name: 'trash',
                      pointSize: 18,
                    }}
                  />
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Root>
          )
        })}
      </DrawerContentScrollView>
      <TouchableOpacity
        onPress={() => {
          navigate('Setting')
        }}
      >
        <View style={[$bottomContentContainer, $bottomSafeArea]}>
          <Avatar.Image size={40} source={{ uri: 'https://galaxies.dev/img/meerkat_2.jpg' }} />
          <Text style={$username}>Galaxies.dev</Text>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.palette.greyLight} />
        </View>
      </TouchableOpacity>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
}

const $searchbarOuter: ViewStyle = {
  padding: 10,
}
const $contentContainer: ViewStyle = {
  paddingTop: 0,
}
const $inputStyle: ViewStyle = {
  minHeight: 40,
}

const $searchbar: ViewStyle = {
  backgroundColor: colors.palette.selected,
  height: 40,
}

const $username: TextStyle = {
  color: colors.text,
  flex: 1,
  fontFamily: typography.fonts.spaceGrotesk.semiBold,
  fontSize: 16,
}

const $bottomContentContainer: ViewStyle = {
  padding: 10,
  flexDirection: 'row',
  gap: 16,
  alignItems: 'center',
}
const $icon: ViewStyle = {
  backgroundColor: "#000",
}

