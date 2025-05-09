import * as React from 'react';
import Svg, {Circle, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

const GalleryIconSvg = props => (
  <Svg
    width={51}
    height={50}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={25.5} cy={25} r={25} fill="url(#a)" />
    <Path
      d="M36.333 29.917V31.6a2.118 2.118 0 0 1-2.118 2.113h-17.43a2.117 2.117 0 0 1-2.118-2.113v-13.65a2.118 2.118 0 0 1 2.118-2.118h17.43a2.118 2.118 0 0 1 2.118 2.118v8.163"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="m17.11 30.21 2.491-3.408a.998.998 0 0 1 1.625.044l4.263 6.608M23.615 29.938l5.817-8.125a1.198 1.198 0 0 1 1.723-.162l5.178 4.485M20.403 23.26a2.178 2.178 0 1 0 0-4.355 2.178 2.178 0 0 0 0 4.355Z"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={0.5}
        y1={0}
        x2={50.706}
        y2={50.823}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FF7C7C" />
        <Stop offset={1} stopColor="#F34F4F" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default GalleryIconSvg;
