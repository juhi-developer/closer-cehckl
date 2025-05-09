import {StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppView from '../../../components/AppView';
import DarkCrossIconSvg from '../../../assets/svgs/darkCrossIconSvg';
import CenteredHeader from '../../../components/centeredHeader';
import PersonaliseSvg from '../../../assets/svgs/personaliseSvg';
import {globalStyles} from '../../../styles/globalStyles';
import {colors} from '../../../styles/colors';
import ArrowRightIconSvg from '../../../assets/svgs/arrowRightIconSvg';
import {APP_STRING} from '../../../utils/constants';
import {scale} from '../../../utils/metrics';
import {useFocusEffect} from '@react-navigation/native';

export default function PersonaliseOnboard(props) {
  const {media, navType} = props?.route?.params;

  const [timeoutId, setTimeoutId] = useState(null);

  console.log('media-->', media);
  const AppHeader = () => {
    return (
      <CenteredHeader
        rightIcon={<DarkCrossIconSvg />}
        rightPress={() => {
          props.navigation.goBack();
        }}
      />
    );
  };

  // useEffect(() => {
  //     // setTimeout(() => {
  //     //     if(navType==='home'){
  //     //         // props.navigation.replace('App')
  //     //         props.navigation.goBack()
  //     //     }
  //     // }, 3000);

  //     const id = setTimeout(() => {
  //         if(navType==='home'){
  //             props.navigation.goBack()
  //         }
  //     }, 3000);

  //     setTimeoutId(id);

  //     // Clear the timeout when the component unmounts
  //     return () => {
  //         if (timeoutId) {
  //             clearTimeout(timeoutId);
  //         }
  //     };

  // }, [])

  useFocusEffect(
    React.useCallback(() => {
      const timeoutId = setTimeout(() => {
        if (navType === 'home') {
          props.navigation.goBack();
        }
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }, []),
  );

  return (
    <AppView
      scrollContainerRequired={false}
      isScrollEnabled={false}
      isLoading={false}
      header={AppHeader}>
      <View style={{flex: 1}}>
        <View style={styles.personaliseContainer}>
          <PersonaliseSvg />
        </View>
        <Text style={styles.personaliseTitle}>
          {APP_STRING.personaliseLabelOne}
        </Text>
        <Text style={styles.message}>{APP_STRING.personaliseLabelTwo}</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() =>
          props.navigation.navigate('personalise', {
            prevNavigatingScreen: 'personaliseOnboard',
            media: media,
          })
        }>
        <Text
          style={{
            ...globalStyles.regularLargeText,
            color: colors.blue1,
            fontSize: scale(18),
          }}>
          {'Lets begin!'}
        </Text>
        <ArrowRightIconSvg />
      </Pressable>
    </AppView>
  );
}

const styles = StyleSheet.create({
  message: {
    ...globalStyles.regularMediumText,
    textAlign: 'center',
    marginHorizontal: scale(30),
    marginTop: scale(4),
    lineHeight: 24,
    // marginBottom: 40
  },
  personaliseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(20),
  },
  personaliseTitle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(24),
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: scale(30),
    marginHorizontal: scale(16),
  },
});
