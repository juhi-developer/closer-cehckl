/* eslint-disable react-native/no-inline-styles */
import {
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
    Platform,
    Keyboard,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { APP_IMAGE, MOMENT_KEY } from '../../../../utils/constants';
import { scale } from '../../../../utils/metrics';
import { fonts } from '../../../../styles/fonts';
import MomentComment from '../../../../components/MomentComment';
import { AWS_URL_S3 } from '../../../../utils/urls';
import { globalStyles } from '../../../../styles/globalStyles';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { ToastMessage } from '../../../../components/toastMessage';
import { VARIABLES } from '../../../../utils/variables';
import { colors } from '../../../../styles/colors';
import { useNetInfo } from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { AddAnswerQa } from '../../../../redux/actions';
import ProfileImageGradient from './ProfileImageGradient';

import ViewShot from 'react-native-view-shot';
import { shareUrlImageStory } from '../../../../utils/helpers';
import ChoiceGradientButton from './ChoiceGradientButton';
import { useAppContext } from '../../../../utils/VariablesContext';
import { scaleNew } from '../../../../utils/metrics2';
const CleverTap = require('clevertap-react-native');
import LinearGradient from 'react-native-linear-gradient';


import quizTypeConfig from '../../play/quizTypeConfig';
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { ParallaxImage } from 'react-native-snap-carousel';

// const data = [
//     { id: '1', type: 'couch', title: 'Future Fantasies', desc: '5 questions quiz together to answer all about your combined future!' },
//     { id: '2', type: 'just_talk', title: 'Anoqweqwther Card', desc: '2 questions quiz together to answer all about your combined future!' },
//     { id: '3', type: 'tales_of_us', title: 'sqs Card', desc: '4 questions quiz together to answer all about your combined future!' },
//     { id: '4', type: 'who_s_more_likely', title: 'Anoqsq ther Card', desc: '1 questions quiz together to answer all about your combined future!' },
// ];

import QuizCard from '../../play/QuizCard';


export default function QuizCardComp({
    addComment,
    askPartnerInput,
    setAskPartnerInput,
    navigation,
    dataSourceCords,
    disabled,
    loading,
    setLoading,
    QnAData,
    hornyMode,
}) {
    const dispatch = useDispatch();
    const netInfo = useNetInfo();
    // const {hornyMode} = useAppContext();
    const ref = useRef();

    const [takeScreenshot, setTakeScreenshot] = useState(false);


    const quesType = QnAData?.type;

    const cardColor = QnAData?.colorcode;
    let titleColor,
        descriptionColor,
        buttonColor,
        bottomBg,
        bgColor,
        archiveColor;


    switch (cardColor) {
        case 'green':
            titleColor = colors.golden;
            descriptionColor = colors.warmWhite;
            buttonColor = colors.quizTextGreen;
            bottomBg = colors.commentBgQuiz;
            bgColor = colors.greenBgQuiz;
            archiveColor = colors.quizTextGreen;
            break;
        case 'golden':
            titleColor = colors.greenBgQuiz;
            descriptionColor = colors.lightBlack;
            buttonColor = '#E1AE5C';
            bottomBg = '#FCD18A';
            archiveColor = '#E1AE5C';
            bgColor = '#FDC56B';
            break;
        case 'orange':
            titleColor = colors.warmWhite;
            descriptionColor = colors.lightBlack;
            buttonColor = '#CD875F';
            archiveColor = '#CD875F';
            bottomBg = '#F8B88F';

            bgColor = '#F8A271';
            break;
        case 'pink':
            titleColor = colors.greenBgQuiz;
            descriptionColor = colors.lightBlack;
            buttonColor = '#DAB7AF';
            archiveColor = '#DAB7AF';
            bottomBg = '#FCDFD4';

            bgColor = '#FDD8D0';
            break;
        default:
            titleColor = colors.golden;
            descriptionColor = colors.warmWhite;
            buttonColor = colors.quizTextGreen;
            archiveColor = colors.quizTextGreen;
            bottomBg = colors.commentBgQuiz;

            bgColor = colors.greenBgQuiz;
    }

    if (hornyMode) {
        bgColor = '#3C1859';
        descriptionColor = 'rgba(189, 189, 189, 1)';
        buttonColor = '#4D2777';
        bottomBg = 'rgb(86, 48, 138)';
        titleColor = 'rgba(224, 224, 224, 1)';
        archiveColor = 'rgba(224, 224, 224, 1)';
    }

    const questypeComment = QnAData?.type === 'comment';
    let hasBothAnswered;
    if (quesType === 'choice') {
        hasBothAnswered =
            QnAData?.user2?.choice !== undefined &&
            QnAData?.user1?.choice !== undefined;
    } else {
        hasBothAnswered =
            QnAData?.user2?.answer !== undefined &&
            QnAData?.user1?.answer !== undefined;
    }

    let quiz = QnAData;
    let isAnswered = false;
    let isPartnerAnswered = false;
    let isBothAnswered = false;

     useEffect(() => {
        // on mount
        if (takeScreenshot === true) {
            ref.current.capture().then(uri => {
                shareUrlImageStory({
                    image: uri,
                }).finally(res => {
                    CleverTap.recordEvent('Quiz cards shared');

                    setTakeScreenshot(false);
                });
            });
        }
        setTimeout(() => {
            setTakeScreenshot(false);
        }, 1000);
    }, [takeScreenshot]);

    if (quiz?.user1?.id) {
        if (quiz?.user1?.id === VARIABLES.user?._id) {
            isAnswered =
                quiz?.user1?.answer === VARIABLES.user?._id ? 'user' : 'partner';
        } else {
            isPartnerAnswered =
                quiz?.user1?.answer === VARIABLES.user?._id ? 'user' : 'partner';
        }
    }

    if (quiz?.user2?.id) {
        if (quiz?.user2?.id === VARIABLES.user?._id) {
            isAnswered =
                quiz?.user2?.answer === VARIABLES.user?._id ? 'user' : 'partner';
        } else {
            isPartnerAnswered =
                quiz?.user2?.answer === VARIABLES.user?._id ? 'user' : 'partner';
        }
    }
    if (isAnswered && isPartnerAnswered) {
        isBothAnswered = true;
    }

    let answer = '';

    const userAnswer =
        QnAData?.type === 'option'
            ? QnAData?.user1?.answer
            : QnAData?.user1?.choice;
    const partnerAnswer =
        QnAData?.type === 'option'
            ? QnAData?.user2?.answer
            : QnAData?.user2?.choice;

    if (userAnswer !== undefined && partnerAnswer !== undefined) {
        if (userAnswer === partnerAnswer) {
            answer = 'Amazing! You both think alike!';
        } else {
            answer = 'Oops, both of you think differently!';
        }
    } else {
        if (partnerAnswer !== undefined) {
            answer = `${VARIABLES.user?.partnerData?.partner?.name} has answered!`;
        } else if (userAnswer !== undefined) {
            answer = 'You have answered!';
        }
    }
 
    const handlePressChoice = choice => {
        if (disabled) {
            return;
        }
        if (VARIABLES.disableTouch) {
            ToastMessage('Please add a partner to continue');
            return;
        }
        if (QnAData?.user1?.choice === undefined) {
            let data = { choice: choice, type: hornyMode ? 'Horny' : 'QnA' };
            if (!netInfo.isConnected) {
                ToastMessage('Network issue :(', 'Please Check Your Network !');
                return;
            }
            setLoading(true);
            if (hornyMode) {
                CleverTap.recordEvent('Hm Quiz answered: Yes No');
                CleverTap.recordEvent('Hm quiz cards answered');
                CleverTap.recordEvent('Quiz cards answered');
                CleverTap.recordEvent('Quiz answered: Yes No');
            }
            dispatch(AddAnswerQa(data));
        }
    };



    //  Start here 

    const carouselRef = useRef(null);
    const [cards, setCards] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);


    useEffect(() => {
        setCards(QnAData);
    }, [QnAData]);



    const [currentIndex, setCurrentIndex] = useState(0);



    // Render each card
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
    const { width: screenWidth } = Dimensions.get('window');
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

    //  Emd here  

    return (
        <Pressable
            onLayout={event => {
                dataSourceCords[MOMENT_KEY.quiz] = event.nativeEvent.target;
            }}
            key={MOMENT_KEY.quiz}
            // onPress={() => {
            //   if (questypeComment) {
            //     navigation.navigate('commentsQnA', {
            //       item: QnAData,
            //       disabled: disabled,
            //       input: askPartnerInput,
            //     });
            //   }
            // }}
            style={styles.pressableContainer}>


            {cards && cards.length > 0 && (

                <View style={stylesNew.container}>
                    <View style={stylesNew.quizCardMain}>
                        <View style={stylesNew.shuffleButtonMain}>

                            <Carousel
                                ref={carouselRef}
                                data={[...Array(10)].flatMap(() => cards)}
                                renderItem={renderQuizCard}
                                sliderWidth={screenWidth - 25}
                                itemWidth={screenWidth * 0.9}
                                layout='default'
                                height={scale(260)}
                                inactiveSlideScale={0.95} // Slightly larger inactive slides for better visibility
                                inactiveSlideOpacity={0.8} // Adjust opacity for inactive slides
                                onSnapToItem={(index) => setActiveIndex(index)}
                                loop={true}
                                onSwiped={(index) => setCurrentIndex(index + 1)}
                                onSwipedAll={() => console.log("No more cards left")}
                                cardIndex={currentIndex}
                                backgroundColor={"transparent"}
                                stackSeparation={-10} // Make sure back cards are slightly visible (e.g., 1px or more)
                                infinite={true} // Keep it infinite
                                scrollInterpolator={_scrollInterpolator}
                                slideInterpolatedStyle={animatedStyles}
                            />
                            <TouchableOpacity style={stylesNew.shuffleButton}
                                onPress={() => {
                                    if (carouselRef.current) {
                                        carouselRef.current.snapToNext();
                                    }
                                }}
                            >
                                 <Image source={require('../../../../assets/images/quiz/shuffle-new.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}



        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        //   height: scale(268),
        width: scale(396),
        marginHorizontal: scale(16),
        marginTop: scale(24),
        paddingHorizontal: scale(25),
        justifyContent: 'space-evenly',
        paddingBottom: scale(140),
        paddingTop: scale(10),
        backgroundColor: colors.greenBgQuiz,
        borderRadius: scale(20),
        overflow: 'hidden',
    },
    knowBetterLabel: {
        ...globalStyles.regularLargeText,
        color: colors.blue9,
        marginTop: scale(8),
        fontSize: scale(18),
    },
    whoAnswered: {
        padding: scale(4),
        paddingHorizontal: scale(6),
        backgroundColor: 'rgba(255,255,255,0.24)',
        position: 'absolute',
        bottom: scale(10),
        right: scale(10),
        borderRadius: scale(20),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.commentBgQuiz,
        marginTop: scale(16),
        borderRadius: scale(12),
        paddingStart: scale(12),
    },
    callsMoreLabel: {
        ...globalStyles.regularLargeText,
        color: colors.white,
        marginTop: scale(8),
        marginBottom: scale(24),
        fontSize: scale(18),
        //  width: scale(230),
        lineHeight: scale(31),
        // marginEnd:40
    },
    userProfileImage: {
        width: scale(82),
        height: scale(82),
        borderRadius: scale(41),
    },

    commentUserContainer: {
        flexDirection: 'row',
        backgroundColor: colors.red2,
        padding: scale(12),
        borderRadius: scale(10),
        alignItems: 'center',
        marginVertical: scale(10),
    },
    commentUserImage: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: colors.grey10,
    },
    commentContainer: {
        flexDirection: 'row',
        marginStart: 10,
        flex: 1,
    },
    comment: {
        ...globalStyles.regularMediumText,
        marginTop: scale(16),
        marginEnd: scale(6),
    },
    commentTimeStamp: {
        ...globalStyles.regularSmallText,
        opacity: 0.5,
    },

    viewMoreCommment: {
        ...globalStyles.regularMediumText,
        textDecorationLine: 'underline',
    },

    pressableContainer: {
        overflow: 'hidden',
        marginTop: scale(23),
        marginHorizontal: scaleNew(16),
        borderRadius: 16,

        // height: scale(276),
    },
    cardContainer: {
        backgroundColor: colors.greenBgQuiz,
        overflow: 'hidden',
        paddingHorizontal: scale(16),
        paddingBottom: scale(24),
        paddingTop: scale(16),
        borderRadius: 16,
    },
    archiveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        end: scale(22),
        top: scale(14),
        zIndex: 10,
    },
    archiveText: {
        fontFamily: fonts.regularFont,
        fontSize: scale(12),
        color: '#3F6339',
        marginStart: scale(4),
        includeFontPadding: false,
    },
    titleText: {
        fontFamily: fonts.regularSerif,
        fontSize: scaleNew(18),
    },
    questionText: {
        fontFamily: fonts.regularFont,
        fontSize: scaleNew(16),
        color: colors.white,
        marginTop: scaleNew(8),
        lineHeight: scaleNew(24),
    },
    viewMoreComments: {
        fontFamily: fonts.regularFont,
        fontSize: scale(12),
        color: colors.white,
        marginTop: scale(10),
        textDecorationLine: 'underline',
    },
    input: {
        //  paddingVertical: scale(16),
        color: colors.white,
        flex: 1,
        fontFamily: Platform.OS === 'android' ? fonts.lightFont : fonts.regularFont,
        paddingTop: Platform.OS === 'ios' ? scale(2) : scale(4),
        paddingBottom: -scale(8),
        fontSize: scaleNew(14),
        //   marginTop: 16,
    },
    sendButton: {
        padding: 10,
    },
    sendIcon: {
        width: scale(22),
        height: scale(22),
        tintColor: colors.white,
    },
    viewScreenshot: {
        position: 'absolute',
        end: scale(20),
        top: scale(20),
        zIndex: 20,
    },
    viewMainQuiz: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginVertical: scale(4),
        zIndex: 10,
        marginTop: scaleNew(14),
        marginBottom: scaleNew(16),
    },
    viewBothSame: {
        position: 'absolute',
        bottom: 0,
        width: SCREEN_WIDTH,
        // backgroundColor: 'rgb(217, 235, 226)',
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleNew(45),
        paddingStart: scale(15),
    },
    textBothSame: {
        ...globalStyles.standardLargeText,
        fontSize: scaleNew(13),
        fontFamily: fonts.standardFont,
        includeFontPadding: false,
    },
    imgConfetti: { width: 30, height: 30, marginRight: 3 },
    viewArchive: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        end: scale(22),
        bottom: scale(10),
        zIndex: 10,
    },
    viewBottomOther: {
        position: 'absolute',
        bottom: 0,
        width: SCREEN_WIDTH - scale(32),
        backgroundColor: colors.commentBgQuiz,
        height: scaleNew(45),
        justifyContent: 'center',
    },
    textBottomOther: {
        ...globalStyles.regularLargeText,
        //   textAlign: 'center',
        //  padding: scaleNew(12),
        fontSize: scaleNew(13),
        marginStart: scaleNew(15),
        color: colors.white,
    },
    viewMainTypeChoice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: scale(14),
        marginBottom: scale(50),
        paddingEnd: scaleNew(20),
    },
    textTypeChoice: {
        fontFamily: fonts.italicCaveat,
        fontSize: scale(21),
        color: colors.white,
    },
    viewTypeChoice: {
        paddingHorizontal: scale(26),
        height: scale(38),
        borderRadius: scale(16),
        backgroundColor: '#6E8F68',
        justifyContent: 'center',
        alignItems: 'center',
    },
});



