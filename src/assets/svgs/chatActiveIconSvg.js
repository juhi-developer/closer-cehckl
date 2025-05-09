import * as React from "react"
import Svg, { Path, Ellipse } from "react-native-svg"

const ChatActiveIconSvg = (props) => (
  <Svg
    width={96}
    height={53}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M48.727.002C28.87-.205 18.91 18 0 18h96C77.818 18 68.042.203 48.727.002Z"
      fill="#fff"
    />
    <Ellipse cx={48.5} cy={29.5} rx={22.5} ry={23.5} fill="#124698" />
    <Path
      d="M53.667 17.333h-9.334c-4.666 0-7 2.334-7 7V39.5a1.17 1.17 0 0 0 1.167 1.167h15.167c4.666 0 7-2.334 7-7v-9.334c0-4.666-2.334-7-7-7Zm-2.334 15.459h-8.166a.881.881 0 0 1-.875-.875c0-.479.396-.875.875-.875h8.166c.479 0 .875.396.875.875a.881.881 0 0 1-.875.875Zm3.5-5.834H43.167a.881.881 0 0 1-.875-.875c0-.478.396-.875.875-.875h11.666c.479 0 .875.397.875.875a.881.881 0 0 1-.875.875Z"
      fill="#fff"
    />
  </Svg>
)

export default ChatActiveIconSvg;
