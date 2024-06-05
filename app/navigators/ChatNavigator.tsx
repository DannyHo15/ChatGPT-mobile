import React, { useEffect } from "react"
import { ChatScreen, DalleScreen, ExploreScreen } from "app/screens"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "app/theme"
import { useWindowDimensions, ViewStyle } from "react-native"
import { Avatar } from "react-native-paper"
import { DrawerContent as DrawerCustomContent, HeaderDropdown } from "app/components"
import { useMMKVString } from "react-native-mmkv"
import { StorageMMKV } from "app/utils/storage"
import { StackActions, useNavigation } from "@react-navigation/native"
import { navigate } from "./navigationUtilities"
export type ChatNavigatorParamList = {
  Chat: { chatId: string | null }
  Explore: undefined
  Dalle: undefined
}
export type ChatStackScreenProps<T extends keyof ChatNavigatorParamList> = NativeStackScreenProps<
  ChatNavigatorParamList,
  T
>

const logoWhite = require("assets/images/gpt/logo-white.png")
const logoDallE = require("assets/images/gpt/dalle.png")
export type TGptVersion = "3.5" | "4"
const Drawer = createDrawerNavigator<ChatNavigatorParamList>()
export const ChatNavigator = () => {
  const [gptVersion, setGptVersion] = useMMKVString("version", StorageMMKV)
  const demensions = useWindowDimensions()
  const navigation = useNavigation()




  const pushAction = StackActions.push('ChatScreen');
  const onGptVersionChange = (version: TGptVersion) => setGptVersion(version)
  const [key] = useMMKVString('apiKey', StorageMMKV)
  const [organization] = useMMKVString('org', StorageMMKV)
  useEffect(() => {
    console.log('key', key)
    if (!key || key === '' || !organization || organization === '') {
      navigate('Setting')
    }
  }, [key, organization])
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerCustomContent {...props} />}
      screenOptions={{
        unmountOnBlur: true,
        drawerActiveTintColor: colors.palette.primary,
        drawerActiveBackgroundColor: colors.palette.selected,
        headerTintColor: "#000",
        drawerInactiveTintColor: colors.palette.grey,
        overlayColor: "rgba(0,0,0,0.2)",
        drawerItemStyle: {
          borderRadius: 14,
        },
        drawerLabelStyle: {
          marginLeft: -16,
        },
        drawerStyle: { width: demensions.width * 0.86 },
      }}
      initialRouteName="Chat"
    >
      <Drawer.Screen
        initialParams={{ chatId: null }}
        getId={({ params }) => params.chatId ?? "Chat"}
        options={{
          drawerItemStyle: { width: 0, height: 0 },
          headerTitle: () => (
            <HeaderDropdown
              title="ChatGPT"
              items={[
                { key: "3.5", title: "GPT-3.5", icon: "bolt" },
                { key: "4", title: "GPT-4", icon: "sparkles" },
              ]}
              onSelect={onGptVersionChange}
              selected={gptVersion}
            />
          ),
          title: "New Chat",
          drawerIcon: () => <Avatar.Icon size={28} style={$icon} icon={logoWhite} />,
          headerRight: () => (
            <Ionicons style={{ paddingRight: 10 }} name="add" backgroundColor={colors.transparent} onPress={() => {
              navigation.dispatch(pushAction);
            }} size={28} color={'#000'} />
          ),
        }}
        name="Chat"
        component={ChatScreen}
      />
      <Drawer.Screen
        options={{
          title: "Explore",
          drawerIcon: () => <Ionicons name="apps-outline" size={24} color="black" />,
        }}
        name="Explore"
        component={ExploreScreen}
      />
      <Drawer.Screen
        options={{
          title: "DALL·E",
          drawerIcon: () => <Avatar.Image size={24} style={$icon} source={logoDallE} />,
        }}
        name="Dalle"
        component={DalleScreen}
      />
    </Drawer.Navigator>
  )
}

const $icon: ViewStyle = {
  backgroundColor: "#000",
}
