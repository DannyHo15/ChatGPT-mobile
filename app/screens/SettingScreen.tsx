import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, TextInput, TextStyle, TouchableOpacity, ViewStyle, View } from "react-native"
import { AppStackScreenProps, goBack } from "app/navigators"
import { Text } from "app/components"
import { useMMKVString } from "react-native-mmkv"
import { StorageMMKV } from "app/utils/storage"
import { colors } from "app/theme"
import { $btn } from "app/theme/style"
import { useStores } from "app/models"

interface SettingScreenProps extends AppStackScreenProps<"Setting"> { }

export const SettingScreen: FC<SettingScreenProps> = observer(function SettingScreen() {
  const {
    authenticationStore: { logout },
  } = useStores()

  const [key, setKey] = useMMKVString("apiKey", StorageMMKV)
  const [_, setOrganization] = useMMKVString('org', StorageMMKV);
  const [apiKey, setApiKey] = useState("")
  const [org, setOrg] = useState("")
  const saveApiKey = async () => {
    setKey(apiKey)
    setOrganization(org)
    goBack()
  }

  const handleLogout = () => {
    logout()
  }


  const removeApiKey = async () => {
    setKey("")
    setOrganization("")
  }
  return (
    <View style={$root}>
      {key && key !== "" && (
        <View>
          <Text style={$label}>You are all set!</Text>
          <TouchableOpacity
            style={[$btn, { backgroundColor: colors.palette.primary }]}
            onPress={removeApiKey}
          >
            <Text style={$buttonText}>Remove API Key</Text>
          </TouchableOpacity>
        </View>
      )}

      {(!key || key === "") && (
        <View>
          <Text style={$label}>API Key & Organization:</Text>
          <TextInput
            style={$input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your API key"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            style={$input}
            value={org}
            onChangeText={setOrg}
            placeholder="Your organization"
            autoCorrect={false}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[$btn, { backgroundColor: colors.palette.primary }]}
            onPress={saveApiKey}
          >
            <Text style={$buttonText}>Save API Key</Text>
          </TouchableOpacity>
        </View>
      )}
      <Button title="Sign Out" onPress={handleLogout} color={colors.palette.grey} />
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
  paddingHorizontal: 20,
  paddingVertical: 20,
  backgroundColor: colors.palette.neutral100,
}
const $label: TextStyle = {
  fontSize: 18,
  marginBottom: 10,
}
const $input: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.palette.primary,
  borderRadius: 5,
  paddingHorizontal: 10,
  paddingVertical: 10,
  marginBottom: 20,
  backgroundColor: "#fff",
}

const $buttonText: TextStyle = {
  color: "#fff",
  textAlign: "center",
  fontSize: 16,
}
