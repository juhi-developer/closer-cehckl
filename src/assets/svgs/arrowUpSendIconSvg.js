import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const ArrowUpIconSendSvg = (props) => (
  <Svg
    width={30}
    height={30}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={15} cy={15} r={15} fill="#124698" />
    <Path
      d="M20.058 13.6a.618.618 0 0 1-.442-.183L15 8.8l-4.617 4.617a.629.629 0 0 1-.883 0 .629.629 0 0 1 0-.884l5.058-5.058a.629.629 0 0 1 .883 0l5.059 5.058a.629.629 0 0 1 0 .884.605.605 0 0 1-.442.183Z"
      fill="#fff"
    />
    <Path
      d="M15 22.708a.63.63 0 0 1-.625-.625V8.058A.63.63 0 0 1 15 7.433a.63.63 0 0 1 .625.625v14.025a.63.63 0 0 1-.625.625Z"
      fill="#fff"
    />
  </Svg>
)

export default ArrowUpIconSendSvg;
