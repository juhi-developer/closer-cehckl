import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ArrowLeftIconSvg = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M19 12H5M12 19l-7-7 7-7"
            stroke={props?.stroke || "#124698"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default ArrowLeftIconSvg;
