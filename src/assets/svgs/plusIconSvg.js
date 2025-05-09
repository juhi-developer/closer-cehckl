import * as React from "react"
import Svg, { Path } from "react-native-svg"

const PlusIconSvg = (props) => (
    <Svg
        width={26}
        height={26}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M13 5.944v14.113M5.943 13h14.113"
            stroke="#124698"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default PlusIconSvg;
