import * as React from "react"
import Svg, { Path } from "react-native-svg"

const BlueCloseCircleIconSvg = (props) => (
    <Svg
        width={23}
        height={23}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M11.499 21.078c5.27 0 9.583-4.313 9.583-9.583 0-5.271-4.313-9.584-9.583-9.584-5.271 0-9.584 4.313-9.584 9.584 0 5.27 4.313 9.583 9.584 9.583ZM8.787 14.217l5.424-5.425M14.211 14.217 8.787 8.792"
            stroke="#124698"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default BlueCloseCircleIconSvg;
