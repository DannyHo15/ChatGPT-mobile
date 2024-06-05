import React from "react"
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  AuthScreen, LoginScreen,
} from "app/screens"

import IonIcon from '@expo/vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native"
import { colors } from "app/theme"

export type AuthNavigatorParamList = {
  Auth: undefined,
  Login: { isLogin: boolean },
}
export type AuthStackScreenProps<T extends keyof AuthNavigatorParamList> = NativeStackScreenProps<
  AuthNavigatorParamList,
  T
>

const Stack = createNativeStackNavigator<AuthNavigatorParamList>()
export const AuthNavigator = () => {
  const navigate = useNavigation()
  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        options={{
          headerShown: false
        }}
        name="Auth"
        component={AuthScreen}
      />
      <Stack.Screen
        name="Login"
        options={{
          presentation: 'modal',
          title: '',
          headerLeft: (props) => {
            return <IonIcon color={colors.palette.neutral900} onPress={() => { navigate.goBack() }} size={28} name="close" />
          },
        }}
        component={LoginScreen} />
    </Stack.Navigator>
  )
}
