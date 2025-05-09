import * as React from "react"
import Svg, { G, Circle, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const SizeTogglerIconSvg = (props) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#a)">
      <Circle cx={14} cy={14} r={14} fill="#fff" />
    </G>
    <Path
      d="M14.333 7.335h6v6M13.333 20.335h-6v-6"
      stroke="#124698"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Defs></Defs>
  </Svg>
)

export default SizeTogglerIconSvg
