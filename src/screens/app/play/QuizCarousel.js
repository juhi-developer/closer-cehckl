import React, { Fragment } from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import moment from 'moment';
import AudioPlay from './audioPlay';
import styles from './styles';

const QuizCarousel = ({
    questions,
    itemData,
    config,
    activeSlide,
    setActiveSlide,
    carouselRef,
    scrollViewRef,
    submitAnswerApi,
    onOptionSelect,
    user,
    renderOptions,
    options,
    getProfileImage,
    isKeyboardVisible,
}) => {


    return (
        <View style={styles.carouselContainer}>
            <Carousel
                ref={carouselRef}
                data={questions}
                renderItem={({ item, index }) => {
                    const relatedAnswer = itemData?.answers?.find(answer => answer.questionId === questions[activeSlide]?._id)?.user_answers;
                    const hasMyUserId = config.type === 'couch'
                        ? relatedAnswer?.some(answer => answer.userId === user?._id)
                        : true;

                    const myAnswer = relatedAnswer?.find(answer => answer.userId === user?._id);
                    const answerShow = myAnswer?.answer || null;

                    return (
                        <View style={{ maxHeight: Dimensions.get('window').height * 0.7 }}>


                            <LinearGradient
                                colors={[`${config.bgcolorMain[0]}50`, `${config.bgcolorMain[1]}50`, '#fff']}
                                useAngle={true}
                                angle={180}
                                style={{ paddingHorizontal: 20 }}
                            >
                                {!isKeyboardVisible && (
                                    <Text style={styles.questionText}>
                                        {`Q${index + 1}: ${item.question}`}
                                    </Text>
                                )}
                            </LinearGradient>

                            {config.type !== 'who_s_more_likely' && (
                                <ScrollView style={styles.multiAnswerContainer} ref={scrollViewRef}>
                                    {relatedAnswer?.map((answerData, idx) => {
                                        let ansData = {};
                                        if (answerData.answer_object) {
                                            try {
                                                ansData = typeof answerData.answer_object === 'string'
                                                    ? JSON.parse(answerData.answer_object)
                                                    : answerData.answer_object;
                                            } catch (error) {
                                                console.error('Invalid JSON:', error);
                                            }
                                        }
                                        const answerTime = ansData.answer_time
                                            ? moment(ansData.answer_time).fromNow()
                                            : 'Unknown time';

                                        return (
                                            <View key={idx} style={styles.answerContainer}>
                                                <Image
                                                    source={getProfileImage(
                                                        answerData.userId === itemData?.user1?._id
                                                            ? itemData?.user1?.profilePic
                                                            : itemData?.user2?.profilePic
                                                    )}
                                                    style={styles.senderPhoto}
                                                />
                                                <View style={styles.answerContent}>
                                                    {ansData.type === 'audio' ? (
                                                        <AudioPlay playItemData={answerData.answer} />
                                                    ) : (
                                                        <Text style={[styles.answerText, !hasMyUserId ? styles.blurredText : null]}>
                                                            {answerData.answer || 'No answer available'}
                                                        </Text>
                                                    )}
                                                    <Text style={styles.sendTime}>{answerTime}</Text>
                                                </View>
                                                <View style={styles.bottomBorder} />
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            )}

                            {config.type === 'who_s_more_likely' && (
                                <Fragment>
                                    {renderOptions(options.slice(0, 2), answerShow, onOptionSelect)}
                                    {renderOptions(options.slice(2, 4), answerShow, onOptionSelect)}
                                </Fragment>
                            )}

                            {!hasMyUserId && relatedAnswer?.length > 0 && (
                                <View>
                                    <Text style={styles.blurredText}>
                                        Submit your answer to reveal {user?.partnerData?.partner?.name}'s
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                }}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width}
                layout="default"
                onSnapToItem={(index) => setActiveSlide(index)}
            />
        </View>
    );
};

export default QuizCarousel;
