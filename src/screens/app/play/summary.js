import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, Image, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import quizTypeConfig from './quizTypeConfig';
import { VARIABLES } from '../../../utils/variables';
import API from '../../../redux/saga/request';
import { AWS_URL_S3 } from '../../../utils/urls';
import Svg, { Circle } from "react-native-svg";

const SummaryScreen = (props) => {
    const screenWidth = Dimensions.get("window").width;
    const [config, setConfig] = useState({}); // Use state for `config`
    const [itemData, setItemData] = useState([]); // Store `item` in state
    const [preparedData, setPreparedData] = useState([]); // Store `item` in state

    useEffect(() => {
        getQuizDetailData();
    }, []);

    const calculateMatchingPercentage = () => {
        if (!preparedData || preparedData.length === 0) return 0;

        let matchingCount = 0;

        preparedData.forEach((optionData) => {
            const userAnswer = optionData.options[0]?.answer; // User's answer
            const partnerAnswer = optionData.options[1]?.answer; // Partner's answer

            if (userAnswer === partnerAnswer) {
                matchingCount++;
            }
        });

        return Math.round((matchingCount / preparedData.length) * 100); // Calculate percentage
    };


    const getQuizDetailData = async () => {
        try {
            const payload = {};
            if (props.route.params?.Playitem?._id) {
                payload.Playid = props.route.params.Playitem._id;
            }
            payload.type = 'create'; // Keep this as it seems to be a constant
            const response = await API('user/moments/quiz/detail', 'POST', payload);
            let data = response.body.data;
            if (data) {
                let arrayManage = data.playData[0];
                setItemData(arrayManage);
                setConfig(quizTypeConfig[arrayManage?.quizId?.type] || {}); // Update `config` state


                const preparedData = arrayManage.quizId.question.map((questionItem, questionIndex) => {
                    const answerItem = arrayManage.answers.find(answer => answer.questionId === questionItem._id);

                    return {
                        question: questionItem.question, // Assuming questionItem has a 'question' field
                        options: answerItem?.user_answers || [], // Extract user_answers from the corresponding answer
                    };

                });

                setPreparedData(preparedData); // Set the prepared data in state
            }
        } catch (error) {
            console.error(error);
        }
    };

    const matchPercentage = calculateMatchingPercentage();


    const radius = 50; // Radius of the circle
    const strokeWidth = 15; // Thickness of the arc
    const circumference = 2 * Math.PI * radius; // Full circle length
    const strokeDashoffset = circumference - (circumference * matchPercentage) / 100; // Arc length based on percentage




    return (
        <ScrollView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {config.type && (
                <Fragment>
                    <LinearGradient
                        colors={[
                            `${config.bgcolorMain[0]}50`,
                            `${config.bgcolorMain[1]}50`
                        ]}
                        useAngle={true}
                        angle={180}
                        style={styles.headerContainer}
                    >
                        <View style={styles.headerContent}>
                            <LinearGradient
                                colors={config.bgcolorMain}
                                locations={[0, 0.9]}
                                useAngle={true}
                                angle={180}
                                style={styles.rounderBorder}
                            >
                                <View style={styles.labelContainer}>
                                    <Image source={config.icon} style={styles.image} />
                                    <Text style={styles.headerText}>{itemData?.quizId?.collectionName}</Text>
                                    {/* <Text style={styles.headerText}>{config.title}</Text> */}
                                </View>
                            </LinearGradient>
                            <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.closeButton}>
                                <Image
                                    source={require("../../../assets/images/quiz/close_24px.png")}
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 30, marginVertical: 10 }}>
 
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Svg width={120} height={120} viewBox="0 0 120 120">
                                    {/* Background Gray Circle */}
                                    <Circle
                                        cx="60"
                                        cy="60"
                                        r={radius}
                                        stroke="#d6dbe6" // Gray color
                                        strokeWidth={strokeWidth}
                                        fill="none"
                                    />
                                    {/* Progress Arc - Blue */}
                                    <Circle
                                        cx="60"
                                        cy="60"
                                        r={radius}
                                        stroke="#6cafeb" // Blue color
                                        strokeWidth={strokeWidth}
                                        fill="none"
                                        strokeDasharray={circumference} // Full circle path
                                        strokeDashoffset={strokeDashoffset} // Set offset for progress
                                        strokeLinecap="round" // Rounded ends
                                        transform="rotate(-90 60 60)" // Rotate to start from top
                                    />
                                </Svg>
                            </View>


                            {/* <View
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: 100,
                                    overflow: "hidden",
                                    flexDirection: "row",
                                    borderColor: "#d6dbe6",
                                    borderWidth: 20,
                                }}
                            >
                                <View
                                    style={{
                                        width: leftWidth,
                                        borderWidth: 20,
                                        borderColor: "#6cafeb",
                                    }}
                                />
                            </View> */}


                            <View>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: "#343434", textAlign: "left", marginVertical: 5 }}>
                                    {calculateMatchingPercentage()}%

                                </Text>
                                <Text style={{ fontSize: 14, color: "#343434", fontWeight: '500', textAlign: "left"  }}>
                                    Answered same
                                </Text>
                                <View style={{ flexDirection: "row", marginVertical: 20, gap: 10 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
                                        <View style={{
                                            width: 15, // Small size
                                            height: 15, // Small size
                                            backgroundColor: "#6cafeb", borderColor: "#6cafeb", borderWidth: 1, padding: 2, borderRadius: 50, // Correctly added borderRadius
                                        }}>
                                        </View>
                                        <Text style={{ fontSize: 14, color: "#343434", textAlign: "center", marginVertical: 10 }}>Same</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
                                        <View style={{
                                            width: 15, // Small size
                                            height: 15, // Small size
                                            backgroundColor: "#d6dbe6", borderColor: "#d6dbe6", borderWidth: 1, padding: 2, borderRadius: 50, // Correctly added borderRadius
                                        }}>
                                        </View>
                                        <Text style={{ fontSize: 14, color: "#343434", textAlign: "center", marginVertical: 10 }}>Different</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            {preparedData.map((optionData, optionIndex) => {


                                let myAnswerData = optionData.options?.find(answer => answer.userId === VARIABLES.user?._id);
                                let myAnswer = myAnswerData?.answer || null; // Use null or any default value
                                let partnerAnswerData = optionData.options?.find(answer => answer.userId === VARIABLES.user.partnerData.partner._id);
                                let partnerAnswer = partnerAnswerData?.answer || null; // Use null or any default value



                                return (
                                    <View
                                        key={optionIndex}
                                        style={{
                                            alignItems: "center",
                                            backgroundColor: "#fbfcfd",
                                            padding: 15,
                                            borderRadius: 10,
                                            margin: 5,
                                            borderWidth: optionData.isSelected ? 2 : 1,
                                            borderColor: optionData.isSelected ? "#4CAF50" : "#ddd",
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 10,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#ddd",
                                                padding: 10,
                                                margin: 10,
                                            }}
                                        >
                                            <Text style={{ fontSize: 14, color: "#343434" }}>
                                                {optionIndex + 1}.
                                            </Text>
                                            <Text style={{ fontSize: 14, color: "#343434" }}>
                                                {optionData.question}
                                             </Text>
                                        </View>


                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 10,
                                        }}>
                                            <View
                                                style={{
                                                    backgroundColor: myAnswer === partnerAnswer ? "#dceaf8" : "#eaedf3", // Conditional background color
                                                    padding: 10,
                                                    borderRadius: 5,
                                                    marginVertical: 5,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 10,
                                                    width: 150,
                                                }}
                                            >

                                                <View style={{ position: 'relative' }}>
                                                    <Image
                                                        source={{ uri: `${AWS_URL_S3}${VARIABLES.user?.profilePic}` }}
                                                        style={{ width: 25, height: 25, borderRadius: 25 }}
                                                    />
                                                    <Image
                                                        source={require("../../../assets/images/quiz/Group1000005858.png")}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: -5,
                                                            right: -5,
                                                            width: 15,
                                                            height: 15,
                                                            borderRadius: 15,
                                                        }}
                                                    />
                                                </View>
                                                <Text style={{ fontSize: 14, color: "#343434" }}>
 
                                                    {(() => {

                                                        if (myAnswer === "partner") {
                                                            return VARIABLES.user?.partnerData?.partner?.name;
                                                        }
                                                        if (myAnswer === "me") {
                                                            return VARIABLES.user?.name;
                                                        }
                                                        return myAnswer;
                                                    })()}

                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    backgroundColor: myAnswer === partnerAnswer ? "#dceaf8" : "#eaedf3", // Conditional background color
                                                    padding: 10,
                                                    borderRadius: 5,
                                                    marginVertical: 5,
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 10,
                                                    width: 150,
                                                }}
                                            >

                                                <View style={{ position: 'relative' }}>
                                                    <Image
                                                        source={{ uri: `${AWS_URL_S3}${VARIABLES.user?.partnerData?.partner?.profilePic}` }}
                                                        style={{ width: 25, height: 25, borderRadius: 25 }}
                                                    />
                                                    <Image
                                                        source={require("../../../assets/images/quiz/Group1000005858.png")}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: -5,
                                                            right: -5,
                                                            width: 15,
                                                            height: 15,
                                                            borderRadius: 15,
                                                        }}
                                                    />
                                                </View>

                                                <Text style={{ fontSize: 14, color: "#343434" }}>
                                                    {(() => {
                                                        if (partnerAnswer === "partner") {
                                                            return VARIABLES.user?.partnerData?.partner?.name;
                                                        }
                                                        if (partnerAnswer === "me") {
                                                            return VARIABLES.user?.name;
                                                        }
                                                        return partnerAnswer || "not available";
                                                    })()}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }
                            )}
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", padding: 20 }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: config.playButtonColor,
                                    padding: 10,
                                    borderRadius: 20,
                                }}
                                onPress={() => {

                                    props.navigation.navigate("play");
                                }}
                            >
                                <Text style={{
                                    color: '#fff',
                                    paddingHorizontal: 20,
                                }}>
                                    Done
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </Fragment>
            )}
        </ScrollView>
    );
};

const styles = {
    container: { flex: 1, backgroundColor: "#FFF", marginTop: 40 },
    headerContainer: { padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    headerContent: { flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative", gap: 10 },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center", // Center vertically
        justifyContent: "center", // Center horizontally
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 10,
    },
    labelContacdccciner: { flexDirection: "row", alignItems: "center", justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 5, gap: 10 },
    rounderBorder: { borderRadius: 15 },
    headerText: { fontSize: 18, fontWeight: "bold", color: "#343434" },
    closeButton: { padding: 5, position: 'absolute', right: 0 },
    closeIcon: { width: 24, height: 24, resizeMode: "contain" },
    image: { width: 40, height: 40, borderRadius: 25 },
};

export default SummaryScreen;