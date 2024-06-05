import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { ScrollView } from "react-native-gesture-handler"
import { TouchableOpacity } from "@gorhom/bottom-sheet"

export interface MessageIdeasProps {
  /**
   * An optional style override useful for padding & margin.
   */
  onSelectedIdea: (message: string) => void
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
const PredefinedMessages = [
  { title: "Explain React Native", text: "like I'm five years old" },
  { title: "Suggest fun activites", text: "for a family visting San Francisco" },
  { title: "Recommend a dish", text: "to impress a date who's a picky eater" },
]
export const MessageIdeas = observer(function MessageIdeas(props: MessageIdeasProps) {
  const { style } = props
  const $styles = [$container, style]

  return (
    <View style={$styles}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={$cardIdeaContent}>
        {PredefinedMessages.map((message, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => props.onSelectedIdea(`${message.title} ${message.text}`)}
            style={$cardIdea}
          >
            <Text style={$textTitle}>{message.title}</Text>
            <Text style={$text}>{message.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.fonts.spaceGrotesk.normal,
  fontSize: 14,
  color: colors.palette.grey,
}
const $textTitle: TextStyle = {
  fontFamily: typography.primary.bold,
}
const $cardIdea: ViewStyle = {
  backgroundColor: colors.palette.input,
  padding: 16,
  borderRadius: 16,
}
const $cardIdeaContent: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 8,
  gap: 16,
}
