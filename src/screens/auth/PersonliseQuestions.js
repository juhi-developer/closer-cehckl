/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {scaleNew} from '../../utils/metrics2';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import AppView from '../../components/AppView';
import AppButton from '../../components/appButton';
import {ToastMessage} from '../../components/toastMessage';
import API from '../../redux/saga/requestAuth';
import {CommonActions} from '@react-navigation/native';
import OverlayLoader from '../../components/overlayLoader';
import {setData} from '../../utils/storage';
import ProgressBar from '../../components/ProgressBar';
import {
  genderOptions,
  optionsBothLive,
  optionsChildren,
  optionsRelationship,
} from '../../utils/constants';
import {initializeTooltipStates} from '../../utils/contextualTooltips';
import {VARIABLES} from '../../utils/variables';
const CleverTap = require('clevertap-react-native');

const TOTAL_QUESTIONS = 4;

export default function PersonliseQuestions({navigation}) {
  const [selectedOptionRelation, setSelectedOptionRelation] = useState('');
  const [selectedGender, setselectedGender] = useState('');
  const [selectedOptionBothLive, setSelectedOptionBothLive] = useState('');
  const [selectedOptionChildren, setSelectedOptionChildren] = useState('');
  const [selectedOptionFavTopics, setSelectedOptionFavTopics] = useState('');
  const [otherValueFav, setOtherValueFav] = useState('');
  const [otherValue, setOtherValue] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setloading] = useState(false);

  const [type, setType] = useState(1);

  useEffect(() => {
    const selectedOptions = [
      selectedOptionRelation,
      selectedOptionBothLive,
      selectedOptionChildren,
      selectedOptionFavTopics,
      selectedGender,
    ].filter(option => option !== '').length;

    // const percentage = (selectedOptions / totalOptions) * 100;
    if (selectedOptions === TOTAL_QUESTIONS) {
      onSubmit();
    }
    setProgress(selectedOptions);
  }, [
    selectedOptionRelation,
    selectedOptionBothLive,
    selectedOptionChildren,
    selectedOptionFavTopics,
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

  useEffect(() => {
    if (type === 2) {
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'App',
              },
            ],
          }),
        );
      }, 1500);
    }
  }, [type]);

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
      const resp = await API('user/auth/personalizeForm', 'POST', data);

      if (resp.body.statusCode === 200) {
        setData('USER', JSON.stringify(resp.body.data));
        setloading(false);
        navigation.navigate('HearAboutUs');
      } else {
        setloading(false);
        ToastMessage(resp.body.Message);
      }
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
          <View style={styles.progressBar}>
            <ProgressBar
              currentAmount={progress}
              totalAmount={TOTAL_QUESTIONS}
            />
          </View>
          <Text style={styles.textPersonalise}>
            Help us personalise your experience
          </Text>
          {type === 1 ? (
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
                      source={require('../../assets/images/checkboxSelect.png')}
                    />
                  ) : (
                    <Image
                      style={{
                        width: scaleNew(24),
                        height: scaleNew(24),
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/images/checkBoxUnselect.png')}
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
                      source={require('../../assets/images/checkboxSelect.png')}
                    />
                  ) : (
                    <Image
                      style={{
                        width: scaleNew(24),
                        height: scaleNew(24),
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/images/checkBoxUnselect.png')}
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
                      source={require('../../assets/images/checkboxSelect.png')}
                    />
                  ) : (
                    <Image
                      style={{
                        width: scaleNew(24),
                        height: scaleNew(24),
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/images/checkBoxUnselect.png')}
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
                      source={require('../../assets/images/checkboxSelect.png')}
                    />
                  ) : (
                    <Image
                      style={{
                        width: scaleNew(24),
                        height: scaleNew(24),
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/images/checkBoxUnselect.png')}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -scaleNew(100),
              }}>
              {/* <Image source={require('../../assets/images/thankYou.png')} /> */}
            </View>
          )}
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
