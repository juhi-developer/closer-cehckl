/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import {optionsBothLive, optionsRelationship} from '../../utils/constants';
import {ToastMessage} from '../toastMessage';
import {setData} from '../../utils/storage';
import {VARIABLES} from '../../utils/variables';
import API from '../../redux/saga/request';
import OverlayLoader from '../overlayLoader';
import AppButton from '../appButton';
import {Modal} from 'react-native-js-only-modal';

export default function MismatchAnswersModal(props) {
  const {setModalVisible, modalVisible, data} = props;

  const [loading, setloading] = useState(false);

  // const data = {relationshipDistance: {partner: '3', user: '2'}};

  const [selectedOptionRelation, setSelectedOptionRelation] = useState('');
  const [selectedOptionBothLive, setSelectedOptionBothLive] = useState('');

  const onDismiss = async () => {
    setModalVisible(false);
    await API('user/moments/mismatchPopupVisible', 'POST');
  };

  const onSubmit = async () => {
    if (data?.relationshipStatus?.user !== undefined) {
      if (selectedOptionRelation === '') {
        ToastMessage('Please select the above options first');
        return;
      }
    }

    if (data?.relationshipDistance?.user !== undefined) {
      if (selectedOptionBothLive === '') {
        ToastMessage('Please select the above options first');
        return;
      }
    }

    const params = {
      relationshipStatus: selectedOptionRelation,
      relationshipDistance: selectedOptionBothLive,
    };

    try {
      setloading(true);
      const resp = await API('user/moments/mismatchPopupForm', 'POST', params);
      if (resp.body.statusCode === 200) {
        await API('user/moments/mismatchPopupVisible', 'POST');
        console.log('peronalize data mismatch', JSON.stringify(resp.body));

        setloading(false);
        setModalVisible(false);
      }
      console.log('personlize respnse mismatch', resp);
    } catch (error) {
      console.log('error mismatch', error);
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      visible={modalVisible}
      onCloseRequest={() => {
        onDismiss();
      }}
      style={{margin: 0, justifyContent: 'flex-end', flex: 1, width: '100%'}}>
      <View style={styles.container}>
        <OverlayLoader visible={loading} />
        <View
          style={{
            paddingHorizontal: scaleNew(16),
          }}>
          <Text style={styles.title}>We found mismatching answers!</Text>
          <Text style={styles.subTitle}>
            Do you want to change your answer(s) to the below question(s) to
            match with your partner’s?
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#E4E7EC',
            height: scaleNew(1),
            width: '100%',
            marginTop: scaleNew(20),
          }}
        />

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: scaleNew(16),
            backgroundColor: '#FAFAFA',
          }}>
          {data?.relationshipStatus?.user !== undefined && (
            <>
              <Text style={styles.question}>
                What is the status of your relationship?
              </Text>
              <Pressable
                onPress={() => {
                  setSelectedOptionRelation(data?.relationshipStatus?.user);
                }}
                style={{
                  ...styles.viewRow,
                  borderColor:
                    selectedOptionRelation === data?.relationshipStatus?.user
                      ? colors.blue1
                      : colors.white,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      ...styles.text,
                      color:
                        selectedOptionRelation ===
                        data?.relationshipStatus?.user
                          ? colors.blue1
                          : '#808491',
                    }}>
                    {optionsRelationship[data?.relationshipStatus?.user]?.label}
                  </Text>
                  <Text style={styles.text2}>You answered</Text>
                </View>
                {selectedOptionRelation === data?.relationshipStatus?.user ? (
                  <Image
                    style={{
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/selected_check.png')}
                  />
                ) : (
                  <Image
                    style={{
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/unselected_check.png')}
                  />
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  setSelectedOptionRelation(data?.relationshipStatus?.partner);
                }}
                style={{
                  ...styles.viewRow,
                  borderColor:
                    selectedOptionRelation === data?.relationshipStatus?.partner
                      ? colors.blue1
                      : colors.white,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      ...styles.text,
                      color:
                        selectedOptionRelation ===
                        data?.relationshipStatus?.partner
                          ? colors.blue1
                          : '#808491',
                    }}>
                    {
                      optionsRelationship[data?.relationshipStatus?.partner]
                        ?.label
                    }
                  </Text>
                  <Text
                    style={{
                      ...styles.text2,
                    }}>
                    {VARIABLES.user?.partnerData?.partner?.name} answered
                  </Text>
                </View>
                {selectedOptionRelation ===
                data?.relationshipStatus?.partner ? (
                  <Image
                    style={{
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/selected_check.png')}
                  />
                ) : (
                  <Image
                    style={{
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/unselected_check.png')}
                  />
                )}
              </Pressable>
            </>
          )}

          {data?.relationshipDistance?.user !== undefined && (
            <>
              <Text style={styles.question}>How closely do you both live?</Text>

              <Pressable
                onPress={() => {
                  setSelectedOptionBothLive(data?.relationshipDistance?.user);
                }}
                style={{
                  ...styles.viewRow,
                  borderColor:
                    selectedOptionBothLive === data?.relationshipDistance?.user
                      ? colors.blue1
                      : colors.white,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      ...styles.text,
                      color:
                        selectedOptionBothLive ===
                        data?.relationshipDistance?.user
                          ? colors.blue1
                          : '#808491',
                    }}>
                    {optionsBothLive[data?.relationshipDistance?.user]?.label}
                  </Text>
                  <Text style={styles.text2}>You answered</Text>
                </View>
                {selectedOptionBothLive === data?.relationshipDistance?.user ? (
                  <Image
                    style={{
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/selected_check.png')}
                  />
                ) : (
                  <Image
                    style={{
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/unselected_check.png')}
                  />
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  setSelectedOptionBothLive(
                    data?.relationshipDistance?.partner,
                  );
                }}
                style={{
                  ...styles.viewRow,
                  borderColor:
                    selectedOptionBothLive ===
                    data?.relationshipDistance?.partner
                      ? colors.blue1
                      : colors.white,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      ...styles.text,
                      color:
                        selectedOptionBothLive ===
                        data?.relationshipDistance?.partner
                          ? colors.blue1
                          : '#808491',
                    }}>
                    {
                      optionsBothLive[data?.relationshipDistance?.partner]
                        ?.label
                    }
                  </Text>
                  <Text
                    style={{
                      ...styles.text2,
                    }}>
                    {VARIABLES.user?.partnerData?.partner?.name} answered
                  </Text>
                </View>
                {selectedOptionBothLive ===
                data?.relationshipDistance?.partner ? (
                  <Image
                    style={{
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/selected_check.png')}
                  />
                ) : (
                  <Image
                    style={{
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/unselected_check.png')}
                  />
                )}
              </Pressable>
            </>
          )}

          <AppButton
            style={{
              ...styles.viewButton,
              // backgroundColor:
              // weeksFromNow === null ? 'rgba(18, 70, 152, 0.4)' : colors.blue1,
            }}
            //   disabled={weeksFromNow === null ? true : false}
            text={'Confirm'}
            onPress={() => onSubmit()}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop: scaleNew(20),

    borderTopEndRadius: scaleNew(20),
    borderTopStartRadius: scaleNew(20),

    maxHeight: '90%',
  },
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(18),
    color: '#595959',
  },
  subTitle: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(14),
    color: '#737373',
    marginTop: scaleNew(4),
  },
  question: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(16),
    color: '#595959',
    marginTop: scaleNew(20),
  },
  viewRow: {
    flexDirection: 'row',
    borderRadius: scaleNew(12),
    marginTop: scaleNew(12),
    borderWidth: 1,
    borderColor: colors.blue1,
    padding: scaleNew(16),

    shadowColor:
      Platform.OS === 'android' ? '#000' : 'rgba(131, 131, 131, 0.16)',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    backgroundColor: colors.white,
  },
  text: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(22),
    color: colors.blue1,
  },
  text2: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(14),
    color: '#737373',
    marginTop: scaleNew(2),
  },
  viewButton: {
    height: scaleNew(50),
    paddingVertical: 0,
    marginTop: scaleNew(24),
    marginBottom: scaleNew(24),
  },
});
