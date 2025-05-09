import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SquareBoxCheckedSvg = (props) => (
  <Svg
    width={22}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M19.616 0H2.351A2.365 2.365 0 0 0 0 2.351V19.65A2.365 2.365 0 0 0 2.351 22H19.65A2.365 2.365 0 0 0 22 19.649V2.352C21.968 1.032 20.937 0 19.616 0ZM5.218 10.34a.914.914 0 0 1 1.288 0l2.48 2.48c.097.097.226.097.323 0l6.152-6.152a.914.914 0 0 1 1.289 0 .914.914 0 0 1 0 1.288l-7.248 7.247c-.193.194-.515.194-.74 0l-3.544-3.575a.914.914 0 0 1 0-1.288Z"
      fill="#124698"
    />
  </Svg>
)

export default SquareBoxCheckedSvg;
