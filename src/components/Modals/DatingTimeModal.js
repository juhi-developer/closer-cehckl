/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  Keyboard,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import {scaleNew} from '../../utils/metrics2';
import {APP_IMAGE} from '../../utils/constants';
import {colors} from '../../styles/colors';
import {
  getColorCodeWithOpactiyNumber,
  getStateDataAsync,
} from '../../utils/helpers';
import {fonts} from '../../styles/fonts';
import {useAppContext} from '../../utils/VariablesContext';
import {scale} from '../../utils/metrics';
import moment from 'moment';
import AppButton from '../appButton';
import Modal from 'react-native-modal';

const DatingTimeModal = ({visible, setVisible, onSubmitDate}) => {
  const inputRef = useRef(null);
  const {hornyMode} = useAppContext();
  const [date, setDate] = useState('');
  const [weeksFromNow, setWeeksFromNow] = useState(null);

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    });

    return () => {
      keyboardHideListener.remove();
    };
  }, []);

  const handleDateChange = text => {
    // Remove all non-digits and extra dashes
    let newText = text.replace(/[^\d-]/g, '');

    // Split the text by dashes and remove empty parts
    let parts = newText.split('-').filter(part => part !== '');

    // Reconstruct the text with proper dashes
    newText = parts.join('-');
    if (parts.length === 1 && parts[0].length > 2) {
      newText = parts[0].slice(0, 2) + '-' + parts[0].slice(2);
    } else if (parts.length === 2 && parts[1].length > 2) {
      newText = parts[0] + '-' + parts[1].slice(0, 2) + '-' + parts[1].slice(2);
    }

    // Limit the length to 10 characters (DD-MM-YYYY)
    newText = newText.slice(0, 10);

    // Update state

    if (newText.length === 10) {
      onBlurFunction(newText);
    }
    setDate(newText);
  };

  const onBlurFunction = async newText => {
    console.log('new date', newText);
    // Ensure the date is in the correct format
    if (!/^\d{2}-\d{2}-\d{4}$/.test(newText)) {
      alert('Date must be in the format DD-MM-YYYY');
      setDate('');
      setWeeksFromNow(null);
      return;
    }

    // Extract the day, month, and year from the date
    const [day, month, year] = newText.split('-').map(Number);

    // Check if the year is between 2000 and the current year
    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear) {
      alert(`Year must be between 2000 and ${currentYear}`);
      setDate('');
      setWeeksFromNow(null);
      return;
    }

    // Check if the month is between 1 and 12
    if (month < 1 || month > 12) {
      alert('Month must be between 1 and 12');
      setDate('');
      setWeeksFromNow(null);
      return;
    }

    // Check if the day is valid for the given month and year
    const inputDate = new Date(year, month - 1, day); // Month is zero-indexed in Date constructor
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to remove time part

    if (inputDate > today) {
      alert("The selected date cannot be greater than today's date");
      setDate('');
      setWeeksFromNow(null);
      return;
    }

    // Check if the day is between 1 and 31
    if (day < 1 || day > 31) {
      alert('Day must be between 1 and 31');
      setDate('');
      setWeeksFromNow(null);
      return;
    }

    // Additional check for months with less than 31 days
    if (
      month === 2 &&
      (day > 29 ||
        (day === 29 &&
          !((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)))
    ) {
      alert('February cannot have more than 29 days in non-leap years');
      setDate('');
      setWeeksFromNow(null);
      return;
    } else if ([4, 6, 9, 11].includes(month) && day > 30) {
      alert('This month cannot have more than 30 days');
      setDate('');
      setWeeksFromNow(null);
      return;
    }

    // Calculate the weeks from the provided date to now
    const dateMoment = moment(newText, 'DD-MM-YYYY');
    const now = moment();
    const duration = moment.duration(now.diff(dateMoment));
    const weeks = Math.floor(duration.asWeeks());

    setWeeksFromNow(weeks);
  };

  return (
    <Modal
      useNativeDriverForBackdrop
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      animationInTiming={1}
      animationOutTiming={1}
      backdropOpacity={0.4}
      isVisible={visible}
      style={{
        margin: 0,
      }}
      onBackButtonPress={() => {
        setVisible(false);
      }}
      onBackdropPress={() => {
        setVisible(false);
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
          // setVisible(false);
        }}
        style={{
          justifyContent: 'center',
          backgroundColor: getColorCodeWithOpactiyNumber(colors.black, '60'),
          flex: 1,
        }}>
        <View
          style={{
            backgroundColor: hornyMode ? '#331A4F' : colors.white,
            borderRadius: 12,
            paddingTop: scaleNew(20),

            paddingBottom: scaleNew(15),
            marginHorizontal: 25,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: scaleNew(16),
            }}>
            <Text
              style={{
                fontFamily: fonts.semiBoldFont,
                fontSize: scaleNew(18),
                color: hornyMode ? '#ffffff' : '#595959',
              }}>
              When did you both start{'\n'}dating?
            </Text>
            <Pressable
              onPress={() => {
                setVisible(false);
              }}>
              <Image
                source={APP_IMAGE.datingCross}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                }}
              />
            </Pressable>
          </View>
          <View
            style={{
              paddingVertical: scaleNew(20),
              borderTopWidth: 1,
              borderTopColor: 'rgba(228, 231, 236, 1)',
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(228, 231, 236, 1)',
              marginTop: 20,
            }}>
            <Text
              style={{
                fontFamily: fonts.semiBoldFont,
                fontSize: scaleNew(48),
                color: hornyMode ? '#ffffff' : '#808491',
                textAlign: 'center',
              }}>
              {weeksFromNow || 0} {weeksFromNow === 1 ? 'Week' : 'Weeks'}
            </Text>
          </View>
          <View
            style={{marginTop: scaleNew(20), marginHorizontal: scaleNew(20)}}>
            <TextInput
              ref={inputRef}
              placeholder="DD-MM-YYYY"
              placeholderTextColor={'#929292'}
              keyboardType="numeric"
              onChangeText={handleDateChange}
              value={date}
              style={{
                backgroundColor: 'rgba(235, 235, 235, 0.34)',
                height: scaleNew(55),
                borderRadius: scaleNew(10),
                paddingHorizontal: scaleNew(16),
                fontFamily: fonts.regularFont,
                fontSize: scaleNew(16),
                includeFontPadding: false,
                marginBottom: scaleNew(20),
                color: hornyMode ? '#ffffff' : '#929292',
              }}
              // onBlur={() => {
              //   onBlurFunction(date);
              // }}
            />
            <AppButton
              style={{
                ...styles.viewButton,
                backgroundColor:
                  weeksFromNow === null
                    ? 'rgba(18, 70, 152, 0.4)'
                    : colors.blue1,
              }}
              // style={
              //   !weeksFromNow ? {backgroundColor: 'rgba(18, 70, 152, 0.4)'} : {}
              // }
              disabled={weeksFromNow === null ? true : false}
              text={'Confirm'}
              onPress={() => onSubmitDate(date)}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DatingTimeModal;

