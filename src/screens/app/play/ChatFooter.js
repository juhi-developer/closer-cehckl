import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, Alert, Dimensions, Keyboard } from 'react-native';
import styles from './styles';
import AudioSend from './audioSend';
import AudioPlay from './audioPlay';
import { VARIABLES } from '../../../utils/variables';

const ChatFooter = ({
    config,
    activeSlide,
    questions,
    carouselRef,
    itemData,
    userAnswer,
    setUserAnswer,
    submitAnswer,
    onOptionSelect,
    setItemData,
    submitAnswerApi,
    props,
    renderInputSection,
    isKeyboardVisible
}) => {


    return (
        <View>
            {config.type === 'just_talk' && (
                <AudioSend
                    data={itemData}
                    setItemData={setItemData}
                    questionsActiveId={questions[activeSlide]?._id}
                />
            )}

            {!isKeyboardVisible && (
                <View style={styles.inputContainer}>
                    <View style={[styles.buttonContainer, { justifyContent: 'space-between' }]}>
                        {activeSlide !== 0 && (
                            <TouchableOpacity
                                style={{
                                    borderStyle: 'solid',
                                    borderWidth: 1,
                                    borderColor: config.playButtonColor,
                                    padding: 10,
                                    borderRadius: 20,
                                    opacity: activeSlide === 0 ? 0.5 : 1,
                                }}
                                onPress={() => {
                                    if (carouselRef.current && activeSlide > 0) {
                                        carouselRef.current.snapToPrev();
                                    }
                                }}
                                disabled={activeSlide === 0}
                            >
                                <Text
                                    style={{
                                        color: config.playButtonColor,
                                        backgroundColor: '#FFF',
                                        paddingHorizontal: 10,
                                    }}
                                >
                                    Back
                                </Text>
                            </TouchableOpacity>
                        )}

                        {(config.type === 'couch' || config.type === 'who_s_more_likely') &&
                            questions.length - 1 > 0 && (
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: config.playButtonColor,
                                            padding: 10,
                                            borderRadius: 20,
                                        }}
                                        onPress={() => {
                                            if (activeSlide === questions.length - 1) {
                                                if (config.type === 'who_s_more_likely') {
                                                    let allAnswered =
                                                        itemData?.answers.length === questions.length &&
                                                        itemData?.answers.every((answer) => {
                                                            const userIds = answer.user_answers.map(
                                                                (userAnswer) => userAnswer.userId
                                                            );
                                                            return (
                                                                userIds.includes(VARIABLES.user?._id) &&
                                                                userIds.includes(
                                                                    VARIABLES.user?.partnerData?.partner?._id
                                                                )
                                                            );
                                                        });
                                                    if (allAnswered) {
                                                        props.navigation.navigate('summary', {
                                                            Playitem: itemData,
                                                        });
                                                    } else {
                                                        Alert.alert(
                                                            'Pending Answers',
                                                            'Some users have not completed the quiz yet.'
                                                        );
                                                    }
                                                } else {
                                                    Alert.alert(
                                                        'Quiz Completed',
                                                        'You have completed the quiz.',
                                                        [
                                                            {
                                                                text: 'OK',
                                                                onPress: () => props.navigation.goBack(),
                                                            },
                                                        ]
                                                    );
                                                }
                                            } else if (carouselRef.current) {
                                                carouselRef.current.snapToNext();
                                            }
                                        }}
                                    >
                                        <Text style={{ color: '#fff', paddingHorizontal: 20 }}>
                                            {activeSlide === questions.length - 1 ? 'Done' : 'Next'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                    </View>
                </View>
            )}

            {(config.type === 'tales_of_us' || config.type === 'couch') && (
                <View
                    style={{
                        backgroundColor: '#FFF',
                        marginVertical: 10,
                        marginHorizontal: 20,
                        padding: 10,
                        borderRadius: 5,
                    }}
                >
                    {config.type === 'tales_of_us' &&
                        (() => {
                            const relatedAnswer = itemData?.answers?.find(
                                (answer) => answer.questionId === questions[activeSlide]?._id
                            )?.user_answers;
                            const lastMessageUserId =
                                relatedAnswer?.[relatedAnswer.length - 1]?.userId;

                            let myKey = VARIABLES.user?.name;
                            let partnerKey = VARIABLES.user?.partnerData?.partner?.name;
                            let printName =
                                lastMessageUserId === VARIABLES.user?._id ? partnerKey : myKey;

                            if (lastMessageUserId === VARIABLES.user?._id) {
                                return (
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 2,
                                        }}
                                    >
                                        <Image
                                            source={require('../../../assets/images/quiz/cansend.png')}
                                            style={styles.closeIcon}
                                        />
                                        <Text
                                            style={[
                                                styles.questionText,
                                                {
                                                    color: '#363636',
                                                    fontSize: 18,
                                                    fontWeight: '400',
                                                    margin: 20,
                                                    textAlign: 'center',
                                                },
                                            ]}
                                        >
                                            {`It’s ${printName}’s turn, comeback after they add to the story`}
                                        </Text>
                                    </View>
                                );
                            }
                            return renderInputSection(
                                userAnswer,
                                setUserAnswer,
                                submitAnswer,
                                config
                            );
                        })()}
                    {config.type === 'couch' &&
                        renderInputSection(userAnswer, setUserAnswer, submitAnswer, config)}
                </View>
            )}
        </View>
    );
};

export default ChatFooter;
