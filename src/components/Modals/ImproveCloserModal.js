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
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import Modal from 'react-native-modal';
import {launchImageLibrary} from 'react-native-image-picker';
import {scale} from '../../utils/metrics';
import API from '../../redux/saga/request';
import OverlayLoader from '../overlayLoader';
import {Image as CompressedImage} from 'react-native-compressor';
import {generateID, uploadToS3BUCKET} from '../../utils/helpers';
import {ToastMessage} from '../toastMessage';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

export default function ImproveCloserModal(props) {
  const {setModalVisible, modalVisible, onClose} = props;

  const question = 'Facing an issue?';
  const question2 = 'Any new feature suggestions?';
  const question3 = 'Something you love about Closer?';
  const question4 = 'Something we should stop having in the app?';

  const [description, setDescription] = useState('');
  const [description2, setDescription2] = useState('');
  const [description3, setDescription3] = useState('');
  const [description4, setDescription4] = useState('');

  const [collapsed, setCollapsed] = useState(true);
  const [collapsed2, setCollapsed2] = useState(true);
  const [collapsed3, setCollapsed3] = useState(true);
  const [collapsed4, setCollapsed4] = useState(true);

  const [feedbackImages, setFeedbackImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDismiss = async () => {
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
    if (
      description.trim() === '' &&
      description2.trim() === '' &&
      description3.trim() === '' &&
      description4.trim() === ''
    ) {
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

      const data = [
        {
          subject: question,
          text: description,
          images: responses,
        },
        {
          subject: question2,
          text: description2,
          images: [],
        },
        {
          subject: question3,
          text: description3,
          images: [],
        },
        {
          subject: question4,
          text: description4,
          images: [],
        },
      ];
      const obj = {
        feedbacks: data,
        os: Platform.OS,
        osVersion: Platform.Version.toString(),
        deviceModel: await DeviceInfo.getModel(),
      };

      console.log('obj to send imprive', obj);

      const resp = await API('user/feedback', 'POST', obj);
      console.log('resp feedback', JSON.stringify(resp));
      if (resp.body.statusCode === 200) {
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
      avoidKeyboard={false}
      onBackdropPress={() => {
        onDismiss();
      }}
      onBackButtonPress={() => {
        onDismiss();
      }}
      isVisible={modalVisible}
      style={styles.viewModal}>
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
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{}}
            enabled>
            <View showsVerticalScrollIndicator={false}>
              <Text style={{...styles.title}}>How can we improve Closer?</Text>
              <Text style={styles.textDesc}>
                You can answer multiple questions
              </Text>
              <View>
                <Pressable
                  onPress={() => {
                    setCollapsed(!collapsed);
                    setCollapsed2(true);
                    setCollapsed3(true);
                    setCollapsed4(true);
                  }}
                  style={styles.viewRowQuestion}>
                  <Text style={styles.textQuestion}>{question}</Text>
                  {collapsed ? (
                    <Image
                      style={styles.arrowRight}
                      source={require('../../assets/images/arrowRightBlue.png')}
                    />
                  ) : (
                    <Image
                      style={styles.arrowRight}
                      source={require('../../assets/images/arrowDownBlue.png')}
                    />
                  )}
                </Pressable>
                {!collapsed && (
                  <View style={styles.viewAnswer}>
                    <TextInput
                      style={styles.inputAnswer}
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
                                style={styles.viewRemoveImage}
                                onPress={() => {
                                  setFeedbackImages(prevImages =>
                                    prevImages.filter((item, i) => i !== index),
                                  );
                                }}>
                                <Image
                                  style={styles.closeImage}
                                  source={require('../../assets/images/closeWhiteBg.png')}
                                />
                              </Pressable>
                              <Image
                                style={styles.imageStyle2}
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
                                style={styles.addIcon}
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
                        <Text style={styles.textAddIcon}>
                          Upload screenshot{' '}
                          <Text style={{fontFamily: fonts.regularFont}}>
                            (optional)
                          </Text>
                        </Text>
                      </Pressable>
                    )}
                  </View>
                )}
              </View>

              <View>
                <Pressable
                  onPress={() => {
                    setCollapsed2(!collapsed2);
                    setCollapsed(true);
                    setCollapsed3(true);
                    setCollapsed4(true);
                  }}
                  style={styles.viewRowQuestion}>
                  <Text style={styles.textQuestion}>{question2}</Text>
                  {collapsed2 ? (
                    <Image
                      style={styles.arrowRight}
                      source={require('../../assets/images/arrowRightBlue.png')}
                    />
                  ) : (
                    <Image
                      style={styles.arrowRight}
                      source={require('../../assets/images/arrowDownBlue.png')}
                    />
                  )}
                </Pressable>
                {!collapsed2 && (
                  <View style={styles.viewAnswer}>
                    <TextInput
                      style={styles.inputAnswer}
                      value={description2}
                      multiline
                      placeholder="Have an idea for us? Let us know!"
                      placeholderTextColor={'#808491'}
                      onChangeText={e => setDescription2(e)}
                    />
                  </View>
                )}
              </View>

              <View>
                <Pressable
                  onPress={() => {
                    setCollapsed3(!collapsed3);
                    setCollapsed(true);
                    setCollapsed2(true);
                    setCollapsed4(true);
                  }}
                  style={styles.viewRowQuestion}>
                  <Text style={styles.textQuestion}>{question3}</Text>
                  {collapsed3 ? (
                    <Image
                      style={styles.arrowRight}
                      source={require('../../assets/images/arrowRightBlue.png')}
                    />
                  ) : (
                    <Image
                      style={styles.arrowRight}
                      source={require('../../assets/images/arrowDownBlue.png')}
                    />
                  )}
                </Pressable>
                {!collapsed3 && (
                  <View style={styles.viewAnswer}>
                    <TextInput
                      style={styles.inputAnswer}
                      value={description3}
                      multiline
                      placeholder="This will help us make it even better :)"
                      placeholderTextColor={'#808491'}
                      onChangeText={e => setDescription3(e)}
                    />
                  </View>
                )}
              </View>

              <View>
                <Pressable
                  onPress={() => {
                    setCollapsed4(!collapsed4);
                    setCollapsed(true);
                    setCollapsed2(true);
                    setCollapsed3(true);
                  }}
                  style={styles.viewRowQuestion}>
                  <Text style={styles.textQuestion}>{question4}</Text>
                  {collapsed4 ? (
                    <Image
                      style={styles.arrowRight}
                      source={require('../../assets/images/arrowRightBlue.png')}
                    />
                  ) : (
                    <Image
                      style={styles.arrowRight}
                      source={require('../../assets/images/arrowDownBlue.png')}
                    />
                  )}
                </Pressable>
                {!collapsed4 && (
                  <View style={styles.viewAnswer}>
                    <TextInput
                      style={styles.inputAnswer}
                      value={description4}
                      multiline
                      placeholder="We’ll reconsider if the feature is still useful"
                      placeholderTextColor={'#808491'}
                      onChangeText={e => setDescription4(e)}
                    />
                  </View>
                )}
              </View>

              <Pressable
                onPress={() => {
                  if (
                    description.trim() === '' &&
                    description2.trim() === '' &&
                    description3.trim() === '' &&
                    description4.trim() === ''
                  ) {
                    ToastMessage('Please enter your feedback');
                    return;
                  }
                  onSubmit();
                }}
                style={{
                  ...styles.viewButton,
                  opacity:
                    description.trim() === '' &&
                    description2.trim() === '' &&
                    description3.trim() === '' &&
                    description4.trim() === ''
                      ? 0.5
                      : 1,
                }}>
                <Text style={styles.textButton}>Share feedback</Text>
              </Pressable>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </TouchableWithoutFeedback>
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
    padding: scaleNew(15),
    borderTopEndRadius: scaleNew(20),
    borderTopStartRadius: scaleNew(20),

    maxHeight: '90%',
  },
  viewCross: {
    width: scaleNew(27),
    height: scaleNew(27),
    alignSelf: 'flex-end',
    marginTop: scaleNew(10),
  },
  imageStyle: {
    width: scaleNew(83),
    height: scaleNew(83),
    alignSelf: 'center',
    marginTop: scaleNew(14),
  },
  title: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(21),
    color: '#444444',
  },
  textDesc: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(14),
    color: '#808491',
  },
  subtitle: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: '#595959',
    textAlign: 'center',

    marginTop: scaleNew(12),
  },
  viewButton: {
    marginTop: scaleNew(50),
    backgroundColor: '#124698',
    borderRadius: scaleNew(10),
    height: scaleNew(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleNew(50),
  },
  textButton: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(16),
    color: colors.white,

    includeFontPadding: false,
  },
  viewRowQuestion: {
    borderRadius: scaleNew(20),
    backgroundColor: colors.white,
    paddingHorizontal: scaleNew(18),
    paddingVertical: scaleNew(21),
    marginTop: scaleNew(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textQuestion: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: colors.blue1,
    maxWidth: '90%',
    includeFontPadding: false,
  },
  arrowRight: {
    width: scaleNew(17),
    height: scaleNew(17),
    resizeMode: 'contain',
  },
  viewAnswer: {
    borderRadius: scaleNew(20),
    backgroundColor: colors.white,
    padding: scaleNew(12),
    marginTop: scaleNew(8),
  },
  inputAnswer: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(14),
    color: '#808491',
    height: scaleNew(90),
    textAlignVertical: 'top',
  },
  viewRemoveImage: {
    position: 'absolute',
    top: scale(4),
    right: scale(10),
    zIndex: 10,

    borderRadius: 100,
  },
  closeImage: {
    width: scaleNew(20),
    height: scaleNew(20),
  },
  imageStyle2: {
    width: scaleNew(90),
    height: scaleNew(90),
    borderRadius: scaleNew(5),
    marginRight: scaleNew(5),
  },
  addIcon: {
    width: scaleNew(45),
    height: scaleNew(45),

    marginStart: scaleNew(6),
  },
  textAddIcon: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(12),
    color: colors.blue1,
    marginStart: scaleNew(3),
    includeFontPadding: false,
  },
});
