import * as React from "react"
import Svg, {
  Circle,
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"

const ToggleCardIconSvg = (props) => (
  <Svg
    width={48}
    height={48}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={24} cy={24} r={24} fill="url(#a)" />
    <Circle cx={24} cy={24} r={19} fill="#fff" />
    <G
      opacity={0.4}
      stroke="#2F3A4E"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="m22.579 19.16-3.41-3.41-3.41 3.41M19.169 32.25v-16.5M25.42 28.84l3.41 3.41 3.41-3.41M28.83 15.75v16.5" />
    </G>
    <Defs>
      <LinearGradient
        id="a"
        x1={48}
        y1={-52}
        x2={77.334}
        y2={22.157}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.133} stopColor="#FDB1F2" />
        <Stop offset={1} stopColor="#FAE5EB" />
      </LinearGradient>
    </Defs>
  </Svg>
)

export default ToggleCardIconSvg;
