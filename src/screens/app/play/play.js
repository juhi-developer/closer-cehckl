/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  Pressable,
  Text,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { scale } from '../../../utils/metrics';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { getInputRangeFromIndexes, Pagination } from 'react-native-snap-carousel';
import { FlatList } from 'react-native-gesture-handler';
import { AWS_URL_S3 } from '../../../utils/urls';
import { VARIABLES } from '../../../utils/variables';
import { useSocket } from '../../../utils/socketContext';
import quizTypeConfig from './quizTypeConfig'; // Assuming this is the correct path to your config file

import QuizCard from './QuizCard';
import PairingScreen from './PairingScreen'; // Import the new component

const fallbackImage = require('../../../assets/images/quiz/dummyImgUserLarge.png'); // Fallback image

import styles from './playStyle';


const getProfileImage = (profilePic) => {
  return profilePic ? { uri: `${AWS_URL_S3}${profilePic}` } : fallbackImage;
};
const PlayScreen = ({ navigation }) => {
  const { socket } = useSocket();

  const userId = VARIABLES.user?._id;
  const partnerId = VARIABLES.user?.partnerData?.partner?._id;

  if (!userId || !partnerId) {
    return <PairingScreen />;
  }


  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const screenWidth = Dimensions.get('window').width;
  const [activeMenu, setActiveMenu] = useState('couch'); // Track the active menu
  const [cards, setCards] = useState([]);
  const [activeSwitch, setActiveSwitch] = useState('');

  useEffect(() => {
    getQuizData('couch');
    setActiveSwitch('yourTurn');
  }, []);

  useEffect(() => {
    getQuizRememberQuizData(1);
  }, [activeSwitch]);


  useEffect(() => {
    const handleQuizData = (response) => {
      try {
        let playData = response.playData;
        if (playData) {
          setCards(playData);
        }
      } catch (error) {

      }
    };
    const handleAllQuizData = (response) => {
      try {
        let playData = response.quizzes;
        if (playData) {
          setQuizData(playData);
        }
      } catch (error) {

      }
    };
    socket.on('getallQuizData', handleAllQuizData); // Listen for the response
    socket.on('getMyQuizMessage', handleQuizData); // Listen for the response
  });


  const getQuizRememberQuizData = (type) => {
    const payload = {
      limit: '10',
      type: type,
      userId: VARIABLES.user?._id,
      partnerId: VARIABLES.user.partnerData.partner._id,
      tabLayout: activeSwitch,
    };
    socket.emit('myQuizData', payload); // Emit the event to the server
  };

  const getQuizData = async (type) => {
    try {
      const payload = {
        limit: '10',
        type: type,
        userId: VARIABLES.user?._id,
      };
      socket.emit('allQuizData', payload); // Emit the event to the server
    } catch (error) {
      console.log("****************");
      console.error(error);
    }
  };
  const darkenColor = (color, amount) => {
    let colorValue = color.replace('#', '');
    if (colorValue.length === 3) {
      colorValue = colorValue.split('').map(c => c + c).join('');
    }
    const num = parseInt(colorValue, 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    const b = Math.max(0, (num & 0x0000FF) - amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };

  const renderItemData = (item) => {
    const config = quizTypeConfig[item?.type] || quizTypeConfig.couch; // Use quizTypeConfig for gradient colors
    const randomOpacity = Math.random() * (1 - 0.5) + 0.9; // Generate a random opacity between 0.5 and 1
    return (<Pressable
      key={item._id}
      onPress={() => {
        navigation.navigate('quizOpen', {
          item: item,
        });
      }}
    >
      <LinearGradient
        colors={config.bgcolorMain} // Gradient colors from config
        locations={[0, 0.9]} // Adjust gradient stops
        useAngle={true}
        angle={180}
        style={[styles.card, { opacity: randomOpacity, gap: 5, flexDirection: 'column' }]} // Add opacity to the card
      >

        {item && (
          <View style={styles.icon}>
            <View style={{ alignItems: 'center', }}>
              <Text  >{item.icon || '😂'}</Text>
            </View>
          </View>
        )}
        {item?.collectionName && (
          <Text
            style={{
              ...styles.title,
              color: darkenColor(config.bgcolorMain[0], 200), // Darken the color by 30

            }}

          >
            {item.collectionName}
          </Text>
        )}

      </LinearGradient>
    </Pressable>
    );
  };


  const renderQuizCard = ({ item }) => {
    let type = item?.quizId?.type;
    const config = quizTypeConfig[type] || quizTypeConfig.couch;
    return (
      <QuizCard
        key={item.id}
        item={item}
        config={config}
        navigation={navigation}
      />
    );
  };
  _scrollInterpolator = (index, carouselProps) => {
    const range = [3, 2, 1, 0, -1];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
  }

  animatedStyles = (index, animatedValue, carouselProps) => {
    const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
    const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

    return {
      zIndex: carouselProps.data.length - index,
      opacity: animatedValue.interpolate({
        inputRange: [2, 3],
        outputRange: [1, 0]
      }),
      transform: [{
        rotate: animatedValue.interpolate({
          inputRange: [-1, 0, 1, 2, 3],
          outputRange: ['-25deg', '0deg', '-3deg', '1.8deg', '0deg'],
          extrapolate: 'clamp'
        })
      }, {
        [translateProp]: animatedValue.interpolate({
          inputRange: [-1, 0, 1, 2, 3],
          outputRange: [
            -sizeRef * 0.5,
            0,
            -sizeRef, // centered
            -sizeRef * 2, // centered
            -sizeRef * 3 // centered
          ],
          extrapolate: 'clamp'
        })
      }]
    };
  }

  // Enhanced sample data for cards
  const sampleCards = [
    {
      id: '1',
      title: 'Weekly goal',
      subtitle: 'In 4 days',
      progress: 50, // Example progress value
      borderColor: '#FF5733', // Example custom border color

    },
    {
      id: '2',
      title: '56 🔥',
      subtitle: 'Longest streak',

    },
    {
      id: '3',
      title: '106 💪',
      subtitle: 'Quiz activities',

    },
  ];

  // Use sampleCards if cards array is empty

  return (
    <ScrollView style={{
      backgroundColor: '#fff'
    }} >

      <LinearGradient
        colors={['#D1F6E6', '#CFE8F1']}
        locations={[0, 1]} // Must be between 0 and 1

        //        locations={[0, 5]} // Start and end points of the gradient
        useAngle={true}
        angle={180}
        style={[styles.container, styles.newContainer]}
      >

        <View style={styles.playSection}>
          <View style={styles.playHeader}>
            <Text style={styles.playTitle}>Play</Text>
            <Text style={styles.fireIcon}>🔥 5</Text>
          </View>

          {/* Weekly Goal Card */}
          <View style={styles.playMainContainr}>
            <Carousel
              ref={carouselRef}
              data={sampleCards} // Use the displayCards array
              renderItem={({ item }) => (
                <View style={styles.goalCard}>
                  <Text style={styles.goalText}>{item.title}</Text>
                  <Text style={styles.subText}>{item.subtitle}</Text>
                  {
                    item.progress && (<View
                      style={[
                        styles.progressCircle,
                        {
                          borderColor: item.borderColor || '#FF5733', // Use custom border color or default
                          borderWidth: item.progress ? item.progress / 10 : 4, // Dynamic progress width
                        },
                      ]}
                    ></View>
                    )
                  }

                </View>
              )}
              sliderWidth={screenWidth - 25}
              itemWidth={screenWidth * 0.7}
              layout="default"

              height={scale(120)}
              onSnapToItem={(index) => setActiveIndex(index)} // Track active index
            />
            <Pagination
              dotsLength={sampleCards.length} // Number of dots
              activeDotIndex={activeIndex} // Active dot index
              containerStyle={{ paddingVertical: 8 }} // Adjust container style
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 4,
                backgroundColor: '#FF5733', // Active dot color
              }}
              inactiveDotStyle={{
                backgroundColor: '#C4C4C4', // Inactive dot color
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.8}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={{ backgroundColor: '#fff7f2z' }}>
        <View style={{ marginTop: 20 }}>

          <View style={styles.switchContainer}>
            <Pressable
              style={[
                styles.switchButton,
                activeSwitch === 'yourTurn' && styles.activeSwitchButton,
              ]}
              onPress={() => setActiveSwitch('yourTurn')}
            >
              <Image
                source={getProfileImage(VARIABLES.user?.profilePic)}
                style={styles.switchImage}
              />
              {
                activeSwitch === 'yourTurn' && <Text
                  style={[
                    styles.switchText,
                    activeSwitch === 'yourTurn' && styles.activeSwitchText,
                  ]}
                >
                  Your turn
                </Text>
              }
            </Pressable>
            <Pressable
              style={[
                styles.switchButton,
                activeSwitch === 'partner' && styles.activeSwitchButton,
              ]}
              onPress={() => setActiveSwitch('partner')}
            >
              <Image
                source={getProfileImage(VARIABLES.user?.partnerData?.partner?.profilePic)}
                style={styles.switchImage}
              />
              {
                activeSwitch === 'partner' && <Text
                  style={[
                    styles.switchText,
                    activeSwitch === 'partner' && styles.activeSwitchText,
                  ]}
                >
                  {`${VARIABLES.user?.partnerData?.partner?.name}'s turn`}
                </Text>
              }
            </Pressable>
            <Pressable
              style={[
                styles.switchButton,
                activeSwitch === 'archive' && styles.activeSwitchButton,
              ]}
              onPress={() => setActiveSwitch('archive')}
            >
              <Text
                style={[
                  styles.switchText,
                  activeSwitch === 'archive' && styles.activeSwitchText,
                ]}
              >
                Archive
              </Text>
            </Pressable>
          </View>

          {cards.length > 0 && (
            <View style={styles.container}>
              <View style={styles.quizCardMain}>
                <View style={styles.shuffleButtonMain}>
                  <Carousel
                    ref={carouselRef}
                    data={[...Array(10)].flatMap(() => cards)}
                    renderItem={renderQuizCard}
                    sliderWidth={screenWidth - 0}
                    itemWidth={screenWidth * 0.8}
                    layout='default'
                    height={scale(230)}
                    inactiveSlideScale={0.95} // Slightly larger inactive slides for better visibility
                    inactiveSlideOpacity={0.8} // Adjust opacity for inactive slides
                    onSnapToItem={(index) => setActiveIndex(index)}
                    loop={true}
                    onSwiped={(index) => setCurrentIndex(index + 1)}
                    onSwipedAll={() => console.log("No more cards left")}
                    cardIndex={currentIndex}
                    backgroundColor={"transparent"}
                    stackSeparation={0} // Make sure back cards are slightly visible (e.g., 1px or more)
                    infinite={true} // Keep it infinite
                    keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
                  />

                </View>
                <Pressable
                  onPress={() => navigation.navigate('quizList', {
                    item: cards,
                  })} // Replace 'QuizList' with the actual route name for the quiz list page
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 2 }}>
                    <Text style={{ marginRight: 8, color: '#000' }}>{cards.length}+ more</Text>
                    <Image
                      source={require('../../../assets/images/quiz/Union.png')} // Ensure the path is correct
                      // source={require('../../../assets/images/Union.png')} // Ensure the path is correct
                      style={{ resizeMode: 'cover' }} // Adjust size as needed
                    />
                  </View>
                </Pressable>

              </View>
            </View>
          )}

        </View>
      </View>
      <View style={styles.container}>

        {/* Discover Header */}
        <Text style={styles.header}>Discover</Text>
        {/* Top Icons */}
        <View style={styles.row}>
          <View style={[styles.iconRow]}>
            {Object.entries(quizTypeConfig).map(([key, config], index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setQuizData([]);
                  setActiveMenu(key);
                  getQuizData(key);
                }} // Set the active menu on press
              >
                <LinearGradient
                  colors={config.bgcolorMain}
                  locations={[0, 0.9]}
                  useAngle={true}
                  angle={130}
                  style={styles.iconButton}
                >
                  <View style={[styles.labelWrap, { width: activeMenu === key ? 150 : 40 }]}>
                    <Image source={config.icon} style={[styles.iconImage]} />
                    {activeMenu === key && ( // Only display the title if this menu is active
                      <Text style={styles.iconText}>{config.title}</Text>
                    )}
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>
        {/* Cards Grid */}
        <FlatList
          data={quizData}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
          numColumns={2}
          renderItem={({ item, index }) => {
            // Determine the row index (0-based)
            const rowIndex = Math.floor(index / 2);
            // Swap widths based on even or odd row
            const isEvenRow = rowIndex % 2 === 0;
            const itemStyle = index % 2 === 0
              ? isEvenRow ? styles.item40 : styles.item60
              : isEvenRow ? styles.item60 : styles.item40;
            return (
              <View style={[itemStyle, { margin: 2 }]} key={index}>
                {renderItemData(item)}
              </View>
            );
          }}
          columnWrapperStyle={styles.row}
        />
      </View>
    </ScrollView>
  );
};

export default PlayScreen;
