import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {APP_IMAGE, MOODS, MOODS_FEELINGS} from '../../utils/constants';
import {globalStyles} from '../../styles/globalStyles';

import LinearGradient from 'react-native-linear-gradient';
import {scale} from '../../utils/metrics';
import {fonts} from '../../styles/fonts';
import ArrowUpIconSendSvg from '../../assets/svgs/arrowUpSendIconSvg';
import {AddFeelingsCheck} from '../../redux/actions';
import {useDispatch} from 'react-redux';
import {ToastMessage} from '../toastMessage';
import FastImage from 'react-native-fast-image';

const CleverTap = require('clevertap-react-native');

export default function FeelingCardModal(props) {
  const dispatch = useDispatch();
  const {setModalVisible, modalVisible, onDismissCard} = props;

  const [feelings, setFeelings] = useState('');
  const [moodIcon, setMoodIcon] = useState('');
  const [emotion, setEmotion] = useState('');

  const [feelingsLength, setFeelingsLength] = useState(0);

  const onSubmit = () => {
    if (emotion === '') {
      alert('Please choose a mood');
    } else {
      let data = {
        answer: feelings.trim(),
        text: emotion,
        mood: JSON.stringify(moodIcon),
      };

      CleverTap.recordEvent('Moods added');
      if (feelings.trim() !== '') {
        CleverTap.recordEvent('Moods added with text');
      }
      dispatch(AddFeelingsCheck(data));
      setFeelings('');
      setMoodIcon('');
      setEmotion('');
      setModalVisible(false);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <Pressable
        onPress={() => {
          console.log('item modd', item);
          setEmotion(item.mood);
          setMoodIcon(item.moodIcon);
        }}>
        <LinearGradient
          style={{
            ...styles.itemContainer,
          }}
          colors={[colors.blue7, colors.blue6]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <View
            style={{
              borderRadius: 15,
              overflow: 'hidden',
              borderWidth: emotion === item.mood ? scale(5) : 0,
              borderColor: '#FFAD76',
              width: scale(104),
              height: scale(142),

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FastImage source={item.moodIcon} style={{width: 46, height: 46}} />

            {/* <Image source={item.moodIcon} style={{width: 46, height: 46}} /> */}
            <Text
              style={{
                ...globalStyles.regularLargeText,
                color: colors.white,
                marginTop: 8,
                fontWeight: '400',
              }}>
              {item.mood}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    );
  };

  const onDismiss = () => {
    onDismissCard('vc');
    setModalVisible(false);
    setFeelings('');
    setMoodIcon('');
    setEmotion('');
  };

  return (
    <Modal
      useNativeDriverForBackdrop
      backdropTransitionOutTiming={500}
      backdropOpacity={0.7}
      isVisible={modalVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationOutTiming={500}
      animationInTiming={500}
      onBackButtonPress={() => {
        onDismiss();
      }}
      onBackdropPress={() => {
        onDismiss();
      }}
      avoidKeyboard
      style={styles.modal}>
      <Pressable onPress={() => Keyboard.dismiss()}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 20,
            margin: 20,
            height: scale(400),
          }}>
          <Text
            style={{
              fontFamily: fonts.semiBoldFont,
              fontSize: 16,
              color: colors.black,
              marginTop: 17,
              alignSelf: 'center',
              marginHorizontal: 14,
            }}>
            How are you doing today?
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={MOODS_FEELINGS}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{marginTop: scale(20)}}
            style={{marginHorizontal: 4}}
          />

          <>
            <TextInput
              placeholder="Share more context with your partner, if you’d like…"
              placeholderTextColor={'gray'}
              style={styles.feelingInput}
              value={feelings}
              onChangeText={text => {
                if (text.split('\n').length > 3) {
                  ToastMessage('Cannot add more than 3 paragraphs');
                  return;
                }
                setFeelings(text);
                setFeelingsLength(text.length);
              }}
              multiline={true}
              textAlignVertical="top"
              maxLength={140}
            />
            <View style={styles.feelingSendButton}>
              <Pressable
                style={{marginBottom: 2}}
                hitSlop={5}
                onPress={() => onSubmit()}>
                <ArrowUpIconSendSvg />
              </Pressable>
              <Text
                style={{
                  ...globalStyles.regularSmallText,
                  fontSize: scale(10),
                }}>
                {feelingsLength}/140
              </Text>
            </View>
          </>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  container: {
    backgroundColor: colors.white,
    margin: 24,
    //   alignItems: 'center',
    borderRadius: 20,
    paddingTop: 20,
    padding: 24,
  },
  itemContainer: {
    width: scale(104),
    height: scale(142),
    borderRadius: 15,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feelingInput: {
    height: scale(100),
    backgroundColor: '#F4F4F4',
    padding: scale(10),
    borderRadius: scale(10),
    ...globalStyles.regularMediumText,
    marginHorizontal: scale(12),
    //  marginTop: 4,
    // flex:1
  },
  feelingSendButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
    marginHorizontal: scale(12),
    marginBottom: scale(12),
  },
});
