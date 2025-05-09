import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const RecordAudioSvg = (props) => (
  <Svg
    width={58}
    height={58}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={29} cy={29} r={29} fill="#124698" />
    <Path d="M21 21h16v16H21V21Z" fill="#fff" />
  </Svg>
)

export default RecordAudioSvg;
