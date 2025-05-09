import {Image, Modal, Pressable} from 'react-native';
import React from 'react';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../styles/globalStyles';
import WebView from 'react-native-webview';
import {API_BASE_URL} from '../utils/urls';
import AppView from './AppView';
import {APP_IMAGE} from '../utils/constants';

type props = {
  isVisible: boolean;
  setIsVisible: Function;
  redirectUrl?: string;
};

const TermsAndconditions: React.FC<props> = ({
  isVisible,
  setIsVisible,
  redirectUrl = `${API_BASE_URL}termAndConditions`,
}) => {
  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false);
      }}>
      <AppView>
        <WebView
          source={{uri: redirectUrl}}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
          }}
        />
        <Pressable
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            padding: 8,
            borderRadius: 100,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
          onPress={() => {
            setIsVisible(false);
          }}>
          <Image
            source={APP_IMAGE.smallCross}
            style={{width: 10, height: 10}}
          />
        </Pressable>
      </AppView>
    </Modal>
  );
};

export default TermsAndconditions;
