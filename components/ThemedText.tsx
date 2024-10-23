import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let textStyle: any = {};
  switch (type) {
    case 'title':
      textStyle = styles.title;
      break;
    case 'subtitle':
      textStyle = styles.subtitle;
      break;
    case 'defaultSemiBold':
      textStyle = styles.defaultSemiBold;
      break;
    case 'link':
      textStyle = styles.link;
      break;
    default:
      textStyle = styles.default;
  }

  return (
    <Text
      style={[
        { color },
        textStyle,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text, // Ensures default text color
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: Colors.light.text,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 32,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  link: {
    fontSize: 16,
    color: Colors.light.link,
    textDecorationLine: 'underline',
  },
});
