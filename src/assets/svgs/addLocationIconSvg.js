import * as React from "react"
import Svg, { Path } from "react-native-svg"

const AddLocationIconSvg = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M9.25 11h5.5M12 13.75v-5.5"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
        />
        <Path
            d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"
            stroke="#2F3A4E"
            strokeWidth={1.5}
        />
    </Svg>
)

export default AddLocationIconSvg;
