import * as React from "react"
import Svg, { Path } from "react-native-svg"

const DropDownBlueIconSvg = (props) => (
    <Svg
        width={22}
        height={22}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="m18.26 8.25-5.977 5.977a1.82 1.82 0 0 1-2.566 0L3.74 8.25"
            stroke="#124698"
            strokeWidth={2}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default DropDownBlueIconSvg;
