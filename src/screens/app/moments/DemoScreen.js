import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import EmojiSelector from './components/EmojiSelector';

export default function DemoScreen() {
  return (
    <View style={{marginTop: 200}}>
      {/* <EmojiSelector
        onEmojiSelect={emoji => {
          alert(emoji);
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({});
