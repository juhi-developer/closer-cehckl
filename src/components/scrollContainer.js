import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  RefreshControl,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function ScrollContainer(props) {
  return (
    <View style={{flex: 1}}>
      {props.scrollContainerRequired ? (
        <KeyboardAwareScrollView
          //  bounces={false}
          //  bouncesZoom={false}
          extraScrollHeight={props.extraScrollHeight}
          enableResetScrollToCoords={true}
          //   automaticallyAdjustContentInsets={true}
          innerRef={ref => {
            if (props?.scrollref?.current) {
              props.scrollref.current = ref;
            }
          }}
          onScroll={props.onScroll}
          scrollEventThrottle={
            props.scrollEventThrottle !== undefined
              ? props.scrollEventThrottle
              : 500
          }
          nestedScrollEnabled={true}
          extraHeight={140}
          scrollEnabled={props.isScrollEnabled}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          contentContainerStyle={{...props.scrollStyle, ...styles.keyboard}}
          // refreshing={props.refreshing ? props.refreshing : false}
          ref={props?.scrollref}
          refreshControl={
            props.shouldRefresh ? (
              <RefreshControl
                refreshing={props.refreshing}
                onRefresh={props.handleRefresh}
              />
            ) : null
          }
          // style={{ flex: 1 }}
        >
          {props.children}
        </KeyboardAwareScrollView>
      ) : (
        <View style={{flex: 1}}>{props.children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    // height:scaleHeight('100%'),
    flexGrow: 1,
    // flex: 1
  },
});
