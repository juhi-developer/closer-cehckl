import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { scale } from "../../utils/metrics";

const UncheckedGreySmallIconSvg = (props) => (
    <Svg
        width={scale(16)}
        height={scale(16)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M6.995 14.16A6.67 6.67 0 0 1 .33 7.495 6.67 6.67 0 0 1 6.995.83a6.67 6.67 0 0 1 6.665 6.665 6.67 6.67 0 0 1-6.665 6.665Zm0-12.4A5.742 5.742 0 0 0 1.26 7.495a5.742 5.742 0 0 0 5.735 5.735 5.742 5.742 0 0 0 5.735-5.735A5.742 5.742 0 0 0 6.995 1.76Z"
            fill="#929292"
        />
    </Svg>
)

export default UncheckedGreySmallIconSvg;
