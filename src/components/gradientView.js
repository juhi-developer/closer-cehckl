import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors } from '../styles/colors'

export default function GradientAppView(props) {
    return (
        <LinearGradient
            style={{ flex: 1, ...props.style }}
            colors={[colors.blue6, colors.blue7]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
        >
            {props.children}
        </LinearGradient>
    )
}

const styles = StyleSheet.create({})