const stylesNew = StyleSheet.create({
    container: {
        // padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
    },

    playButtonMain: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },

    shuffleButtonMain: {
        position: 'relative',

    },

    shuffleButton: {

        position: 'absolute',
        left: '45%',
        bottom: 10,
        zIndex: 5,
        // elevation: 5, // For Android

    },

    playButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "flex-end",
        backgroundColor: "#FF9A8B",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        width: 80,
        justifyContent: 'center',
        marginTop: 10,

    },
    shuffleText: {
        padding: 5,
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    card: {
        padding: 20,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardContent: {
        padding: 20,
        borderRadius: 10,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#7e6d5e",
    },
    quizTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#343434",
        marginVertical: 5,
    },
    description: {
        fontSize: 14,
        color: "#242424",
        padding: 2,
        marginBottom: 20,
        fontWeight: '500', // Medium weight
        lineHeight: 20,
        maxWidth: '90%', // Limits width to 90% of the parent container
        alignSelf: 'flex-start', // Ensures it doesn't stretch full width
    },


    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    textContainer: {
        flex: 1, // Takes up remaining space
        padding: 2
    },
    iconContainer: {
        width: '20%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    image: {
        width: '100%', // Ensures it fits inside the container
        // height: 40, // Adjust height as needed
        resizeMode: 'contain',
    },

    quizCardMain: {
        marginBottom: 20,
    }
});
