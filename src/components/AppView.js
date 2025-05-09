import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import React from 'react';
import {colors} from '../styles/colors';
import ScrollContainer from './scrollContainer';
import Loader from './loader';

export default function AppView(props) {
  const {
    customContainerStyle,
    isLoading,
    scrollContainerRequired,
    isScrollEnabled,
    scrollStyle,
    header,
    showSafeView = true,
    handleRefresh,
    refreshing,
    shouldRefresh,
    scrollref,
    scrollEventThrottle,
    onScroll,
    extraScrollHeight,
  } = props;
  return (
    <View style={{...styles.container, ...customContainerStyle}}>
      {showSafeView && <SafeAreaView style={{flex: 0}} />}
      {header && header()}
      <ScrollContainer
        extraScrollHeight={extraScrollHeight}
        scrollEventThrottle={scrollEventThrottle}
        onScroll={onScroll}
        scrollContainerRequired={scrollContainerRequired}
        isScrollEnabled={isScrollEnabled}
        refreshing={refreshing}
        handleRefresh={handleRefresh}
        shouldRefresh={shouldRefresh}
        scrollref={scrollref}>
        {props.children}
      </ScrollContainer>
      {isLoading && <Loader visible={isLoading} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    // zIndex: -1
  },
});
