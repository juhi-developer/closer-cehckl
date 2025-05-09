import * as React from "react"
import Svg, { Path } from "react-native-svg"

const InitialRecordIconSvg = (props) => (
  <Svg
    width={32}
    height={32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path d="M8 8h16v16H8V8Z" fill={props?.fill || "#2F3A4E" }fillOpacity={props?.opacity || 0.4} />
  </Svg>
)

export default InitialRecordIconSvg;
