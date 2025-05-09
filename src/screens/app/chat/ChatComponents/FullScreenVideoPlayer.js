import {View, Text, Modal} from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../../styles/globalStyles';
import {scale} from '../../../../utils/metrics';

const FullScreenVideoPlayer = ({uri, isVisible}) => {
  return (
    <Modal visible={isVisible} uri={uri}>
      <Video
        paused
        source={{
          uri: uri,
        }}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          backgroundColor: '#000',
          borderRadius: scale(10),
        }}
      />
    </Modal>
  );
};

export default FullScreenVideoPlayer;
