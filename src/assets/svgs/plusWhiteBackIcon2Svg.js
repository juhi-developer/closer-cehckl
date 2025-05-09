import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

const PlusWhiteBackIcon2Svg = (props) => (
    <Svg
        width={36}
        height={36}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Rect x={1.5} y={1.5} width={33} height={33} rx={16.5} fill="#fff" />
        <Path
            d="M18 10.944v14.112M10.944 18h14.112"
            stroke="#124698"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Rect
            x={1.5}
            y={1.5}
            width={33}
            height={33}
            rx={16.5}
            stroke="#F5F1F0"
            strokeWidth={3}
        />
    </Svg>
)

export default PlusWhiteBackIcon2Svg;
