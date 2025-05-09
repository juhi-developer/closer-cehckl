/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
//import {Modal} from 'react-native-js-only-modal';
import Modal from 'react-native-modal';
import API from '../../redux/saga/request';
import OverlayLoader from '../overlayLoader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {Image as CompressedImage} from 'react-native-compressor';
import {generateID, uploadToS3BUCKET} from '../../utils/helpers';
import {launchImageLibrary} from 'react-native-image-picker';
import {scale} from '../../utils/metrics';
import {ToastMessage} from '../toastMessage';
import TermsAndconditions from '../TermsAndconditions';
import {API_BASE_URL} from '../../utils/urls';

export default function ReportAbuseModal(props) {
  const {setModalVisible, modalVisible, onClose} = props;

  const [privacyPolicy, setprivacyPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [feedbackImages, setFeedbackImages] = useState([]);

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
          console.log('s3 response', s3response);
          if (s3response) {
            responses.push(s3response.response);
            // responses.push({
            //   url: filename,
            // });
          } else {
            console.log('error feedback images', s3response);
          }
        }
      }
      console.log('responses s3', responses);

      const data = {
        description: description,
        files: responses,
      };

      const resp = await API('user/auth/report', 'POST', data);
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

  const isSubmitDisabled =
    feedbackImages.length === 0 || description.trim() === '';

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={modalVisible}
      onBackdropPress={() => {
        onDismiss();
      }}
      onBackButtonPress={() => {
        onDismiss();
      }}
      style={styles.modal}>
      <OverlayLoader visible={loading} />
      <View style={styles.container}>
        <Pressable onPress={onDismiss} style={styles.closeButton}>
          <Image source={require('../../assets/images/closeWhiteBg.png')} />
        </Pressable>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          enabled
          contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Report abuse</Text>

          <Text style={styles.howToReport}>
            <Text style={styles.boldText}>How to report:</Text> If you believe
            your partner has indulged in abusive behaviour or shared content
            that is objectionable to you, you can report such an incident in our
            white message box below. Please share details and screenshots for
            our reference, since we cannot access data shared on Closer.
          </Text>

          <Text style={styles.important}>
            <Text style={styles.boldText}>IMPORTANT - What happens next:</Text>{' '}
            If your partner’s conduct is found to be abusive or objectionable
            (as per our guidelines), both of your profiles would be unpaired and
            logged out. You (and your partner) will not be able to access any
            data shared in Closer till now. You can use Closer again by making a
            new pairing connection with a new (or the same) partner.
          </Text>
          <Pressable
            onPress={() => {
              setprivacyPolicy(true);
            }}
            style={{
              marginTop: scaleNew(10),
            }}>
            <Text style={styles.guidelines}>
              Check out our guidelines for abusive behaviour
            </Text>
          </Pressable>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={description}
              multiline
              placeholder={
                'Share details of objectionable content or\nabusive behaviour'
              }
              placeholderTextColor={'#808491'}
              onChangeText={e => setDescription(e)}
            />

            {feedbackImages.length > 0 ? (
              <>
                <View style={styles.imageContainer}>
                  {feedbackImages.map((image, index) => (
                    <View key={index}>
                      <Pressable
                        style={styles.imageCloseButton}
                        onPress={() => {
                          setFeedbackImages(prevImages =>
                            prevImages.filter((item, i) => i !== index),
                          );
                        }}>
                        <Image
                          style={styles.imageCloseIcon}
                          source={require('../../assets/images/closeWhiteBg.png')}
                        />
                      </Pressable>
                      <Image
                        style={styles.feedbackImage}
                        source={{
                          uri: image.url,
                        }}
                      />
                    </View>
                  ))}
                  {feedbackImages.length < 3 && (
                    <Pressable onPress={onSelectImages}>
                      <Image
                        style={styles.addImageIcon}
                        source={require('../../assets/images/addIconFeedback.png')}
                      />
                    </Pressable>
                  )}
                </View>
              </>
            ) : (
              <Pressable onPress={onSelectImages} style={styles.uploadButton}>
                <Image
                  source={require('../../assets/images/addIconFeedback1.png')}
                />
                <Text style={styles.uploadText}>
                  Upload screenshot{' '}
                  <Text style={styles.optionalText}>(optional)</Text>
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeModalButton}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (!isSubmitDisabled) {
                  onSubmit();
                }
              }}
              style={[
                styles.submitButton,
                isSubmitDisabled && styles.submitButtonDisabled,
              ]}
              disabled={isSubmitDisabled}>
              <Text style={styles.submitButtonText}>Yes I'm sure</Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
        {
          <TermsAndconditions
            isVisible={privacyPolicy}
            setIsVisible={setprivacyPolicy}
            redirectUrl={`${API_BASE_URL}privacyPolicy`}
          />
        }
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  container: {
    flex: 1,
    maxHeight: '92%',
    backgroundColor: '#F9F1E6',
    borderTopEndRadius: scaleNew(20),
    borderTopStartRadius: scaleNew(20),
    paddingTop: scaleNew(24),
    paddingBottom: scaleNew(8),
    paddingHorizontal: scaleNew(24),
  },
  closeButton: {
    width: scaleNew(27),
    height: scaleNew(27),
    alignSelf: 'flex-end',
  },
  scrollViewContent: {
    paddingBottom: scaleNew(60),
  },
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(26),
    color: '#444444',
    lineHeight: scaleNew(33),
  },
  howToReport: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: '#595959',
    marginTop: scaleNew(8),
  },
  boldText: {
    fontFamily: fonts.boldFont,
  },
  important: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: '#595959',
    marginTop: scaleNew(8),
  },
  guidelines: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(14),
    color: '#808491',

    textDecorationLine: 'underline',
  },
  inputContainer: {
    borderRadius: scaleNew(20),
    backgroundColor: colors.white,
    paddingHorizontal: scaleNew(12),
    paddingBottom: scaleNew(12),
    paddingTop: scaleNew(4),
    marginTop: scaleNew(20),
  },
  textInput: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(14),
    color: '#808491',
    height: scaleNew(90),
    textAlignVertical: 'top',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageCloseButton: {
    position: 'absolute',
    top: scale(4),
    right: scale(10),
    zIndex: 10,
    borderRadius: 100,
  },
  imageCloseIcon: {
    width: scaleNew(20),
    height: scaleNew(20),
  },
  feedbackImage: {
    width: scaleNew(90),
    height: scaleNew(90),
    borderRadius: scaleNew(5),
    marginRight: scaleNew(5),
  },
  addImageIcon: {
    width: scaleNew(45),
    height: scaleNew(45),
    marginStart: scaleNew(6),
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(12),
    color: colors.blue1,
    marginStart: scaleNew(3),
    includeFontPadding: false,
  },
  optionalText: {
    fontFamily: fonts.regularFont,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(20),
  },
  closeModalButton: {
    flex: 1,
    height: scale(50),
    borderWidth: 1,
    borderColor: colors.blue1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
    marginEnd: scale(7),
  },
  closeModalButtonText: {
    fontFamily: fonts.standardFont,
    fontSize: scale(14),
    color: colors.blue1,
  },
  submitButton: {
    flex: 1,
    height: scale(50),
    //  borderWidth: 1,
    borderColor: '#E6515D',
    backgroundColor: '#E6515D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
    marginStart: scale(7),
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(230, 81, 93, 0.52)',
    //  borderColor: 'rgba(230, 81, 93, 0.52)',
  },
  submitButtonText: {
    fontFamily: fonts.standardFont,
    fontSize: scale(14),
    color: colors.white,
  },
  viewButton: {
    marginTop: scaleNew(40),
    backgroundColor: '#E6515D',
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
