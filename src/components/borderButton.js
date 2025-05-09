import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/globalStyles'
import { colors } from '../styles/colors'
import { scale } from '../utils/metrics'

export default function BorderButton(props) {
    return (
        <Pressable
            style={{ ...styles.buttonContainer, ...props.style }}
            onPress={props.onPress}
        >
            <Text style={{ ...styles.text, ...props.textStyle }}>{props.text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: colors.blue1,
        padding: scale(12),
        alignItems: 'center'
    },
    text: {
        ...globalStyles.semiBoldLargeText,
        color: colors.blue1,
        fontSize:scale(18)
    }
})