import * as React from 'react';
import Svg, {Circle, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

const CameraIconSvg = props => (
  <Svg
    width={51}
    height={50}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={25.5} cy={25} r={25} fill="url(#a)" />
    <Path
      d="M25.5 30.833a4.663 4.663 0 1 0 0-9.326 4.663 4.663 0 0 0 0 9.326Z"
      stroke="#fff"
      strokeWidth={2}
      strokeMiterlimit={10}
    />
    <Path
      d="M36.333 26.517v-5.662a2.627 2.627 0 0 0-2.626-2.627h-3.368l-.746-2.192A1.513 1.513 0 0 0 28.153 15h-5.12a1.793 1.793 0 0 0-1.688 1.207l-.684 2.02h-3.368a2.627 2.627 0 0 0-2.626 2.628v10.88a2.627 2.627 0 0 0 2.626 2.626h16.414a2.627 2.627 0 0 0 2.626-2.627V29.87"
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

export default CameraIconSvg;
