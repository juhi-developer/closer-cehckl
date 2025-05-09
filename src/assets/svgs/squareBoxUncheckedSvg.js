import * as React from "react"
import Svg, { Rect } from "react-native-svg"

const SquareBoxUncheckedSvg = (props) => (
  <Svg
    width={22}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect x={0.5} y={0.5} width={21} height={21} rx={1.5} stroke="#929292" />
  </Svg>
)

export default SquareBoxUncheckedSvg;
