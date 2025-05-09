import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import GoBackIconSvg from '../../../assets/svgs/goBackIconSvg';
import CornerHeader from '../../../components/cornerHeader';
import {globalStyles} from '../../../styles/globalStyles';
import {colors} from '../../../styles/colors';
import {scale} from '../../../utils/metrics';

export default function WebviewScreen(props) {
  const [renderedOnce, setRenderedOnce] = useState(false);

  const {route} = props;
  const url = route.params.url;
  console.log('urll webview', url);
  const localFilePath = `${RNFS.DocumentDirectoryPath}/${url}`;

  const updateSource = () => {
    setRenderedOnce(true);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: scale(24),
      }}>
      <CornerHeader
        leftIcon={<GoBackIconSvg />}
        leftPress={() => props.navigation.goBack()}
        titleBox={<Text style={{...globalStyles.cornerHeaderTitle}}></Text>}
        // titleStyle={styles.headerTitleStyle}
      />
      <Pdf
        source={{uri: url}}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={{flex: 1, backgroundColor: colors.white}}
      />

      {/* <WebView
        onLoad={updateSource}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        allowFileAccess={true}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        /// source={{uri: url}}
        source={{
          uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`,
          cache: true,
        }}
        // source={{uri: `file://${localFilePath}`}}
        style={{flex: 1}}
        useWebKit={true}
        startInLoadingState={true}
        scrollEnabled={true}
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
