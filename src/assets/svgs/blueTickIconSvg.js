import * as React from "react"
import Svg, { Path } from "react-native-svg"

const BlueTickIconSvg = (props) => (
    <Svg
        width={14}
        height={10}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M12.333 1 5 8.333 1.667 5"
            stroke="#124698"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default BlueTickIconSvg;
