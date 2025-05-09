import React, { Fragment, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Keyboard } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { VARIABLES } from '../../../utils/variables';
import { AWS_URL_S3 } from '../../../utils/urls';

import { useSocket } from '../../../utils/socketContext';
import quizTypeConfig from './quizTypeConfig'; // Assuming this is the correct path to your config file
import styles from './styles';
const fallbackImage = require('../../../assets/images/quiz/dummyImgUserLarge.png'); // Fallback image
import QuizCarousel from './QuizCarousel'; // Import the new component
import ChatFooter from './ChatFooter';
import RenderInputSection from '../../../components/RenderInputSection'; // Import the new component

const getProfileImage = (profilePic) => {
    return profilePic ? { uri: `${AWS_URL_S3}${profilePic}` } : fallbackImage;
};

const renderInputSection = (userAnswer, setUserAnswer, submitAnswer, config) => {
    return (
        <RenderInputSection
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            submitAnswer={submitAnswer}
            config={config}
        />
    );
};

const renderOptions = (optionsSubset, answerShow, onOptionSelect) => {


    return (
        <View style={styles.maincontainer}>
            {optionsSubset.map((option, index) => (
                <TouchableOpacity
                    key={option.id}
                    style={[
                        styles.option,
                        index % 2 === 0 ? styles.leftOption : styles.rightOption,
                        answerShow === option.storedb && styles.selectedOption, // Apply selected style if matched
                    ]}
                    onPress={() => onOptionSelect(option)}
                    disabled={answerShow === option.storedb} // Disable if already selected
                >
                    {option.image ? (
                        <Image source={option.image} style={styles.image} />
                    ) : (
                        <Text style={styles.emoji}>{option.emoji}</Text>
                    )}

                    <Text style={styles.label}>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const CoupleQuestionCard = (props) => {
    const { socket } = useSocket();
    const [activeSlide, setActiveSlide] = useState(0);
    const [itemData, setItemData] = useState([]); // Store `item` in state
    const carouselRef = useRef(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [questions, setQuestions] = useState([]);
    const scrollViewRef = useRef(null); // Create a ref for the ScrollView
    const [config, setConfig] = useState({}); // Use state for `config`


    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);



    useEffect(() => {
        getQuizDetailData('all');
    }, []);

    useEffect(() => {
        const handleQuizDetailData = (response) => {
            try {
                let data = response.playData[0];
                if (data) {
                    setItemData(data);
                    let type = data?.quizId?.type;
                    setConfig(quizTypeConfig[type]); // Update `config` state
                }
            } catch (error) {
                console.error("Error parsing quiz detail data:", error);
            }
        };
        socket.on('getquizDetail', handleQuizDetailData); // Listen for the response
    });

    const getQuizDetailData = async (type) => {
        try {
            const payload = {};
            if (props.route.params?.item?._id) {
                payload.id = props.route.params.item._id;
            }
            // if (props.route.params?.item?._id) {
            //     payload.quizId = props.route.params.item._id;
            // }
            if (props.route.params?.item?.quizId?._id) {
                payload.quizId = props.route.params.item.quizId._id;
            } else {
                if (props.route.params?.item?._id) {
                    payload.quizId = props.route.params.item._id;
                }
            }
            if (VARIABLES.user?._id) {
                payload.userId = VARIABLES.user._id;
            }
            if (VARIABLES.user?.partnerData?.partner?._id) {
                payload.partnerId = VARIABLES.user.partnerData.partner._id;
            }
            payload.type = 'create'; // Keep this as it seems to be a constant
            socket.emit('quizDetail', payload); // Emit the event to the server
            // const response = await API('user/moments/quiz/detail', 'POST', payload);
            // let data = response.body.data;
            // if (data) {
            //     setItemData(data.playData[0]);
            //     let type = data.playData[0]?.quizId?.type;
            //     setConfig(quizTypeConfig[type]); // Update `config` state
            // }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [itemData?.answers]);

    useEffect(() => {
        if (itemData?.quizId?.question && typeof itemData?.quizId?.question === "object") {
            // Convert the object to an array
            const questionsArray = Array.isArray(itemData?.quizId?.question)
                ? itemData.quizId.question // If it's already an array, use it directly
                : Object.values(itemData?.quizId?.question); // Convert object to array

            setQuestions(questionsArray);
        }
    }, [itemData?.quizId]);



    const submitAnswer = async () => {
        if (!userAnswer.trim()) {
            Alert("Please enter an answer before submitting.");
            return;
        }
        await submitAnswerApi(userAnswer); // Call the API to submit the answer
    };

    useEffect(() => {
        if (socket) {
            socket.on('getQuizMessage', (data) => {
                if (data?.playData) {
                    setItemData(data.playData[0]); // Update the item data
                    setUserAnswer(""); // Clear the input field
                } else {
                    Alert.alert("Failed to submit the answer. Please try again.");
                }
            });
        }
        return () => {
            if (socket) {
                socket.off('getQuizMessage'); // Clean up the event listener
            }
        };
    }, [socket, itemData]); // Add `itemData` to the dependency array
    // useEffect(() => {

    const submitAnswerApi = async (userAnswer) => {
        const payload = {
            playId: itemData._id, // Replace with the actual playId
            questionId: questions[activeSlide]._id || `question-${activeSlide}`,
            userId: VARIABLES.user?._id, // Replace with the actual userId
            partnerId: VARIABLES.user?.partnerData?.partner?._id, // Replace with the actual partnerId
            answer: userAnswer,
        };

        try {
            // Emit the payload to the server via socket
            socket.emit('quizPlayAnswer', payload, (response) => {
                if (response.success && response.data?.playData) {
                    setItemData(response.data.playData[0]); // Update the item data
                    setUserAnswer(""); // Clear the input field
                } else {
                    Alert.alert("Failed to submit the answer. Please try again.");
                }
            });
        } catch (error) {
            console.error("Socket error:", error);
            Alert.alert("Failed to submit the answer. Please try again.");
        }
    };

    const onClose = () => {
        if (userAnswer.trim()) {
            Alert.alert("Unsaved Changes", "You have unsaved changes. Are you sure you want to close?", [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => props.navigation.goBack(),
                },
            ]);
        } else {
            // If no unsaved changes, just go back
            props.navigation.goBack();

        }


    };


    const onOptionSelect = async (option) => {
        await submitAnswerApi(option.storedb);
        if (carouselRef.current && activeSlide < questions.length - 1) {
            carouselRef.current.snapToNext();
        }


    };
    // Sample options data


    const options = [
        { id: 1, storedb: 'partner', label: `${VARIABLES.user?.partnerData?.partner?.name}`, image: getProfileImage(VARIABLES.user?.partnerData?.partner?.profilePic) }, // Replace with actual image URL
        { id: 2, storedb: 'me', label: `${VARIABLES.user?.name}`, image: getProfileImage(VARIABLES.user?.profilePic) }, // Replace with actual image URL
        { id: 3, storedb: 'Both', label: 'Both', emoji: '🙌' },
        { id: 4, storedb: 'Neither', label: 'Neither', emoji: '😶' },
    ];

    if (!config.type) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#808491" />
                <Text style={{ fontSize: 18, color: '#808491', textAlign: 'center', marginTop: 20 }}>
                    Please wait, we are checking...
                </Text>
                <Text style={{ fontSize: 14, color: '#A0A4B0', textAlign: 'center', marginTop: 10, fontStyle: 'italic' }}>
                    This might take a few seconds.
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            {
                config.type && (
                    <Fragment>

                        {!isKeyboardVisible && (

                            <LinearGradient
                                colors={[
                                    `${config.bgcolorMain[0]}50`,
                                    `${config.bgcolorMain[1]}50`
                                ]}
                                useAngle={true}
                                angle={180} // Angle 180 makes the gradient flow from top to bottom
                                style={styles.headerContainer}
                            >


                                <View style={styles.headerContent}>
                                    <LinearGradient colors={config.bgcolorMain} locations={[0, 0.9]} useAngle={true} angle={180} style={styles.rounderBorder}>
                                        <View style={styles.labelContainer}>
                                            <Image source={config.icon} style={styles.image} />
                                            <Text style={styles.headerText}>{config.title}</Text>
                                        </View>
                                    </LinearGradient>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <Image source={require("../../../assets/images/quiz/close_24px.png")} style={styles.closeIcon} />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        )}
                        {/*  add this for sahdon */}
                        <LinearGradient
                            colors={[
                                `${config.bgcolorMain[0]}50`,
                                `${config.bgcolorMain[1]}50`,
                            ]}
                            useAngle={true}
                            angle={180} // Angle 180 makes the gradient flow from top to bottom
                        >

                            {!isKeyboardVisible && (

                                <View style={styles.headerBottomContainer}>
                                    {/* <Text style={styles.collectionNameText}>{itemData?.quizId?.collectionName}</Text> */}
                                    <View style={[
                                        styles.paginationContainer,
                                        {
                                            justifyContent: config.type === 'who_s_more_likely' ? "center" : "flex-start",
                                            alignItems: config.type === 'who_s_more_likely' ? "center" : "flex-start",
                                        }
                                    ]}>
                                        <Pagination
                                            dotsLength={questions.length}
                                            activeDotIndex={activeSlide}
                                            containerStyle={styles.paginationStyle}
                                            dotStyle={styles.dotStyle}
                                            inactiveDotStyle={styles.inactiveDotStyle}
                                            inactiveDotOpacity={0.4}
                                            inactiveDotScale={0.6}
                                        />
                                    </View>
                                </View>

                            )}
                        </LinearGradient>


                        <QuizCarousel
                            questions={questions}
                            itemData={itemData}
                            config={config}
                            activeSlide={activeSlide}
                            setActiveSlide={setActiveSlide}
                            carouselRef={carouselRef}
                            scrollViewRef={scrollViewRef}
                            submitAnswerApi={submitAnswerApi}
                            onOptionSelect={onOptionSelect}
                            user={VARIABLES.user}
                            renderOptions={renderOptions}
                            options={options}
                            renderInputSection={renderInputSection}
                            getProfileImage={getProfileImage}
                            isKeyboardVisible={isKeyboardVisible}
                        />

                        <ChatFooter
                            config={config}
                            activeSlide={activeSlide}
                            questions={questions}
                            carouselRef={carouselRef}
                            itemData={itemData}
                            userAnswer={userAnswer}
                            setUserAnswer={setUserAnswer}
                            submitAnswer={submitAnswer}
                            onOptionSelect={onOptionSelect}
                            setItemData={setItemData}
                            submitAnswerApi={submitAnswerApi}
                            props={props}
                            renderInputSection={renderInputSection}
                            isKeyboardVisible={isKeyboardVisible}


                        />
                        {/* </View> */}
                    </Fragment>

                )
            }
        </KeyboardAvoidingView>
    );
};


export default CoupleQuestionCard;
