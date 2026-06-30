import { View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@hooks/useColors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padTop?: boolean;
  padBottom?: boolean;
  padHorizontal?: boolean;
}

export function ScreenWrapper({
  children,
  style,
  padTop = true,
  padBottom = true,
  padHorizontal = false,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: padTop ? insets.top : 0,
          paddingBottom: padBottom ? insets.bottom : 0,
          paddingHorizontal: padHorizontal ? 20 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
