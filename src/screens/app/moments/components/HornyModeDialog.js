// /* eslint-disable react-native/no-inline-styles */
// import React, {useState, useEffect} from 'react';
// import {View, Text, Animated, Dimensions} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {scaleNew} from '../../../../utils/metrics2';
// import {VARIABLES} from '../../../../utils/variables';
// import {fonts} from '../../../../styles/fonts';
// import {colors} from '../../../../styles/colors';

// const SCREEN_WIDTH = Dimensions.get('window').width;

// const HornyModeDialog = ({hornyModeDialog, setHornyModeDialog}) => {
//   const slideAnim = new Animated.Value(0); // Initial position of the dialog (0 is off-screen)

//   console.log('horny mode dialog', slideAnim);
//   useEffect(() => {
//     setTimeout(() => {
//       alert('horny mode dialog');
//       slideIn();
//     }, 500);
//     setTimeout(() => {
//       slideOut();
//     }, 2500);
//   }, []);

//   const slideIn = () => {
//     Animated.timing(slideAnim, {
//       toValue: 1, // Final position of the dialog (1 means on-screen)
//       duration: 500,
//       useNativeDriver: true,
//     }).start();
//   };

//   const slideOut = () => {
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start(() => {
//       //   setHornyModeDialog(false); // Hide the dialog after the animation
//     });
//   };

//   // Interpolates the slideAnim value to translateY values
//   const translateY = slideAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [200, 0], // Change 200 to the appropriate value to move off-screen
//   });

//   return (
//     <Animated.View
//       style={{
//         transform: [{translateY}],
//         position: 'absolute',
//         width: SCREEN_WIDTH - scaleNew(14),
//         bottom: 0,
//         alignSelf: 'center',
//         zIndex: 0,
//         borderWidth: 1,
//         borderColor: '#E6E6E6',
//         borderTopLeftRadius: scaleNew(18),
//         borderTopRightRadius: scaleNew(18),
//         overflow: 'hidden',
//       }}>
//       <LinearGradient
//         colors={['#9F9193', '#524060']}
//         locations={[0, 0.9]}
//         useAngle={true}
//         angle={130}
//         style={{
//           width: '100%',
//           height: scaleNew(88),
//           paddingHorizontal: scaleNew(18),
//           borderTopLeftRadius: scaleNew(18),
//           borderTopRightRadius: scaleNew(18),
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}>
//         <Text
//           numberOfLines={2}
//           style={{
//             fontFamily: fonts.regularFont,
//             fontSize: scaleNew(14),
//             color: colors.white,
//             flex: 1,
//             marginEnd: scaleNew(74),
//           }}>
//           {VARIABLES.user?.partnerData?.partner?.name} has been notified that
//           you are in mood! 😈
//         </Text>
//       </LinearGradient>
//     </Animated.View>
//   );
// };

// export default HornyModeDialog;

import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Animated, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {scaleNew} from '../../../../utils/metrics2';
import {VARIABLES} from '../../../../utils/variables';
import {fonts} from '../../../../styles/fonts';
import {colors} from '../../../../styles/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const HornyModeDialog = ({hornyModeDialog, setHornyModeDialog}) => {
  const slideAnim = useRef(new Animated.Value(0)).current; // Using useRef to persist the value across re-renders
  const opacityAnim = useRef(new Animated.Value(0)).current; // Opacity animation

  useEffect(() => {
    if (hornyModeDialog) {
      setTimeout(() => {
        slideIn();
      }, 10);
      setTimeout(() => {
        slideOut();
      }, 2500);
    }
  }, [hornyModeDialog]);

  const slideIn = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const slideOut = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setHornyModeDialog(false);
    });
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{translateY}],
        position: 'absolute',
        width: SCREEN_WIDTH - scaleNew(14),
        bottom: 0,
        alignSelf: 'center',
        zIndex: 10, // Ensure it's above other components
        borderWidth: 1,
        borderColor: '#E6E6E6',
        borderTopLeftRadius: scaleNew(18),
        borderTopRightRadius: scaleNew(18),
        overflow: 'hidden',
      }}>
      <LinearGradient
        colors={['#9F9193', '#524060']}
        locations={[0, 0.9]}
        useAngle={true}
        angle={130}
        style={{
          width: '100%',
          height: scaleNew(88),
          paddingHorizontal: scaleNew(18),
          borderTopLeftRadius: scaleNew(18),
          borderTopRightRadius: scaleNew(18),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scaleNew(14),
            color: colors.white,
            flex: 1,
            marginEnd: scaleNew(74),
          }}>
          {VARIABLES.user?.partnerData?.partner?.name} has been notified that
          you are in the mood! 😈
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default HornyModeDialog;
