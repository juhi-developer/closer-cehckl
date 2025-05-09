import * as React from "react"
import Svg, { Rect } from "react-native-svg"

const FirstPaginatorSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={70}
    height={5}
    fill="none"
    {...props}
  >
    <Rect width={25} height={5} fill="#7DB0E9" rx={2.5} />
    <Rect
      width={10}
      height={5}
      x={30}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={45}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={60}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
  </Svg>
)
export default FirstPaginatorSvg;
