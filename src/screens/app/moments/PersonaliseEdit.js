/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {scaleNew} from '../../../utils/metrics2';
import {colors} from '../../../styles/colors';
import {fonts} from '../../../styles/fonts';
import {ToastMessage} from '../../../components/toastMessage';
import API from '../../../redux/saga/requestAuth';
import OverlayLoader from '../../../components/overlayLoader';
import {setData} from '../../../utils/storage';
import ProgressBar from '../../../components/ProgressBar';
import {
  genderOptions,
  optionsBothLive,
  optionsChildren,
  optionsRelationship,
} from '../../../utils/constants';
import {VARIABLES} from '../../../utils/variables';
import AppButton from '../../../components/appButton';

const TOTAL_QUESTIONS = 4;

export default function PersonaliseEdit({navigation}) {
  const [selectedOptionRelation, setSelectedOptionRelation] = useState('');
  const [selectedGender, setselectedGender] = useState('');
  const [selectedOptionBothLive, setSelectedOptionBothLive] = useState('');
  const [selectedOptionChildren, setSelectedOptionChildren] = useState('');

  const [progress, setProgress] = useState(0);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setSelectedOptionChildren(VARIABLES.user?.personalise?.children);
    setSelectedOptionBothLive(
      VARIABLES.user?.personalise?.relationshipDistance,
    );
    setSelectedOptionRelation(VARIABLES.user?.personalise?.relationshipStatus);
    setselectedGender(VARIABLES.user?.gender);
    console.log('VARAIABLES PERSONALISE', VARIABLES.user?.personalise);
  }, []);

  useEffect(() => {
    const selectedOptions = [
      selectedOptionRelation,
      selectedOptionBothLive,
      selectedOptionChildren,

      selectedGender,
    ].filter(option => option !== '').length;

    setProgress(selectedOptions);
  }, [
    selectedOptionRelation,
    selectedOptionBothLive,
    selectedOptionChildren,
    selectedGender,
  ]);

  const handleOptionSelect = key => {
    setSelectedOptionRelation(key);
  };

  const handleGenderSelect = key => {
    setselectedGender(key);
  };

  const handleOptionBothLive = key => {
    setSelectedOptionBothLive(key);
  };
  const handleOptionChildren = key => {
    setSelectedOptionChildren(key);
  };

  const onSubmit = async () => {
    if (
      !selectedGender ||
      !selectedOptionBothLive ||
      !selectedOptionChildren ||
      !selectedOptionRelation
    ) {
      ToastMessage('Please select the above options first');
      return;
    }

    const data = {
      relationshipStatus: selectedOptionRelation,
      relationshipDistance: selectedOptionBothLive,
      children: selectedOptionChildren,
      gender: selectedGender,
    };

    try {
      setloading(true);
      const resp = await API('user/profile/personalize', 'PUT', data);
      if (resp.body.statusCode === 200) {
        console.log('peronalize data', JSON.stringify(resp.body));
        VARIABLES.user = resp.body.data;
        setData('USER', JSON.stringify(resp.body.data));
        setloading(false);
        navigation.goBack();
      }
      console.log('personlize respnse', resp);
    } catch (error) {
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E9FFFE', '#FFEBDB']}
      locations={[0, 0.3]}
      useAngle
      angle={190}
      style={styles.container}>
      <OverlayLoader visible={loading} />
      <View
        style={{
          shadowColor: colors.shadow,
          shadowOffset: {width: -4, height: scaleNew(-4)},
          shadowOpacity: Platform.OS === 'ios' ? 0.1 : 1,
          shadowRadius: scaleNew(4),
          elevation: scaleNew(24),
          flex: 1,
          marginTop: scaleNew(70),
        }}>
        <LinearGradient
          colors={['#E9FFFE', '#FFEBDB']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          locations={[0, 0.7]}
          useAngle={true}
          angle={160}
          style={{
            ...styles.container,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: scaleNew(20),
            paddingTop: scaleNew(20),
          }}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{
                height: scaleNew(14),
                marginBottom: scaleNew(16),
              }}
              source={require('../../../assets/images/ic_back.png')}
            />
          </Pressable>

          <View style={styles.progressBar}>
            <ProgressBar
              currentAmount={progress}
              totalAmount={TOTAL_QUESTIONS}
            />
          </View>
          <Text style={styles.textPersonalise}>
            Help us personalise your experience
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: scaleNew(40),
            }}>
            <Text style={styles.title}>
              What is the status of your relationship?
            </Text>

            {optionsRelationship.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleOptionSelect(option.id)}
                style={{
                  ...styles.menuItem,
                  paddingVertical: scaleNew(6),
                }}>
                <Text style={styles.menuItemText}>{option.label}</Text>
                {option.id === selectedOptionRelation ? (
                  <Image
                    style={{
                      width: scaleNew(24),
                      height: scaleNew(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/checkboxSelect.png')}
                  />
                ) : (
                  <Image
                    style={{
                      width: scaleNew(24),
                      height: scaleNew(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/checkBoxUnselect.png')}
                  />
                )}
              </TouchableOpacity>
            ))}

            <Text style={styles.title}>What is your gender?</Text>

            {genderOptions.map((option, index) => (
              <TouchableOpacity
                key={option.label}
                onPress={() => handleGenderSelect(option.label)}
                style={{
                  ...styles.menuItem,
                  paddingVertical: scaleNew(6),
                }}>
                <Text style={styles.menuItemText}>{option.label}</Text>
                {option.label === selectedGender ? (
                  <Image
                    style={{
                      width: scaleNew(24),
                      height: scaleNew(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/checkboxSelect.png')}
                  />
                ) : (
                  <Image
                    style={{
                      width: scaleNew(24),
                      height: scaleNew(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/checkBoxUnselect.png')}
                  />
                )}
              </TouchableOpacity>
            ))}

            <Text style={styles.title}>How closely do you both live?</Text>

            {optionsBothLive.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleOptionBothLive(option.id)}
                style={{
                  ...styles.menuItem,
                  paddingVertical: scaleNew(6),
                }}>
                <Text style={styles.menuItemText}>{option.label}</Text>
                {option.id === selectedOptionBothLive ? (
                  <Image
                    style={{
                      width: scaleNew(24),
                      height: scaleNew(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/checkboxSelect.png')}
                  />
                ) : (
                  <Image
                    style={{
                      width: scaleNew(24),
                      height: scaleNew(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/checkBoxUnselect.png')}
                  />
                )}
              </TouchableOpacity>
            ))}

            <Text style={styles.title}>Do you have children?</Text>

            {optionsChildren.map((option, index) => (
              <TouchableOpacity
                key={option.label}
                onPress={() => handleOptionChildren(option.label)}
                style={{
                  ...styles.menuItem,
                  paddingVertical: scaleNew(6),
                }}>
                <Text style={styles.menuItemText}>{option.label}</Text>
                {option.label === selectedOptionChildren ? (
                  <Image
                    style={{
                      width: scaleNew(24),
                      height: scaleNew(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/checkboxSelect.png')}
                  />
                ) : (
                  <Image
                    style={{
                      width: scaleNew(24),
                      height: scaleNew(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/checkBoxUnselect.png')}
                  />
                )}
              </TouchableOpacity>
            ))}

            <AppButton
              onPress={onSubmit}
              text="Continue"
              style={{
                backgroundColor: colors.blue1,

                marginTop: scaleNew(20),
              }}
            />
          </ScrollView>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    height: 9,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    borderRadius: 40,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: scaleNew(14),
    fontFamily: fonts.regularFont,
    color: '#808491',
  },
  title: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: '#444444',
    marginTop: scaleNew(22),
    marginBottom: scaleNew(6),
  },
  textPersonalise: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(12),
    color: '#444444',
    marginTop: scaleNew(10),
  },
});
