import * as React from "react"
import Svg, { Path } from "react-native-svg"

const DarkCrossIconSvg = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M18 6 6 18M6 6l12 12"
            stroke="#2F3A4E"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default DarkCrossIconSvg;
