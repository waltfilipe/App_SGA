import { ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = ScrollViewProps & {
  maxWidth?: number;
};

export default function ScreenScroll({ children, contentContainerStyle, maxWidth = 720, ...rest }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      {...rest}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 24, maxWidth, alignSelf: 'center', width: '100%' },
        contentContainerStyle,
      ]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
