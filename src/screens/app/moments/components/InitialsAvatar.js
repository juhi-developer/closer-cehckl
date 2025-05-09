/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useMemo} from 'react';
import {View, Text} from 'react-native';
import {scaleNew} from '../../../../utils/metrics2';
import {fonts} from '../../../../styles/fonts';
import {colors} from '../../../../styles/colors';

export const InitialsAvatar = ({name, viewStyle, type, textStyle}) => {
  const initials = useMemo(() => {
    return (name || '').charAt(0).toUpperCase();
  }, [name]);

  // Calculate fontSize based on container width
  const fontSize = useMemo(() => {
    const baseWidth = scaleNew(51);
    const baseFont = scaleNew(27);
    const containerWidth = viewStyle?.width || baseWidth;
    return (containerWidth / baseWidth) * baseFont;
  }, [viewStyle]);

  const backgroundColor = type === 'user' ? '#FF9D6E' : '#FFEBDB';
  const borderWidth = viewStyle?.borderWidth === 3 ? 3 : 0;

  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          width: scaleNew(51),
          height: scaleNew(51),
          borderRadius: scaleNew(120),
        },
        viewStyle,
        {backgroundColor, borderWidth},
      ]}>
      <Text
        style={[
          {
            fontFamily: fonts.semiBoldFont,
            fontSize: fontSize,
            color: type === 'user' ? colors.white : '#F2915A',
            includeFontPadding: false,
          },
          textStyle,
        ]}>
        {initials}
      </Text>
    </View>
  );
};
