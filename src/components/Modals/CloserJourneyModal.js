/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import {scaleNew} from '../../utils/metrics2';
import {APP_IMAGE} from '../../utils/constants';
import {colors} from '../../styles/colors';
import {getColorCodeWithOpactiyNumber} from '../../utils/helpers';
import {fonts} from '../../styles/fonts';
import {useAppContext} from '../../utils/VariablesContext';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {ToastMessage} from '../toastMessage';

const CloserJourneyModal = ({visible, setVisible, closerJourney = {}}) => {
  const count = Object.values(closerJourney)?.filter(val => val).length;
  const {hornyMode} = useAppContext();

  const onDismiss = () => {
    setVisible(false);
  };
  return (
    <Modal
      useNativeDriverForBackdrop
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={750}
      animationOutTiming={500}
      isVisible={visible}
      onBackButtonPress={() => {
        onDismiss();
      }}
      onBackdropPress={() => {
        onDismiss();
      }}
      style={{
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        margin: 0,
      }}>
      <LinearGradient
        style={{
          justifyContent: 'flex-end',
          borderTopLeftRadius: scaleNew(27),
          borderTopRightRadius: scaleNew(27),
        }}
        colors={['#FFFFFFF7', '#F7FAFC']}
        locations={[0, 0.9]}
        useAngle={true}
        angle={130}>
        <View
          style={{
            backgroundColor: hornyMode ? '#331A4F' : colors.white,
            borderTopLeftRadius: scaleNew(27),
            borderTopRightRadius: scaleNew(27),
            paddingHorizontal: scaleNew(20),
            paddingVertical: scaleNew(15),
            paddingBottom: scaleNew(32),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <CircularProgressBase
              value={(count / 5) * 100}
              radius={scaleNew(17)}
              activeStrokeColor={hornyMode ? '#ffffff' : '#124698'}
              activeStrokeSecondaryColor={hornyMode ? '#ffffff' : '#124698'}
              duration={1000}
              activeStrokeWidth={scaleNew(6)}
              inActiveStrokeWidth={scaleNew(6)}
              inActiveStrokeColor="#B3B5BA3B"
            />
            <Pressable
              style={{
                marginEnd: -scaleNew(6),
              }}
              onPress={() => setVisible(false)}>
              <Image
                style={{
                  width: scaleNew(27),
                  height: scaleNew(27),
                  tintColor: hornyMode ? '#ffffff' : '#595959',
                }}
                source={APP_IMAGE.close_light}
              />
            </Pressable>
          </View>
          <Text
            style={{
              fontFamily: fonts.semiBoldFont,
              fontSize: scaleNew(18),
              color: hornyMode ? '#ffffff' : '#595959',
              marginTop: scaleNew(8),
            }}>
            Begin your Closer journey
          </Text>
          <Text
            style={{
              fontFamily: fonts.standardFont,
              fontSize: scaleNew(15),
              color: hornyMode ? '#ffffffaa' : '#B4B5BD',
              marginBottom: scaleNew(15),
              marginTop: Platform.OS === 'ios' ? scaleNew(8) : scaleNew(2),
            }}>
            {count}/5 Completed
          </Text>
          <JourneyRow
            image={APP_IMAGE.journeypoke}
            isCompleted={closerJourney?.poke}
            text={'Poked your partner'}
          />
          <JourneyRow
            image={APP_IMAGE.journeysticky}
            isCompleted={closerJourney?.sticky}
            text={'First sticky '}
          />
          <JourneyRow
            image={APP_IMAGE.journeywellBeing}
            isCompleted={closerJourney?.wellbeing}
            text={'Wellbeing'}
          />
          <JourneyRow
            image={APP_IMAGE.journeystory}
            isCompleted={closerJourney?.story}
            text={'Uploaded first story'}
          />
          <JourneyRow
            image={APP_IMAGE.journeyMemory}
            isCompleted={closerJourney?.feed}
            text={'First memory in the feed'}
          />
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default CloserJourneyModal;

const JourneyRow = ({image, text, isCompleted}) => {
  const {hornyMode} = useAppContext();
  let bgColor, iconColor, textColor;
  if (isCompleted) {
    if (hornyMode) {
      bgColor = 'rgb(86, 48, 138)';
      iconColor = 'rgb(243,245,247)';
      textColor = '#ffffff';
    } else {
      bgColor = 'rgb(243,245,247)';
      iconColor = '#ECEFF2';
      textColor = '#124698';
    }
  } else {
    if (hornyMode) {
      bgColor = '#331A4F';
      iconColor = 'rgb(86, 48, 138)';
      textColor = '#ffffff';
    } else {
      bgColor = colors.white;
      iconColor = '#F8F9FA';
      textColor = '#808491';
    }
  }
  return (
    <Pressable
      onPress={() => {
        ToastMessage('Feature use auto-checks the list');
      }}
      style={{
        flexDirection: 'row',
        marginBottom: scaleNew(12),
        //   paddingVertical: scaleNew(14),
        paddingHorizontal: scaleNew(12),
        height: scaleNew(58),
        alignItems: 'center',
        backgroundColor: bgColor,
        // shadowColor: '#00000045',
        // shadowOffset: {
        //   width: 0,
        //   height: 0,
        // },
        // shadowOpacity: Platform.OS === 'ios' ? 0.4 : 1,
        // shadowRadius: 3.84,

        // elevation: 3,
        borderRadius: 12,
      }}>
      <View
        style={{
          backgroundColor: iconColor,
          borderRadius: 100,
        }}>
        <Image
          source={image}
          style={{
            width: scaleNew(32),
            height: scaleNew(32),
            resizeMode: 'contain',
          }}
        />
      </View>
      <Text
        style={{
          flex: 1,
          fontFamily: fonts.standardFont,
          fontSize: scaleNew(14),
          color: textColor,
          marginLeft: scaleNew(10),
        }}>
        {text}
      </Text>
      <Image
        style={{
          width: scaleNew(21),
          height: scaleNew(21),
        }}
        source={isCompleted ? APP_IMAGE.journeyCheck : APP_IMAGE.journeyUncheck}
      />
    </Pressable>
  );
};
