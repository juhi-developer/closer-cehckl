import * as React from "react"
import Svg, {
  Circle,
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from "react-native-svg"
const LocationPinMapSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={51}
    fill="none"
    {...props}
  >
    <Circle cx={19.685} cy={30.685} r={19.685} fill="url(#a)" opacity={0.2} />
    <Circle cx={20.299} cy={30.069} r={9.227} fill="url(#b)" />
    <G fill="#000" clipPath="url(#c)">
      <Path
        fillRule="evenodd"
        d="M12.817 15.282a9.334 9.334 0 0 0 6.016 3.312v11.74h2.333v-11.74a9.333 9.333 0 1 0-7.55-16.06 9.335 9.335 0 0 0-.8 12.748Zm8.833-4.299a2.334 2.334 0 1 1-3.3-3.3 2.334 2.334 0 0 1 3.3 3.3Z"
        clipRule="evenodd"
      />
      <Path d="M17.667 25.666h4.667v2.333h-4.667z" />
    </G>
    <Defs>
      <LinearGradient
        id="a"
        x1={0}
        x2={39.532}
        y1={11}
        y2={51.017}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FF3B61" />
        <Stop offset={1} stopColor="#520D8C" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={11.072}
        x2={29.603}
        y1={20.842}
        y2={39.6}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FF3B61" />
        <Stop offset={1} stopColor="#520D8C" />
      </LinearGradient>
      <ClipPath id="c">
        <Path fill="#fff" d="M6 0h28v28H6z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default LocationPinMapSvg;
