import {
    View,
    Text,
    Platform,
    Image,
    Pressable,
    PermissionsAndroid,
    Alert,
    StyleSheet,
} from 'react-native';
import React, {
    useEffect,
    useState,
} from 'react';
import { APP_IMAGE, STICKERS, hitSlopProp } from '../../../utils/constants';
import DarkCrossIconSvg from '../../../assets/svgs/darkCrossIconSvg';
import InitialPauseIconSvg from '../../../assets/svgs/recordAudio/initialPauseAudioIconSvg';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
} from 'react-native-audio-recorder-player';
import { VARIABLES } from '../../../utils/variables';
import {
    generateID,
} from '../../../utils/helpers';
import RNFS from 'react-native-fs';
import API from '../../../redux/saga/request';
import { KEYCHAIN } from '../../../utils/keychain';
import AWS from 'aws-sdk'; // Ensure AWS is imported
const audioRecorderPlayer = new AudioRecorderPlayer();
import { useSocket } from '../../../utils/socketContext';
import LinearGradient from "react-native-linear-gradient";
const AudioSend = ({ data, setItemData, questionsActiveId }) => {


    const { socket } = useSocket();

    // Check if socket is defined
    useEffect(() => {
        if (!socket) {
            console.error("Socket is undefined. Ensure useSocket is returning the correct object.");
        }
    }, [socket]);

    // Ensure AWS is configured properly
    useEffect(() => {
        if (!AWS.config.credentials) {
            console.error("AWS credentials are not configured. Check AWS initialization.");
        }
    }, []);


    
    const [isAudioRecording, setIsAudioRecording] = useState(false);
    const [isRecordingPause, setIsRecordingPause] = useState(false);
    const [recordTime, setRecordTime] = useState('00:00');
    const [audioFile, setAudioFile] = useState('');
    const [musicFileExtension, setMusicFileExtension] = useState('');
    const [isPlaying, setIsPlaying] = useState(true); // Added state for isPlaying
    const [isSending, setIsSending] = useState(false); // Add state to track sending status


    /// function to handle audio permissions
    const audioPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);
                if (
                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    onStartRecord();
                } else {
                    onStartRecord();
                    //  ToastMessage('Please check the device permissions to record audio');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
        } else {
            onStartRecord();
        }
    };

    const fileName = `recording${Date.now()}.mp4`;

    const audioSet = {
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    const path = Platform.select({
        ios: fileName,
        android: fileName,
    });

    /// function to start recording
    const onStartRecord = async () => {
        setIsAudioRecording(true);

        if (Platform.OS === 'ios') {
            await audioRecorderPlayer.startRecorder(path, audioSet);
        } else {
            await audioRecorderPlayer.startRecorder();
        }

        // await audioRecorderPlayer.startRecorder();
        audioRecorderPlayer.addRecordBackListener(e => {
            if (
                audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)) !==
                '00:00'
            ) {
                setRecordTime(
                    audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)),
                );
            }

            if (
                audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)) ===
                '00:30'
            ) {
                onStopRecord();
            }
            return;
        });
    };

    /// function to pause recording
    const onPauseRecorder = async () => {
        try {
            await audioRecorderPlayer.pauseRecorder();
        } catch (error) {
            console.error('Error pausing recording:', error);
        }
    };

    /// function to resume recording
    const onResumeRecorder = async () => {
        try {
            await audioRecorderPlayer.resumeRecorder();
        } catch (error) {
            console.error('Error pausing recording:', error);
        }
    };

    /// function to stop recording
    const onStopRecord = async (save = true) => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();

        setMusicFileExtension(result.split('.').pop());
        save && setAudioFile(result);
        setIsAudioRecording(false);
    };


    AWS.config.update({
        region: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_REGION,
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_ID,
        }),
    });

    async function addPhoto(filePath, albumName) {
        const fileExtension = filePath.split('.').pop(); // Extract file extension
        const fileName = `${Math.floor(Math.random() * 10000000)}.${fileExtension}`; // Generate a random file name with extension
        const albumPhotosKey = encodeURIComponent(albumName) + "/";
        const photoKey = albumPhotosKey + fileName;

        try {
            // Read the file into a buffer
            const fileBuffer = await RNFS.readFile(filePath, 'base64');

            const upload = new AWS.S3.ManagedUpload({
                params: {
                    Bucket: KEYCHAIN.NEXT_PUBLIC_S3_BUCKET_NAME,
                    Key: photoKey,
                    Body: Buffer.from(fileBuffer, 'base64'), // Convert base64 to buffer
                    ContentType: `audio/${fileExtension}`, // Set appropriate content type
                    ACL: "public-read",
                },
            });

            const promise = await upload.promise();
            promise.imageName = fileName; // Assign the generated file name
            return promise;
        } catch (error) {
            console.error('Error uploading audio to S3:', error);
            throw new Error('Audio upload failed');
        }
    }

    /// function to send audio note
    const sendAudioNote = async () => {
        if (recordTime === '00:00') {
            Alert.alert(
                'No Audio Recorded',
                'Please record an audio note before sending.',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
            );
            return;
        }

        // Immediately update UI to show the desired state
        setIsRecordingPause(false);

        if (!VARIABLES.user?.partnerData?.partner) {
            return;
        }

        const newUuid = generateID();
        setIsAudioRecording(false);
 
        const filename = `${newUuid}_${audioFile.substring(audioFile.lastIndexOf('/') + 1)}`;
        const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

        let playId = data[0]?._id || data._id || ''; // Determine playId

        const payload = {
            playId,
            questionId: questionsActiveId,
            userId: VARIABLES.user?._id,
            answer: filename,
            extraParameter: {
                message: filename,
                type: 'audio',
                recordTime,
                mime: `audio/${musicFileExtension}`,
            },
        };

        try {
            await RNFS.copyFile(audioFile, localFilePath); // Ensure the file is copied locally
            const albumName = "closer";
            const s3response = await addPhoto(localFilePath, albumName);

            if (s3response) {
                payload.answer = s3response.Location; // Update payload with S3 URL

                try {
                    // Emit the payload to the server via socket
                    if (socket && typeof socket.emit === 'function') {
                        socket.emit('quizPlayAnswer', payload, (response) => {
                            if (response.success && response.data?.playData) {
                                setItemData(response.data.playData[0]); // Update the item data
                                setUserAnswer(""); // Clear the input field
                            } else {
                                Alert.alert("Failed to submit the answer. Please try again.");
                            }
                        });
                    } else {
                        console.error("Socket emit is not a function. Check socket initialization.");
                    }
                } catch (error) {
                    console.error("Socket error:", error);
                    Alert.alert("Failed to submit the answer. Please try again.");
                }
            }
        } catch (error) {
            console.error('Error processing audio file:', error);
            Alert.alert("Audio upload failed. Please try again.");
        }

        setAudioFile('');
    };

    return (
        <LinearGradient
            colors={[
                `#f7fdfc`,
                `#f6fcf8`,
            ]}
            useAngle={true}
            angle={180} // Angle 180 makes the gradient flow from top to bottom
            angleCenter={{ x: 0.5, y: 0.5 }} // Center the gradient
            style={{
                alignItems: 'center', // Ensure horizontal centering
                justifyContent: isRecordingPause ? 'center' : 'space-evenly',
                paddingVertical: 20,
                paddingHorizontal: 20,
                borderRadius: 10,
            }}
        >

            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                {(isAudioRecording && recordTime) && (
                    <View style={{ alignItems: 'center' }}>

                        {/* Add waveform visualization */}
                        <Text style={{ fontSize: 16, color: '#000', margin: 20, fontWeight: 'bold' }}>
                            {recordTime}
                        </Text>
                        <View style={styles.waveformContainer}>

                            {Array.from({ length: 20 }).map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        {
                                            height: Math.random() * 20 + 5, // Random height between 5 and 25
                                            borderWidth: 3,
                                            borderColor: isPlaying
                                                ? `rgba(114, 189, 144, 1)` // Adjust opacity based on playbackProgress
                                                : 'rgba(192, 192, 192, 1)', // Default black border color when not playing
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                )}
            </View>


            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                // justifyContent: isRecordingPause ? 'center' : 'space-evenly',
                // ...(isRecordingPause && { gap: 40 }), // Add gap only when isRecordingPause is true
                paddingHorizontal: isRecordingPause ? 0 : 20,
            }}>
                {isAudioRecording || audioFile !== '' ? (
                    <Pressable
                        style={{
                            marginHorizontal: 50,
                        }}
                        onPress={() => {
                            setIsAudioRecording(false);
                            setAudioFile(val => '');
                            setRecordTime('00:00');
                            onStopRecord(false);
                        }}>

                        <DarkCrossIconSvg />
                    </Pressable>
                ) : (
                    <View />
                )}

                {isAudioRecording ? (
                    <Pressable
                        onPress={() => {
                            setIsRecordingPause(!isRecordingPause);
                            if (isRecordingPause) {
                                onResumeRecorder();
                            } else {
                                onPauseRecorder();
                            }
                        }}>


                        {!isRecordingPause ? (
                            <InitialPauseIconSvg />
                        ) : (
                            <View
                                style={{
                                    width: 32,
                                    height: 32,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Image
                                    source={APP_IMAGE.playIcon}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        tintColor: '#929292',
                                        resizeMode: 'contain',
                                    }}
                                />
                            </View>
                        )}
                    </Pressable>
                ) : (
                    <View />
                )}
                <Pressable
                    testID="onStopRecordingChat"
                    onPress={() => {
                        if (!isAudioRecording) {
                            audioPermissions();
                        } else {
                            onStopRecord();
                        }
                    }}>
                    {audioFile === '' ? (
                        <>
                            {isAudioRecording ? (
                                <Image style={{
                                    marginHorizontal: 50,
                                }} source={require("../../../assets/images/quiz/pause.png")} />
                            ) : (
                                <Image source={require("../../../assets/images/quiz/mic.png")} />
                            )}
                        </>
                    ) : (
                        <Pressable
                            testID="sendRecordingChat"
                            onPress={async () => {
                                if (!isSending) { // Prevent multiple clicks
                                    setIsSending(true); // Disable button
                                    await sendAudioNote(); // Wait for the function to complete
                                    setIsSending(false); // Re-enable button
                                }
                            }}
                            disabled={isSending} // Disable button when sending
                        >
                            <Image
                                style={{
                                    marginHorizontal: 50,
                                    opacity: isSending ? 0.5 : 1, // Reduce opacity when disabled
                                }}
                                source={require("../../../assets/images/quiz/sendVoice.png")}
                            />
                        </Pressable>
                    )}
                </Pressable>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                {(isAudioRecording && recordTime) && (
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 14,
                            color: '#000',
                            margin: 10,
                            fontFamily: 'Poppins',
                            fontWeight: '400',
                            lineHeight: 20,
                            letterSpacing: 0,
                        }}>
                            Tap on Stop when done
                        </Text>
                    </View>
                )}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    waveformContainer: {
        height: 20,
        width: '80%',
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 30
    },
    line: {
        width: 3,
        margin: 2,
        borderRadius: 2,
    },
    activeLine: {
        borderColor: 'rgba(114, 189, 144, 1)',
    },
    inactiveLine: {
        borderColor: 'rgba(192, 192, 192, 1)',
    },
});

export default AudioSend;
