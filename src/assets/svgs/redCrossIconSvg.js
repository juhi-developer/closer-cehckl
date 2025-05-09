import * as React from "react"
import Svg, { Path } from "react-native-svg"

const RedCrossIconSvg = (props) => (
    <Svg
        width={15}
        height={16}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="m11.25 4.25-7.5 7.5M3.75 4.25l7.5 7.5"
            stroke="#B96D57"
            strokeWidth={0.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default RedCrossIconSvg;
