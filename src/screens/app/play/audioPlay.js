import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    Image
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Sound from 'react-native-sound'; // Import Sound from react-native-sound
// import SvgWaveform from "../../../assets/images/quiz/Frame2087327764.svg"; // Import SVG as a React component

const AudioPlayScreen = ({ playItemData }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackProgress, setPlaybackProgress] = useState(0);
    const soundRef = useRef(null);
    const waveScale = useRef(new Animated.Value(1)).current;
    const screenWidth = Dimensions.get('window').width; // Get screen width for waveform

    const playAudio = (audioUrl) => {
        if (!audioUrl) {
            Alert.alert("Invalid audio URL");
            return;
        }
        if (isPlaying) {
            soundRef.current?.pause(); // Pause the sound if already playing
            setIsPlaying(false);
        } else {
            if (!soundRef.current) {
                soundRef.current = new Sound(audioUrl, null, (error) => {
                    if (error) {
                        console.error('Failed to load the sound', error);
                        return;
                    }
                    soundRef.current.play(() => {
                        setIsPlaying(false); // Reset state when playback finishes
                        soundRef.current.release(); // Release the sound instance
                        soundRef.current = null;
                    });
                });
            } else {
                soundRef.current.play(() => {
                    setIsPlaying(false);
                    soundRef.current.release();
                    soundRef.current = null;
                });
            }
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(waveScale, {
                        toValue: 1.5,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(waveScale, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            waveScale.setValue(1); // Reset scale when not playing
        }
    }, [isPlaying]);

    useEffect(() => {
        let interval;
        if (isPlaying && soundRef.current) {
            interval = setInterval(() => {
                if (soundRef.current) { // Add null check
                    soundRef.current.getCurrentTime((seconds) => {
                        const duration = soundRef.current.getDuration();
                        if (duration) { // Ensure duration is valid
                            setPlaybackProgress((seconds / duration) || 0);
                        }
                    });
                }
            }, 100);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    if (!playItemData || typeof playItemData !== 'string') {
        return (
            <View>
                <Text>No valid audio URL provided.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => playAudio(playItemData)}
                style={styles.playButton}
            >
                {isPlaying ? (
                    <Image source={require("../../../assets/images/quiz/Frame87327765.png")} style={styles.closeIcon} />

                ) : (
                    <Image source={require("../../../assets/images/quiz/Frame87327763.png")} style={styles.closeIcon} />
                )}
            </TouchableOpacity>
            {/* Add waveform visualization */}
            <View style={styles.waveformContainer}>
                {Array.from({ length: 20 }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.line,
                            {
                                height: Math.random() * 20 + 5, // Random height between 5 and 25
                                borderColor: isPlaying
                                    ? `rgba(114, 189, 144, 1)` // Adjust opacity based on playbackProgress
                                    : 'rgba(192, 192, 192, 1)', // Default black border color when not playing
                            },
                        ]}
                    />
                ))}
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f6f6',
        borderRadius: 10,
        padding: 10,
        gap: 10,
        marginLeft: 10,
        marginTop: 20,
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    audioLabel: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    waveformContainer: {
        height: 20, // Height of the waveform container
        width: '80%', // Full width of the container
        borderRadius: 5, // Rounded corners
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between', // Space between lines
        alignItems: 'center',
    },
    waveform: {
        height: '100%', // Full height of the waveform
        // backgroundColor: '#4CAF50', // Green color for the waveform
    },
    textContainer: {
        borderWidth: 5, // 5-pixel border
        margin: 2, // 2-pixel margin
        borderColor: '#000', // Optional: black border color
        height: 2, // Set height to 2 pixels
    },
    textWithBorder: {
        borderLeftWidth: 2, // Left-side border width
        paddingLeft: 5, // Padding to separate text from the border
        marginVertical: 2, // Vertical margin between texts
    },
    line: {
        width: 3, // Line width
        margin: 2, // Space between lines
        height: 20, // Default height of the lines
        borderLeftWidth: 5, // Left-side border width
        borderLeftColor: '#c0c0c0', // Left-side border color
        borderRadius: 2, // Rounded corners for the lines
    },
});

export default AudioPlayScreen;
