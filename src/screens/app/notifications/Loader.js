import React from 'react';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {CARD_HEIGHT, SCREEN_WIDTH} from '../../../styles/globalStyles';
import {View} from 'react-native-animatable';

const OrganiseLoader = props => (
  <ContentLoader
    width={SCREEN_WIDTH - 30}
    height={460}
    backgroundColor="#fff"
    foregroundColor="#ecebeb">
    <Circle cx="30" cy="30" r="20" />
    <Rect x="75" y="24" rx="2" ry="2" width="140" height="6" />
    <Rect x="75" y="40" rx="2" ry="2" width="140" height="6" />
    <Rect x="0" y="120" rx="2" ry="2" width="400" height="100" />
    <Rect x="7" y="60" rx="10" ry="10" width="380" height="10" />
    <Rect x="7" y="80" rx="10" ry="10" width="300" height="10" />
    <Rect x="7" y="100" rx="10" ry="10" width="340" height="10" />
  </ContentLoader>
);

export const MomentLoader = props => (
  <ContentLoader
    speed={2}
    width={208}
    height={94}
    viewBox="0 0 198 94"
    backgroundColor="#fff"
    foregroundColor="#ecebeb"
    {...props}>
    <Circle cx="47" cy="47" r="47" />
    <Circle cx="151" cy="47" r="47" />
  </ContentLoader>
);

export const Card = props => (
  <ContentLoader
    speed={2}
    width={SCREEN_WIDTH - 32}
    height={CARD_HEIGHT.medium}
    viewBox={`0 0 ${SCREEN_WIDTH - 32} ${CARD_HEIGHT.medium}`}
    backgroundColor="#fff"
    foregroundColor="#ecebeb"
    {...props}>
    <Rect
      x="0"
      y="0"
      rx="16"
      ry="16"
      width={SCREEN_WIDTH - 32}
      height={CARD_HEIGHT.medium}
    />
  </ContentLoader>
);

export const Sticky = () => (
  <ContentLoader
    speed={2}
    width={SCREEN_WIDTH - 32}
    height={CARD_HEIGHT.medium}
    viewBox={`0 0 ${SCREEN_WIDTH - 32} ${CARD_HEIGHT.medium}`}
    backgroundColor="#fff"
    foregroundColor="#ecebeb">
    <Rect x="0" y="0" rx="16" ry="16" width="160" height="174" />
    <Rect x="184" y="0" rx="16" ry="16" width="160" height="174" />
  </ContentLoader>
);

export const Feelings = props => (
  <ContentLoader
    speed={2}
    width={SCREEN_WIDTH - 32}
    height={CARD_HEIGHT.medium}
    viewBox={`0 0 ${SCREEN_WIDTH - 32} ${CARD_HEIGHT.medium}`}
    backgroundColor="#fff"
    foregroundColor="#ecebeb"
    {...props}>
    <Rect
      x="0"
      y="0"
      rx="16"
      ry="16"
      width={SCREEN_WIDTH - 32}
      height={CARD_HEIGHT.extraSmall}
    />
  </ContentLoader>
);

export const NotificationLoader = props => (
  <ContentLoader
    speed={2}
    width={'100%'}
    height={'100%'}
    //viewBox="0 0 400 400"
    backgroundColor="#fff"
    foregroundColor="#ecebeb"
    {...props}>
    <Rect x="13" y="0" rx="10" ry="10" width="93%" height="94" />
    <Rect x="12" y="108" rx="5" ry="10" width="93%" height="94" />
    <Rect x="10" y="216" rx="5" ry="10" width="93%" height="94" />
    <Rect x="14" y="324" rx="5" ry="10" width="93%" height="94" />

    <Rect x="13" y="432" rx="5" ry="10" width="93%" height="94" />
    <Rect x="12" y="540" rx="5" ry="10" width="93%" height="94" />
    <Rect x="10" y="648" rx="5" ry="10" width="93%" height="94" />
    <Rect x="14" y="756" rx="5" ry="10" width="93%" height="94" />
    <Rect x="13" y="864" rx="5" ry="10" width="93%" height="94" />
  </ContentLoader>
);

export default OrganiseLoader;
