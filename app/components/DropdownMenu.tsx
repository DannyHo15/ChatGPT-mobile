import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import * as DropdownMenu from "zeego/dropdown-menu"
import { Ionicons } from "@expo/vector-icons"
export interface DropdownMenuProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  items: Array<{
    key: string;
    title: string;
    icon: string;
  }>;
  onSelect: (key: string) => void;
}

/**
 * Describe your component here
 */
export const DropdownMenuComponent = observer(function DropdownMenuComponent(props: DropdownMenuProps) {
  const { } = props

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Ionicons name="ellipsis-vertical" size={24} color={colors.palette.light} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {props.items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => props.onSelect(item.key)}>
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

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
