import * as React from "react"
import Svg, { Path } from "react-native-svg"

const InitialPauseIconSvg = (props) => (
  <Svg
    width={32}
    height={32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M8 25.333h5.333V6.667H8v18.666ZM18.667 6.667v18.666H24V6.667h-5.333Z"
      fill="#2F3A4E"
      fillOpacity={0.4}
    />
  </Svg>
)

export default InitialPauseIconSvg;
