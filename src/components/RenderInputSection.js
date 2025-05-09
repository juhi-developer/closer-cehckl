import React from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../screens/app/play/styles'; // Adjust the path to your styles file

const RenderInputSection = ({ userAnswer, setUserAnswer, submitAnswer, config }) => {
    return (
        <LinearGradient
            colors={[
                `${config.bgcolorMain[0]}50`,
                `${config.bgcolorMain[1]}50`,
            ]}
            useAngle={true}
            angle={180} // Angle 180 makes the gradient flow from top to bottom
            style={styles.rounderBorder}
        >
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Start typing here..."
                    placeholderTextColor="#CCC"
                    value={userAnswer}
                    onChangeText={setUserAnswer}
                    // onKeyPress={({ nativeEvent }) => {
                    //     submitAnswer();
                    // }}
                    returnKeyType="done" // Customize the return key on the keyboard
                    multiline={true}
                />
                {userAnswer.trim() && (
                    <TouchableOpacity onPress={submitAnswer} style={styles.iconContainer}>
                        <Image
                            source={config.submitIcon} // Replace with your icon path
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </LinearGradient>
    );
};

export default RenderInputSection;
