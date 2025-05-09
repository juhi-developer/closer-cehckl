import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {APP_IMAGE} from '../../utils/constants';
import {fonts} from '../../styles/fonts';
import {scale} from '../../utils/metrics';
import SwipeButton from '../SwipeButton';
import LinearGradient from 'react-native-linear-gradient';
import {HapticFeedbackHeavy} from '../../utils/HapticFeedback';
import {getStateDataAsync} from '../../utils/helpers';
import {VARIABLES} from '../../utils/variables';

export default function PokeModal(props) {
  const {setModalVisible, modalVisible, setData, onDismissPoke} = props;

  const [collapse, setCollapse] = useState(false);
  const [emojiSelected, setEmojiSelected] = useState('👉🏻');
  const [nudgeView, setNudgeView] = useState(false);
  const [nudgeSelected, setNudgeSelected] = useState('');

  const onSubmit = async () => {
    let emoji = await getStateDataAsync(setEmojiSelected);
    let mood = await getStateDataAsync(setNudgeSelected);
    let data = {
      emoji: emoji,
      moment: mood,
    };
    setData(data);
    HapticFeedbackHeavy();
    setModalVisible(false);
  };

  const onDismiss = () => {
    onDismissPoke();
    setModalVisible(false);
  };

  return (
    <Modal
      backdropTransitionOutTiming={20}
      backdropOpacity={0.7}
      isVisible={modalVisible}
      // avoidKeyboard={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationOutTiming={10}
      animationInTiming={10}
      onBackButtonPress={() => {
        onDismiss();
      }}
      onBackdropPress={() => {
        onDismiss();
      }}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <View
        testID="poke-modal-visible"
        style={{
          backgroundColor: '#F5F1F0',
          padding: scale(20),
          borderTopEndRadius: scale(20),
          borderTopStartRadius: scale(20),
        }}>
        {/* <Image
          style={{alignSelf: 'center', marginTop: -scale(60)}}
          source={require('../../assets/images/nudgeIcon.png')}
        /> */}

        <Text style={styles.title}>
          Poke {VARIABLES.user?.partnerData?.partner?.name} with an emoji or
          simply nudge{' '}
          {VARIABLES.user?.partnerData?.partner?.gender === 'Female'
            ? 'her'
            : 'him'}{' '}
          to post something on Closer
        </Text>

        <View style={styles.viewRow}>
          <TouchableWithoutFeedback
            onPress={() => {
              setEmojiSelected('👉🏻');
              setNudgeSelected('');
            }}>
            <LinearGradient
              colors={
                emojiSelected === '👉🏻'
                  ? [colors.blue6, colors.blue7]
                  : ['#FFFEFD', '#FFFEFD']
              }
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={{...styles.viewBox, marginEnd: scale(12), marginStart: 0}}>
              <Text
                style={{
                  fontSize: Platform.OS === 'ios' ? scale(34) : scale(24),
                  color: 'black',
                }}>
                👉🏻
              </Text>
            </LinearGradient>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setEmojiSelected('🥰');
              setNudgeSelected('');
            }}>
            <LinearGradient
              colors={
                emojiSelected === '🥰'
                  ? [colors.blue6, colors.blue7]
                  : ['#FFFEFD', '#FFFEFD']
              }
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={{...styles.viewBox, marginStart: 0}}>
              <Text
                style={{
                  fontSize: Platform.OS === 'ios' ? scale(34) : scale(24),
                  color: 'black',
                }}>
                🥰
              </Text>
            </LinearGradient>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              setEmojiSelected('💋');
              setNudgeSelected('');
            }}>
            <LinearGradient
              colors={
                emojiSelected === '💋'
                  ? [colors.blue6, colors.blue7]
                  : ['#FFFEFD', '#FFFEFD']
              }
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={styles.viewBox}>
              <Text
                style={{
                  fontSize: Platform.OS === 'ios' ? scale(34) : scale(24),
                  color: 'black',
                }}>
                💋
              </Text>
            </LinearGradient>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              setEmojiSelected('😡');
            }}>
            <LinearGradient
              colors={
                emojiSelected === '😡'
                  ? [colors.blue6, colors.blue7]
                  : ['#FFFEFD', '#FFFEFD']
              }
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={styles.viewBox}>
              <Text
                style={{
                  fontSize: Platform.OS === 'ios' ? scale(34) : scale(24),
                  color: 'black',
                }}>
                😡
              </Text>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>

        <Text style={{...styles.title, marginVertical: scale(37)}}>OR</Text>

        <View style={styles.viewRowBox}>
          <Pressable
            hitSlop={20}
            onPress={() => {
              setCollapse(!collapse);
            }}
            style={{...styles.viewRowSpace}}>
            <Text style={styles.textNudge}>
              Would you like to nudge{' '}
              {VARIABLES.user?.partnerData?.partner?.name} to post something on
              Closer?
            </Text>

            {collapse ? (
              <Image
                source={require('../../assets/images/arrow-button-down.png')}
              />
            ) : (
              <Image
                source={require('../../assets/images/arrow-right-blue.png')}
              />
            )}
          </Pressable>
          {collapse && (
            <View style={{...styles.viewRowSpace, marginTop: scale(30)}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setNudgeSelected('1');
                  setEmojiSelected('');
                }}>
                <LinearGradient
                  colors={
                    nudgeSelected === '1'
                      ? [colors.blue6, colors.blue7]
                      : ['#F5F1F0', '#F5F1F0']
                  }
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  style={styles.viewBoxIcon}>
                  <Image
                    style={{
                      width: scale(35),
                      height: scale(35),
                      tintColor: nudgeSelected === '1' ? 'white' : colors.blue2,
                    }}
                    source={require('../../assets/images/sticky-note-icon.png')}
                  />
                  <Text
                    style={{
                      ...styles.textDesc,
                      color: nudgeSelected === '1' ? 'white' : colors.blue2,
                    }}>
                    Sticky notes
                  </Text>
                </LinearGradient>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  setNudgeSelected('2');
                  setEmojiSelected('');
                }}>
                <LinearGradient
                  colors={
                    nudgeSelected === '2'
                      ? [colors.blue6, colors.blue7]
                      : ['#F5F1F0', '#F5F1F0']
                  }
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  style={{...styles.viewBoxIcon, marginHorizontal: scale(12)}}>
                  <Image
                    style={{
                      width: scale(35),
                      height: scale(35),
                      tintColor: nudgeSelected === '2' ? 'white' : colors.blue2,
                    }}
                    source={require('../../assets/images/feed-icon.png')}
                  />
                  <Text
                    style={{
                      ...styles.textDesc,
                      color: nudgeSelected === '2' ? 'white' : colors.blue2,
                    }}>
                    Feed
                  </Text>
                </LinearGradient>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  setNudgeSelected('3');
                  setEmojiSelected('');
                }}>
                <LinearGradient
                  colors={
                    nudgeSelected === '3'
                      ? [colors.blue6, colors.blue7]
                      : ['#F5F1F0', '#F5F1F0']
                  }
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  style={styles.viewBoxIcon}>
                  <Image
                    style={{
                      width: scale(31),
                      height: scale(31),
                      tintColor: nudgeSelected === '3' ? 'white' : colors.blue2,
                    }}
                    source={require('../../assets/images/mood-icon.png')}
                  />
                  <Text
                    style={{
                      ...styles.textDesc,
                      color: nudgeSelected === '3' ? 'white' : colors.blue2,
                    }}>
                    Mood
                  </Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>

        <SwipeButton
          buttonName={VARIABLES.user?.partnerData?.partner?.name}
          viewStyles={{marginVertical: scale(10)}}
          onSuccess={() => {
            setTimeout(() => {
              onSubmit();
            }, 1500);
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewRow: {
    flexDirection: 'row',
    paddingTop: scale(37),
    marginHorizontal: scale(14),
  },
  viewRowBox: {
    backgroundColor: colors.white,
    padding: scale(18),
    paddingVertical: scale(30),
    borderRadius: scale(12),
  },
  viewRowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 1,
  },
  viewBoxIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(12),

    height: scale(95),
  },
  textDesc: {
    fontFamily: fonts.regularFont,
    fontSize: scale(14),
    color: colors.blue2,
    marginTop: scale(4),
  },
  textNudge: {
    fontFamily: fonts.regularFont,
    fontSize: scale(14),
    color: colors.blue2,
    flexShrink: 1,
  },
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16),
    lineHeight: scale(26),
    textAlign: 'center',
    marginTop: scale(30),
    marginHorizontal: scale(20),
    color: colors.black,
  },
  viewBox: {
    backgroundColor: '#FFFEFD',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(13.5),
    marginStart: scale(12),
    height: scale(51),
  },
});
