import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { VARIABLES } from '../../../utils/variables';
import { AWS_URL_S3 } from '../../../utils/urls';
import API from '../../../redux/saga/request';

const fallbackImage = require('../../../assets/images/quiz/dummyImgUserLarge.png'); // Fallback image

const getProfileImage = (profilePic) => {
  return profilePic ? { uri: `${AWS_URL_S3}${profilePic}` } : fallbackImage;
};

const QuizCard = ({ item, config, navigation }) => {

  // console.log("gggggg",config);
  const title = item?.quizId?.collectionName || '';
  const type = item?.quizId?.type || '';
  const idReminderSend = item?.idReminderSend || false; // Check if the reminder has been sent
  let msg =
    Array.isArray(item?.quizId?.question) && item.quizId.question.length > 0
      ? item.quizId.question[0]?.question || ''
      : typeof item?.quizId?.question === 'string'
        ? item.quizId.question
        : '';

  if (type === 'couch' || type === 'who_s_more_likely') {
    msg = item?.quizId?.description || 'ABC'
  }
  let relatedAnswer = item?.answers?.[0]?.user_answers;

  let hasMyUserId = relatedAnswer?.some(answer => answer.userId === VARIABLES.user?._id);
  let hasMyPartnerId = relatedAnswer?.some(answer => answer.userId === VARIABLES.user?.partnerData?.partner?._id);

  const handleImagePress = async () => {
    try {
      const payload = {};

      if (item?._id) {
        payload.playId = item?._id;
      }
      if (item?.quizId?._id) {
        payload.quizId = item?.quizId?._id;
      }

      payload.userId = VARIABLES.user?._id;
      payload.partnerUserId = VARIABLES.user?.partnerData?.partner?._id;



      const response = await API('user/moments/quiz/reminder', 'POST', payload);
      let data = response.body.data;
      if (data) {


      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Pressable
      key={item.id}
      onPress={() => {
        navigation.navigate('quizOpen', {
          item: item,
        });
      }}
    >
      <LinearGradient
        colors={config.bgcolorMain}
        locations={[0, 1]} // Start and end points of the gradient
        useAngle={true}
        angle={180}
        style={[stylesNew.container, stylesNew.newContainer]}
      // colors={config.bgcolorMain}
      // locations={[0, 0.9]}
      // useAngle={true}
      // angle={130}
      // style={[stylesNew.container, stylesNew.newContainer]}
      >
        <View style={stylesNew.cardContent}>

          <View style={stylesNew.rowContainer}>
            <View style={stylesNew.textContainer}>
              <Text style={stylesNew.subtitle}>{config.title}</Text>
              <Text style={stylesNew.quizTitle}>{title}</Text>
              <Text
                style={[stylesNew.quizMessage, { height: 38, color: '#242424' }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {msg}

              </Text>
            </View>
            <View style={stylesNew.iconContainer}>
              <Image source={config.icon} style={stylesNew.image} />
            </View>
          </View>
          <Text style={stylesNew.description}>{item.desc}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              {
                (hasMyUserId) && (
                  <View style={styles.userContainer}>
                    <Image
                      source={getProfileImage(VARIABLES.user?.profilePic)}
                      style={styles.profileImage}
                    />
                    <Image
                      source={require("../../../assets/images/quiz/Group1000005858.png")}
                      style={styles.badgeIcon}
                    />
                  </View>
                )}

              {hasMyPartnerId && (
                <View style={styles.partnerContainer}>
                  <Image
                    source={getProfileImage(VARIABLES.user?.partnerData?.partner?.profilePic)}
                    style={styles.profileImage}
                  />
                  <Image
                    source={require("../../../assets/images/quiz/Group1000005858.png")}
                    style={styles.badgeIconSmall}
                  />
                </View>
              )}
            </View>


            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, position: 'relative' }}>



              {
                (hasMyPartnerId && !hasMyUserId) || (!hasMyPartnerId && hasMyUserId) ? (

                  <View style={stylesNew.playButtonMain}>
                    {
                      (hasMyPartnerId && !hasMyUserId) && (
                        <View style={styles.userRemainderContainer}>
                          <Image
                            source={getProfileImage(VARIABLES.user?.profilePic)}
                            style={[styles.profileImage, { zIndex: 1 }]}
                          />

                          <TouchableOpacity onPress={handleImagePress} style={styles.profileRemainderImage}>
                            <Image
                              source={require("../../../assets/images/quiz/Frame087327686.png")}

                            />
                          </TouchableOpacity>

                        </View>
                      )}
                    {(!hasMyPartnerId && hasMyUserId) && (
                      <View style={styles.userRemainderContainer}>
                        <Image
                          source={getProfileImage(VARIABLES.user?.partnerData?.partner?.profilePic)}
                          style={[styles.profileImage, { zIndex: 1 }]}
                        />
                        <TouchableOpacity onPress={handleImagePress} style={styles.profileRemainderImage}>
                          <Image
                            source={require("../../../assets/images/quiz/Frame087327686.png")}

                            style={{
                              resizeMode: 'stretch',
                            }}
                          />
                        </TouchableOpacity>

                      </View>
                    )}
                  </View>
                ) :
                  <View style={stylesNew.playButtonMain}>
                    <TouchableOpacity
                      style={[stylesNew.playButton, { backgroundColor: config.playButtonColor }]}
                      onPress={() => {
                        navigation.navigate('quizOpen', {
                          item: item,
                        });
                      }}
                    >
                      <Text style={stylesNew.shuffleText}>Play</Text>
                    </TouchableOpacity>
                  </View>
              }

            </View>

          </View>



          {
            (idReminderSend) && (
              <View>
                <Text style={{
                  fontFamily: "Poppins",
                  fontWeight: "300",
                  fontStyle: "italic",
                  fontSize: 10,
                  lineHeight: 16,
                  letterSpacing: 0,
                  color: "#808491", // Add a suitable color if needed
                  textAlign: "center", // Optional alignment
                }}>
                  Reminder sent
                </Text>
              </View>
            )
          }
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default QuizCard;


const styles = {
  userContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
  },
  partnerContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizMessage: {
    fontFamily: 'Poppins', // Updated font family
    fontWeight: '500', // Updated font weight
    fontSize: 14, // Updated font size
    lineHeight: 20, // Updated line height
    letterSpacing: 0, // Updated letter spacing
    color: '#242424', // Retained existing color

  },
  userRemainderContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginRight: 30,
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#ffffff', // White border
  },
  badgeIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    // width: 20,
    // height: 20,
    borderRadius: 15,
  },
  badgeIconSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    // width: 15,
    // height: 15,
    borderRadius: 15,
  },
  profileRemainderImage: {
    width: 35,
    height: 35,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffffff', // White border
    position: 'absolute',
    bottom: 0,
    left: 25,
    zIndex: 0,

  },
};

