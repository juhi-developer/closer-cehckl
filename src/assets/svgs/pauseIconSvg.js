import * as React from "react"
import Svg, { Path } from "react-native-svg"

const PauseIconSvg = (props) => (
    <Svg
        width={11}
        height={13}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M.6 12.494h3.352V.761H.6v11.733ZM7.305.761v11.733h3.352V.761H7.305Z"
            fill="#fff"
        />
    </Svg>
)

export default PauseIconSvg;
