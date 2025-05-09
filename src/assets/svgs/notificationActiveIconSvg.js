import * as React from "react"
import Svg, { Path, Ellipse } from "react-native-svg"
const NotificationActiveIconSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={96}
    height={53}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M48.727.002C28.87-.205 18.91 18 0 18h96C77.818 18 68.042.203 48.727.002Z"
    />
    <Ellipse cx={48.5} cy={29.5} fill="#124698" rx={22.5} ry={23.5} />
    <Path
      fill="#fff"
      d="M49.019 20.91c-3.31 0-6 2.69-6 6v2.89c0 .61-.26 1.54-.57 2.06l-1.15 1.91c-.71 1.18-.22 2.49 1.08 2.93 4.31 1.44 8.96 1.44 13.27 0 1.21-.4 1.74-1.83 1.08-2.93l-1.15-1.91c-.3-.52-.56-1.45-.56-2.06v-2.89c0-3.3-2.7-6-6-6Z"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M50.872 21.2a6.754 6.754 0 0 0-3.7 0c.29-.74 1.01-1.26 1.85-1.26.84 0 1.56.52 1.85 1.26Z"
    />
    <Path
      stroke="#fff"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M52.02 37.06c0 1.65-1.35 3-3 3-.82 0-1.58-.34-2.12-.88a3.01 3.01 0 0 1-.88-2.12"
    />
  </Svg>
)
export default NotificationActiveIconSvg;
