import * as React from "react"
import Svg, { Path } from "react-native-svg"

const MicrophoneWhiteIconSvg = (props) => (
    <Svg
        width={36}
        height={36}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M18 23.25c3.315 0 6-2.685 6-6V9c0-3.315-2.685-6-6-6s-6 2.685-6 6v8.25c0 3.315 2.685 6 6 6Z"
            stroke={props.stoke || "#fff"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M6.525 14.475v2.55C6.525 23.355 11.67 28.5 18 28.5s11.475-5.145 11.475-11.475v-2.55M15.915 9.645a6.04 6.04 0 0 1 4.17 0M16.8 12.825c.795-.21 1.62-.21 2.415 0M18 28.5V33"
            stroke={props.stoke || "#fff"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default MicrophoneWhiteIconSvg;
