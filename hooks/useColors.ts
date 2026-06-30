import { useColorScheme } from 'react-native';
import { Colors } from '@constants/colors';
import type { ThemeColors } from '@constants/colors';
import { useAppearanceStore } from '@stores/appearanceStore';

export type UseColorsResult = typeof Colors & ThemeColors;

export function useColors(): UseColorsResult {
  const systemScheme = useColorScheme();
  const { mode } = useAppearanceStore();
  const resolvedScheme = mode === 'system' ? systemScheme : mode;
  const theme = resolvedScheme === 'dark' ? Colors.dark : Colors.light;
  return { ...Colors, ...theme } as UseColorsResult;
}
