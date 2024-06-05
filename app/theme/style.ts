import { ViewStyle, StyleSheet } from "react-native";
import { colors } from "./colors";

export const $btn: ViewStyle = {
  height: 50,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  paddingHorizontal: 10,
};

export const loadingOverlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
}


export const $pageContainer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.transparent,
};
