import * as React from "react"
import Svg, { Path } from "react-native-svg"

const DropUpBlueIconSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={9}
    fill="none"
    {...props}
  >
    <Path
      stroke="#124698"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={2}
      d="m16.26 7.75-5.976-5.976a1.82 1.82 0 0 0-2.567 0L1.74 7.75"
    />
  </Svg>
)
export default DropUpBlueIconSvg;
