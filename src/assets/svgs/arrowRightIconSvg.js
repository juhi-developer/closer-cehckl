import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ArrowRightIconSvg = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M5 12.5h14M12 19.5l7-7-7-7"
            stroke={props?.stroke || "#124698"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default ArrowRightIconSvg;
