/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {fonts} from '../../../styles/fonts';
import {colors} from '../../../styles/colors';
import AppView from '../../../components/AppView';
import CenteredHeader from '../../../components/centeredHeader';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import {scale} from '../../../utils/metrics';
import {APP_IMAGE} from '../../../utils/constants';
import AutoBackupModal from '../../../components/Modals/AutoBackupModal';
import AutoBackupError from '../../../components/Modals/AutoBackupError';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalStyles} from '../../../styles/globalStyles';
import {updateContextualTooltipState} from '../../../utils/contextualTooltips';

const width = 50;

export default function AutoBackup(props) {
  const {navigation, route} = props;
  const backupFrequency = route.params.backupFrequency;
  const [selectedFrequency, setSelectedFrequency] = useState(backupFrequency);

  const [viewType, setViewType] = useState(1);
  const [backupModal, setBackupModal] = useState(false);
  const [backupModalError, setBackupModalError] = useState(false);

  // useEffect(() => {
  //   if (viewType === 2) {
  //     setTimeout(() => {
  //       setViewType(3);
  //     }, 3000);
  //   }
  // }, [viewType]);

  const AppHeader = () => {
    return (
      <CenteredHeader
        leftIcon={<ArrowLeftIconSvg />}
        leftPress={() => {
          if (selectedFrequency === 'never') {
            setBackupModalError(true);
          } else {
            navigation.goBack();
          }
        }}
        title={'Set Auto backup'}
        // rightIcon={<View style={styles.icon} />}
        // rightPress={() => props.navigation.navigate('notification')}
        titleStyle={styles.headerTitleStyle}
      />
    );
  };

  return (
    <AppView
      customContainerStyle={styles.container}
      scrollContainerRequired={true}
      header={AppHeader}
      isScrollEnabled={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.backgroundColor,
          //  padding: scale(20),
        }}>
        {/* <Text
          style={{
            fontSize: 24,
            fontFamily: fonts.semiBoldFont,
            color: colors.text,
            marginStart: scale(20),
          }}>
          Set Auto backup
        </Text> */}

        <View
          style={{
            padding: scale(16),
          }}>
          <Text
            style={{
              fontSize: scale(16),
              fontFamily: fonts.regularFont,
              color: '#0D141C',
            }}>
            Allows a periodic backup of your chats & memories data, and enables
            a seamless restore process whenever needed
          </Text>

          <Pressable
            onPress={() => setBackupModal(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: scale(60),
              backgroundColor: colors.white,
              borderRadius: scale(10),
              paddingHorizontal: scale(16),
              marginTop: scale(20),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image source={require('../../../assets/images/cloud-add.png')} />
              <Text
                style={{
                  fontFamily: fonts.standardFont,
                  fontSize: scale(16),
                  color: '#444444',
                  marginStart: scale(6),
                  includeFontPadding: false,
                }}>
                Select frequency
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: fonts.regularFont,
                  fontSize: scale(14),
                  color: '#424B5D',
                  marginEnd: scale(4),

                  includeFontPadding: false,
                }}>
                {selectedFrequency.charAt(0).toUpperCase() +
                  selectedFrequency.slice(1)}
              </Text>
              <Image
                source={APP_IMAGE.rightArrow}
                style={{
                  width: scale(20),
                  height: scale(20),
                  resizeMode: 'contain',
                }}
              />
            </View>
          </Pressable>

          <Text
            style={{
              fontSize: scale(14),
              fontFamily: fonts.italicFont,
              color: '#0D141C',
              marginTop: scale(26),
            }}>
            You can also manually back up or change this setting from profile
          </Text>
          {backupFrequency !== selectedFrequency && (
            <Pressable
              onPress={async () => {
                console.log('seelcted freqqqq', selectedFrequency);

                await AsyncStorage.setItem(
                  'backupFrequency',
                  selectedFrequency,
                );
                props.navigation.popToTop();
              }}
              style={{
                // flex: 1,
                height: scale(50),
                borderWidth: 1,
                borderColor: colors.blue1,
                backgroundColor: colors.blue1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: scale(10),
                marginTop: scale(50),
                alignSelf: 'center',
                width: scale(234),
              }}>
              <Text
                style={{
                  fontFamily: fonts.standardFont,
                  fontSize: scale(18),
                  color: colors.white,
                }}>
                Done
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      <AutoBackupModal
        setBackupFrequency={setSelectedFrequency}
        backupFrequency={selectedFrequency}
        modalVisible={backupModal}
        setModalVisible={setBackupModal}
      />
      <AutoBackupError
        modalVisible={backupModalError}
        setModalVisible={setBackupModalError}
        onSubmit={() => {
          navigation.goBack();
        }}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    // flex: 1
  },
  headerTitleStyle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(24),
    color: '#444444',
    fontWeight: 600,
    // color: colors.blue1
  },
});
