/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import {scaleNew} from '../../../../utils/metrics2';
import {APP_IMAGE} from '../../../../utils/constants';
import {VARIABLES} from '../../../../utils/variables';
import {ToastMessage} from '../../../../components/toastMessage';
import {scale} from '../../../../utils/metrics';
import {colors} from '../../../../styles/colors';
import {fonts} from '../../../../styles/fonts';

const CleverTap = require('clevertap-react-native');

export default function CTAComp({
  toolTipCurrentState,
  setToolTipCurrentState,
  initialApi,
  notesCompRef,
  hornyMode,

  StoryImageUploading,
  setPickerType,

  setGalleryAndCameraModal,
  onSelectImages,
  eveningMode,
  navigation,
}) {
  return (
    <View style={styles.viewMainActions}>
      <Tooltip
        closeOnChildInteraction={false}
        backgroundColor={'rgba(0,0,0,0.8)'}
        closeOnContentInteraction={false}
        closeOnBackgroundInteraction={false}
        useInteractionManager={true}
        disableShadow
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        childrenWrapperStyle={{
          backgroundColor: '#E9FFFE',
          borderRadius: 12,
        }}
        isVisible={
          toolTipCurrentState === null && initialApi === false ? true : false
        }
        contentStyle={{
          width: scaleNew(312),
          height: scaleNew(224),
          borderRadius: scaleNew(16),
          padding: scaleNew(15),
        }}
        content={
          <View>
            <Image
              style={{
                resizeMode: 'cover',
                width: scaleNew(282),
                height: scaleNew(83.54),
              }}
              source={require('../../../../assets/images/tooltipImage1.png')}
            />
            <Text style={styles.toolTipText}>
              A cute note? A reminder? Or anything else? Leave stickies for your
              partner, that stay for a day
            </Text>

            <View style={styles.viewTooltipBottom}>
              <Image
                style={{
                  resizeMode: 'contain',
                }}
                source={require('../../../../assets/images/pageIndicator1.png')}
              />
              <Pressable
                onPress={() => {
                  setToolTipCurrentState(1);
                }}
                style={styles.buttonTooltip}>
                <Text style={styles.buttonTextTooltip}>Next</Text>
              </Pressable>
            </View>
          </View>
        }
        placement="bottom"
        onClose={() => setToolTipCurrentState(1)}>
        <Pressable
          onPress={() => {
            if (toolTipCurrentState === null) {
              return;
            }
            if (notesCompRef.current) {
              notesCompRef.current.externalFunction();
              CleverTap.recordEvent('Stickies tapped');
            }
          }}>
          <View
            style={[
              styles.viewAction,
              hornyMode
                ? {
                    backgroundColor: '#FFFFFF10',
                    borderColor: '#FFFFFF20',
                    shadowColor: '#00000045',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 3.84,

                    elevation: 5,
                    borderRadius: 12,
                  }
                : {
                    backgroundColor: eveningMode ? '#FFFFFF35' : colors.white,
                    borderColor: eveningMode ? '#00000009' : '#EDEDED',
                    shadowColor: '#00000045',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,

                    elevation: 2,
                  },
            ]}>
            <Image
              source={APP_IMAGE.topBarStickies}
              style={{
                width: scaleNew(42),
                height: scaleNew(42),
                resizeMode: 'contain',
              }}
            />
          </View>
          <Text
            style={[
              styles.textAction,
              hornyMode
                ? {color: '#BDBDBD'}
                : eveningMode
                ? {color: colors.white}
                : {},
            ]}>
            Stickies
          </Text>
        </Pressable>
      </Tooltip>

      <Tooltip
        closeOnChildInteraction={false}
        backgroundColor={'rgba(0,0,0,0.8)'}
        closeOnContentInteraction={false}
        closeOnBackgroundInteraction={false}
        useInteractionManager={true}
        disableShadow
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        childrenWrapperStyle={{
          backgroundColor: '#E9FFFE',
          borderRadius: 12,
        }}
        isVisible={
          toolTipCurrentState === 1 && initialApi === false ? true : false
        }
        contentStyle={{
          width: scaleNew(312),
          height: scaleNew(196),
          borderRadius: scaleNew(16),
          padding: scaleNew(15),
        }}
        content={
          <View>
            <Image
              style={{
                resizeMode: 'cover',
                width: scaleNew(282),
                height: scaleNew(45.23),
              }}
              source={require('../../../../assets/images/tooltipImage2.png')}
            />
            <Text
              style={{
                ...styles.toolTipText,
                marginTop: scaleNew(16),
              }}>
              How’re you feeling in this moment? Overwhelmed, excited, somewhere
              in between? Let your partner know!
            </Text>

            <View
              style={{
                ...styles.viewTooltipBottom,
                marginTop: scaleNew(16),
              }}>
              <Image
                style={{
                  resizeMode: 'contain',
                }}
                source={require('../../../../assets/images/pageIndicator2.png')}
              />
              <Pressable
                onPress={() => {
                  setTimeout(() => {
                    setToolTipCurrentState(2);
                  }, 200);
                }}
                style={styles.buttonTooltip}>
                <Text style={styles.buttonTextTooltip}>Next</Text>
              </Pressable>
            </View>
          </View>
        }
        placement="bottom"
        onClose={() => {
          setTimeout(() => {
            setToolTipCurrentState(2);
          }, 200);
        }}>
        <Pressable
          onPress={() => {
            if (toolTipCurrentState === 1) {
              return;
            }
            if (VARIABLES.disableTouch) {
              ToastMessage('Please add a partner to continue');
              return;
            }
            CleverTap.recordEvent('Well-being tapped');
            navigation.navigate('WellBeing');
          }}>
          <View
            style={[
              styles.viewAction,
              hornyMode
                ? {
                    backgroundColor: '#FFFFFF10',
                    borderColor: '#FFFFFF20',
                    shadowColor: '#00000045',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 3.84,

                    elevation: 5,
                    borderRadius: 12,
                  }
                : {
                    backgroundColor: eveningMode ? '#FFFFFF35' : colors.white,
                    borderColor: eveningMode ? '#00000009' : '#EDEDED',
                    shadowColor: '#00000045',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,

                    elevation: 2,
                  },
            ]}>
            <Image
              source={APP_IMAGE.topBarWellBein}
              style={{
                width: scaleNew(42),
                height: scaleNew(42),

                resizeMode: 'contain',
              }}
            />
          </View>
          <Text
            style={[
              styles.textAction,
              hornyMode
                ? {color: '#BDBDBD'}
                : eveningMode
                ? {color: colors.white}
                : {},
            ]}>
            Wellbeing
          </Text>
        </Pressable>
      </Tooltip>

      <Tooltip
        closeOnChildInteraction={false}
        backgroundColor={'rgba(0,0,0,0.8)'}
        closeOnContentInteraction={false}
        closeOnBackgroundInteraction={false}
        useInteractionManager={true}
        disableShadow
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        childrenWrapperStyle={{
          backgroundColor: '#E9FFFE',
          borderRadius: 12,
        }}
        isVisible={
          toolTipCurrentState === 2 && initialApi === false ? true : false
        }
        contentStyle={{
          width: scaleNew(330),
          height: scaleNew(214),
          borderRadius: scaleNew(16),
          padding: scaleNew(15),
        }}
        content={
          <View>
            <Image
              style={{
                resizeMode: 'cover',
                width: scaleNew(300),
                height: scaleNew(63),
              }}
              source={require('../../../../assets/images/tooltipImage3.png')}
            />
            <Text
              style={{
                ...styles.toolTipText,
                marginTop: scale(16),
              }}>
              A good breakfast, great work out,{'\n'}
              amazing views, or just a plain boring day{'\n'}- share more of
              your life in stories!
            </Text>

            <View
              style={{
                ...styles.viewTooltipBottom,
                marginTop: scale(16),
              }}>
              <Image
                style={{
                  resizeMode: 'contain',
                }}
                source={require('../../../../assets/images/pageIndicator3.png')}
              />
              <Pressable
                onPress={() => {
                  setTimeout(() => {
                    setToolTipCurrentState(3);
                  }, 200);
                }}
                style={styles.buttonTooltip}>
                <Text style={styles.buttonTextTooltip}>Next</Text>
              </Pressable>
            </View>
          </View>
        }
        placement="bottom"
        onClose={() => {
          setTimeout(() => {
            setToolTipCurrentState(3);
          }, 200);
        }}>
        <View>
          <Pressable
            onPress={() => {
              if (toolTipCurrentState === 2) {
                return;
              }
              if (VARIABLES.disableTouch) {
                ToastMessage('Please add a partner to continue');
                return;
              }
              if (StoryImageUploading) {
                ToastMessage('Please wait for story to upload');
                return;
              }
              setPickerType('user');

              setGalleryAndCameraModal(true);
              CleverTap.recordEvent('Stories tapped');
            }}
            style={[
              styles.viewAction,
              hornyMode
                ? {
                    backgroundColor: '#FFFFFF10',
                    borderColor: '#FFFFFF20',
                    shadowColor: '#00000045',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 3.84,

                    elevation: 5,
                    borderRadius: 12,
                  }
                : {
                    backgroundColor: eveningMode ? '#FFFFFF20' : colors.white,
                    borderColor: eveningMode ? '#00000009' : '#EDEDED',
                    shadowColor: '#00000045',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,

                    elevation: 2,
                  },
            ]}>
            <Image
              source={APP_IMAGE.topBarStories}
              style={{
                width: scaleNew(40),
                height: scaleNew(42),

                resizeMode: 'contain',
              }}
            />
          </Pressable>
          <Text
            style={[
              styles.textAction,
              hornyMode
                ? {color: '#BDBDBD'}
                : eveningMode
                ? {color: colors.white}
                : {},
            ]}>
            Stories
          </Text>
        </View>
      </Tooltip>

      <Tooltip
        closeOnChildInteraction={false}
        backgroundColor={'rgba(0,0,0,0.8)'}
        closeOnContentInteraction={false}
        closeOnBackgroundInteraction={false}
        useInteractionManager={true}
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        disableShadow
        childrenWrapperStyle={{
          backgroundColor: '#E9FFFE',
          borderRadius: 12,
        }}
        isVisible={
          toolTipCurrentState === 3 && initialApi === false ? true : false
        }
        contentStyle={{
          width: scaleNew(326.61),
          height: scaleNew(274),
          borderRadius: scaleNew(16),
          padding: scaleNew(15),
        }}
        content={
          <View>
            <Image
              style={{
                resizeMode: 'cover',
                width: scaleNew(296.61),
                height: scaleNew(148.3),
              }}
              source={require('../../../../assets/images/tooltipImage4.png')}
            />
            <Text
              style={{
                ...styles.toolTipText,
                marginTop: scaleNew(10),
              }}>
              Build your own private, shared home for memories, to cherish &
              reflect :)
            </Text>

            <View
              style={{
                ...styles.viewTooltipBottom,
                marginTop: scaleNew(16),
              }}>
              <Image
                style={{
                  resizeMode: 'contain',
                }}
                source={require('../../../../assets/images/pageIndicator4.png')}
              />
              <Pressable
                onPress={() => {
                  setTimeout(() => {
                    setToolTipCurrentState(4);
                  }, 200);
                }}
                style={styles.buttonTooltip}>
                <Text style={styles.buttonTextTooltip}>Next</Text>
              </Pressable>
            </View>
          </View>
        }
        placement="bottom"
        onClose={() => {
          setTimeout(() => {
            setToolTipCurrentState(4);
          }, 200);
        }}>
        <Pressable
          onPress={() => {
            CleverTap.recordEvent('Memories tapped');
            onSelectImages();
          }}>
          <View
            style={[
              styles.viewAction,
              hornyMode
                ? {
                    backgroundColor: '#FFFFFF10',
                    borderColor: '#FFFFFF20',
                    shadowColor: '#00000045',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 3.84,

                    elevation: 5,
                    borderRadius: 12,
                  }
                : {
                    backgroundColor: eveningMode ? '#FFFFFF25' : colors.white,
                    borderColor: eveningMode ? '#00000009' : '#EDEDED',
                    shadowColor: '#00000045',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,

                    elevation: 2,
                  },
            ]}>
            <Image
              source={APP_IMAGE.topBarFeed}
              style={{
                width: scaleNew(43),
                height: scaleNew(42),

                resizeMode: 'contain',
              }}
            />
          </View>
          <Text
            style={[
              styles.textAction,
              hornyMode
                ? {color: '#BDBDBD'}
                : eveningMode
                ? {color: colors.white}
                : {},
            ]}>
            Memories
          </Text>
        </Pressable>
      </Tooltip>
    </View>
  );
}

const styles = StyleSheet.create({
  viewMainActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: scale(28),
    marginHorizontal: scale(10),
  },
  viewAction: {
    width: scaleNew(82),
    height: scaleNew(82),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: scaleNew(12),
    borderColor: '#EDEDED',
    borderWidth: 1,
  },
  textAction: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(14),
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: scaleNew(4),
  },
  toolTipText: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(14),
    color: '#808491',
    marginTop: scaleNew(10),
  },
  viewTooltipBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scaleNew(11),
  },
  buttonTooltip: {
    backgroundColor: colors.blue1,
    borderRadius: scaleNew(100),
    height: scaleNew(32),
    paddingHorizontal: scaleNew(18),
    justifyContent: 'center',
  },
  buttonTextTooltip: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(14),
    color: colors.white,
  },
});
