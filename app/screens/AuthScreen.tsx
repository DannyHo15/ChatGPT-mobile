import { observer } from "mobx-react-lite"
import React, { FC, useMemo } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { BottomSheetContainer, Button, Screen } from "../components"
import { AuthStackScreenProps, navigate } from "../navigators"
import { colors, typography } from "../theme"
import AnimatedIntro from "app/components/AnimatedIntro"
import AntIcon from '@expo/vector-icons/AntDesign'
interface AuthScreenProps extends AuthStackScreenProps<"Auth"> { }

export const AuthScreen: FC<AuthScreenProps> = observer(function AuthScreen(_props) {
  const snapPoints = useMemo(() => ['50%', '100%'], []);

  const goToLogin = () => {
    navigate("Login", {
      isLogin: true
    })
  }
  const goToRegister = () => {
    navigate("Login", {
      isLogin: false
    })
  }

  function login() {

  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
    >
      <AnimatedIntro />
      <BottomSheetContainer
        snapPoints={snapPoints}
        style={{ height: "40%" }}
      >
        <Button
          testID="login-button"
          tx="loginScreen.appleButton"
          textStyle={[{ color: colors.palette.neutral900 }, $textStyle]}
          style={[$tapBtnLight, $tapButton]}
          preset="default"
          LeftAccessory={() => <AntIcon name="apple1" color={colors.palette.neutral900} size={18} />}
          onPress={login}
        />
        <Button
          testID="login-button"
          tx="loginScreen.googleButton"
          textStyle={[{ color: colors.palette.light }, $textStyle]}
          style={[$tapBtnDark, $tapButton]}
          LeftAccessory={() => <AntIcon name="google" color={colors.palette.light} size={18} />}
          preset="default"
          onPress={login}
          pressedStyle={$pressedDark}
        />
        <Button
          testID="login-button"
          tx="loginScreen.emailButton"
          textStyle={[{ color: colors.palette.light }, $textStyle]}
          style={[$tapBtnDark, $tapButton]}
          LeftAccessory={() => <AntIcon name="mail" color={colors.palette.light} size={18} />}
          preset="default"
          pressedStyle={$pressedDark}
          onPress={goToRegister}
        />
        <Button
          testID="login-button"
          tx="loginScreen.signIn"
          textStyle={[{ color: colors.palette.light }, $textStyle]}
          style={[$tapBtnDark, $tapButton]}
          preset="default"
          pressedStyle={$pressedDark}
          onPress={goToLogin}
        />
      </BottomSheetContainer>

    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  backgroundColor: colors.transparent,
  height: "100%",
  justifyContent: "center",
}

const $tapButton: ViewStyle = {
  borderRadius: 14,
}

const $textStyle: TextStyle = {
  fontFamily: typography.primary.bold,
  fontSize: 18,
  lineHeight: 27,
  marginLeft: 10,
  textAlign: 'center'
}

const $tapBtnLight: ViewStyle = {
  backgroundColor: colors.palette.light,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}
const $tapBtnDark: ViewStyle = {
  backgroundColor: colors.palette.dark,
}

const $pressedDark: ViewStyle = {
  backgroundColor: colors.palette.dark,
  opacity: 0.6,
}
