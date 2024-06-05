import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import * as DropdownMenu from "zeego/dropdown-menu"
import { TGptVersion } from "app/navigators"
export interface HeaderDropdownProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  title: string
  items: Array<{
    key: TGptVersion
    title: string
    icon: string
  }>
  selected?: string
  onSelect: (key: TGptVersion) => void
}

/**
 * Describe your component here
 */
export const HeaderDropdown = observer(function HeaderDropdown(props: HeaderDropdownProps) {
  const { onSelect, items, title, selected } = props

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={$triggerContainer}>
          <Text style={$triggerTitle}>{title}</Text>
          {selected && <Text style={$triggerTitleSelected}>{selected}</Text>}
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: item.icon,
                pointSize: 18,
              }}
            />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
})

const $triggerContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $triggerTitle: TextStyle = {
  fontFamily: typography.fonts.spaceGrotesk.bold,
  fontSize: 16,
}

const $triggerTitleSelected: TextStyle = {
  ...$triggerTitle,
  marginLeft: 10,
  color: colors.palette.greyLight,
}
