import * as React from "react"
import Svg, { Path } from "react-native-svg"

const CloseListIconSvg = (props) => (
    <Svg
        width={50}
        height={50}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M32.012 17.988 17.988 32.012M17.988 17.988l14.024 14.024"
            stroke="#2F3A4E"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default CloseListIconSvg;