const styles = StyleSheet.create({
  viewButton: {
    height: scaleNew(50),
    paddingVertical: 0,
  },
});

const JourneyRow = ({image, text, isCompleted}) => {
  const {hornyMode} = useAppContext();
  let bgColor, iconColor, textColor;
  if (isCompleted) {
    if (hornyMode) {
      bgColor = 'rgb(86, 48, 138)';
      iconColor = '#331A4F';
      textColor = '#ffffff';
    } else {
      bgColor = 'rgb(243,245,247)';
      iconColor = '#12469821';
      textColor = '#808491';
    }
  } else {
    if (hornyMode) {
      bgColor = '#331A4F';
      iconColor = 'rgb(86, 48, 138)';
      textColor = '#ffffff';
    } else {
      bgColor = colors.white;
      iconColor = '#F3F5F799';
      textColor = '#808491';
    }
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 12,
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: 'center',
        backgroundColor: bgColor,
        shadowColor: '#00000045',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 3.84,

        elevation: 5,
        borderRadius: 12,
      }}>
      <View
        style={{
          backgroundColor: iconColor,
          borderRadius: 100,
        }}>
        <Image
          source={image}
          style={{width: 32, height: 32, resizeMode: 'contain'}}
        />
      </View>
      <Text
        style={{
          flex: 1,
          fontFamily: fonts.semiBoldFont,
          fontSize: scaleNew(14),
          color: textColor,
          marginLeft: 10,
        }}>
        {text}
      </Text>
      <Image
        style={{
          width: 24,
          height: 24,
        }}
        source={isCompleted ? APP_IMAGE.journeyCheck : APP_IMAGE.journeyUncheck}
      />
    </View>
  );
};
