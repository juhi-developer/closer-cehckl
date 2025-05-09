/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import {updateContextualTooltipState} from '../../utils/contextualTooltips';
import {launchImageLibrary} from 'react-native-image-picker';
import {scale} from '../../utils/metrics';
import API from '../../redux/saga/request';
import OverlayLoader from '../overlayLoader';
import {Image as CompressedImage} from 'react-native-compressor';
import {generateID, uploadToS3BUCKET} from '../../utils/helpers';
import {ToastMessage} from '../toastMessage';
import DeviceInfo from 'react-native-device-info';
import {Modal} from 'react-native-js-only-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

export default function ShareFeedbackModal(props) {
  const {setModalVisible, modalVisible, onClose} = props;

  const question = 'What can we improve?';

  const [viewType, setViewType] = useState(1);
  const [description, setDescription] = useState('');
  const [feedbackImages, setFeedbackImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDismiss = async () => {
    await updateContextualTooltipState('shareFeedback', true);
    setModalVisible(false);
  };

  const onSelectImages = async () => {
    try {
      const options = {
        mediaType: 'photo',
        selectionLimit: 3 - feedbackImages.length,
      };

      const res = await launchImageLibrary(options);

      // Navigate with the image data
      const images = res.assets.map(image => {
        return {
          url: image.uri, // Assuming 'uri' is used to access the image path
        };
      });

      setFeedbackImages(prevImages => {
        // Combine previous images with newly selected ones
        const updatedImages = [...prevImages, ...images];
        // Slice the array to ensure only the first three images are kept
        return updatedImages.slice(0, 3);
      });
    } catch (error) {
      console.error('Failed to pick images:', error);
      // Optionally, handle specific error scenarios
      if (error.code === 'E_NO_LIBRARY_PERMISSION') {
        alert('Please grant access to your photos.');
      }
    }
  };

  const onSubmit = async () => {
    if (description.trim() === '') {
      alert('Please enter your feedback');
      return;
    }
    try {
      setLoading(true);

      const responses = [];
      if (feedbackImages.length > 0) {
        for (const imageURI of feedbackImages) {
          let id = generateID();
          const filename = `${id}${Date.now()}.jpg`;
          const path = await CompressedImage.compress(imageURI.url);
          const s3response = await uploadToS3BUCKET(
            path,
            filename,
            'jpg',
            'profiles',
          );

          console.log('s3 repsnses share', s3response);

          if (s3response) {
            responses.push({
              url: s3response.response,
            });
          } else {
            console.log('error feedback images', s3response);
          }
        }
      }
      console.log('responses', responses);

      const data = {
        subject: question,
        text: description,
        images: responses,
      };
      const array = {
        feedbacks: [data],
        os: Platform.OS,
        osVersion: Platform.Version.toString(),
        deviceModel: await DeviceInfo.getModel(),
      };
      const resp = await API('user/feedback', 'POST', array);
      console.log('resp feedback', JSON.stringify(resp));
      if (resp.body.statusCode === 200) {
        await updateContextualTooltipState('shareFeedback', true);
        onClose();
        setModalVisible(false);
      } else {
        ToastMessage(resp.body.Message);
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    } finally {
      setLoading(false);
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
      style={styles.viewModal}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: 'flex-end',
          flex: 1,
        }}
        enabled>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={styles.container}>
            <OverlayLoader visible={loading} />

            <Pressable
              onPress={() => {
                onDismiss();
              }}
              style={styles.viewCross}>
              <Image source={require('../../assets/images/closeWhiteBg.png')} />
            </Pressable>
            {viewType === 1 ? (
              <>
                <Image
                  style={styles.imageStyle}
                  source={require('../../assets/images/shareFeedbackIcon.png')}
                />
                <Text style={styles.title}>
                  We’d love to hear{`\n`}from you! 🫶🏻
                </Text>

                <Text style={styles.subtitle}>
                  Found a bug? Love or hate a feature?{`\n`}You can share
                  feedback anytime from{`\n`}profile
                </Text>
              </>
            ) : (
              <>
                <Text style={{...styles.title, textAlign: 'left'}}>
                  {question}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regularFont,
                    fontSize: scaleNew(14),
                    color: '#808491',
                    textAlign: 'left',
                    includeFontPadding: false,
                    //     marginTop: scaleNew(4),
                  }}>
                  Your feedback will truly help us improve Closer
                </Text>
                <View
                  style={{
                    borderRadius: scaleNew(20),
                    backgroundColor: colors.white,
                    padding: scaleNew(12),
                    marginTop: scaleNew(32),
                  }}>
                  <TextInput
                    style={{
                      fontFamily: fonts.regularFont,
                      fontSize: scaleNew(14),
                      color: '#808491',
                      height: scaleNew(90),
                      textAlignVertical: 'top',
                    }}
                    value={description}
                    multiline
                    placeholder="What could we do better?"
                    placeholderTextColor={'#808491'}
                    onChangeText={e => setDescription(e)}
                  />

                  {feedbackImages.length > 0 ? (
                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        {feedbackImages.map((image, index) => (
                          <View>
                            <Pressable
                              style={{
                                position: 'absolute',
                                top: scale(4),
                                right: scale(10),
                                zIndex: 10,

                                borderRadius: 100,
                              }}
                              onPress={() => {
                                setFeedbackImages(prevImages =>
                                  prevImages.filter((item, i) => i !== index),
                                );
                              }}>
                              <Image
                                style={{
                                  width: scaleNew(20),
                                  height: scaleNew(20),
                                }}
                                source={require('../../assets/images/closeWhiteBg.png')}
                              />
                            </Pressable>
                            <Image
                              style={{
                                width: scaleNew(90),
                                height: scaleNew(90),
                                borderRadius: scaleNew(5),
                                marginRight: scaleNew(5),
                              }}
                              key={index}
                              source={{
                                uri: image.url,
                              }}
                            />
                          </View>
                        ))}
                        {feedbackImages.length < 3 && (
                          <Pressable onPress={onSelectImages}>
                            <Image
                              style={{
                                width: scaleNew(45),
                                height: scaleNew(45),

                                marginStart: scaleNew(6),
                              }}
                              source={require('../../assets/images/addIconFeedback.png')}
                            />
                          </Pressable>
                        )}
                      </View>
                    </>
                  ) : (
                    <Pressable
                      onPress={onSelectImages}
                      style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={require('../../assets/images/addIconFeedback1.png')}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.standardFont,
                          fontSize: scaleNew(12),
                          color: colors.blue1,
                          marginStart: scaleNew(3),
                          includeFontPadding: false,
                        }}>
                        Upload screenshot{' '}
                        <Text style={{fontFamily: fonts.regularFont}}>
                          (optional)
                        </Text>
                      </Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}

            <Pressable
              onPress={() => {
                if (viewType === 2) {
                  if (description.trim() === '') {
                    ToastMessage('Please enter your feedback');
                    return;
                  }
                  onSubmit();
                } else {
                  setViewType(2);
                }
              }}
              style={{
                ...styles.viewButton,
                opacity: description.trim() === '' && viewType === 2 ? 0.5 : 1,
              }}>
              <Text style={styles.textButton}>Share feedback</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewModal: {
    margin: 0,
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  container: {
    backgroundColor: '#F9F1E6',
    padding: scaleNew(26),
    borderTopEndRadius: scaleNew(20),
    borderTopStartRadius: scaleNew(20),
    paddingBottom: scaleNew(60),
  },
  viewCross: {
    width: scaleNew(27),
    height: scaleNew(27),
    alignSelf: 'flex-end',
  },
  imageStyle: {
    width: scaleNew(83),
    height: scaleNew(83),
    alignSelf: 'center',
    marginTop: scaleNew(14),
  },
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(26),
    color: '#595959',

    textAlign: 'center',
    marginTop: scaleNew(24),
    lineHeight: scaleNew(30),
  },
  subtitle: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: '#595959',
    textAlign: 'center',

    marginTop: scaleNew(12),
  },
  viewButton: {
    marginTop: scaleNew(32),
    backgroundColor: '#124698',
    borderRadius: scaleNew(10),
    height: scaleNew(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleNew(10),
  },
  textButton: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(16),
    color: colors.white,

    includeFontPadding: false,
  },
});