const stylesNew = StyleSheet.create({
  container: {
    borderRadius: 2,
  },
  switchImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  newContainer: {
    borderRadius: 15,
    marginBottom: 15,
  },
  playButtonMain: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 80,
    justifyContent: 'center',
  },
  shuffleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 20,
    borderRadius: 10,
    // width: 351, // Updated width
    height: 200, // Updated height
  },
  subtitle: {
    fontSize: 10, // Updated font size
    fontWeight: '600', // Updated font weight
    color: '#7e6d5e', // Existing color
    lineHeight: 20, // Added line height
    letterSpacing: 0, // Added letter spacing
    textTransform: 'uppercase', // Added text transform
    fontFamily: 'Poppins', // Added font family
    width: 125, // Added width
    height: 20, // Added height
    marginBottom: 6, // Added gap equivalent
  },
  quizTitle: {
    fontFamily: 'Poppins', // Updated font family
    fontWeight: 'bold', // Updated font weight
    fontSize: 16, // Updated font size
    lineHeight: 24, // Updated line height
    letterSpacing: 0, // Updated letter spacing
    color: '#343434', // Retained existing color
    marginVertical: 5, // Retained existing margin
  },
  description: {
    fontSize: 14,
    color: '#242424',
    // marginBottom: 1,
    fontWeight: '500',
    lineHeight: 20,
    maxWidth: '90%',
    alignSelf: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the top
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    padding: 2,
  },
  iconContainer: {
    width: 40, // Updated width
    height: 40, // Updated height
    borderRadius: 56, // Updated border radius for circular shape
    alignSelf: 'flex-start', // Position the container at the top
    marginTop: 0, // Ensure no extra margin at the top
    overflow: 'hidden', // Ensure content stays within the circular shape
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
});