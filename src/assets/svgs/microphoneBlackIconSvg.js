import * as React from "react"
import Svg, { Path } from "react-native-svg"

const MicrophoneBlackIconSvg = (props) => (
    <Svg
        width={34}
        height={34}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M17 21.958a5.665 5.665 0 0 0 5.666-5.666V8.5A5.665 5.665 0 0 0 17 2.833 5.665 5.665 0 0 0 11.333 8.5v7.792A5.665 5.665 0 0 0 17 21.958Z"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M6.162 13.67v2.41c0 5.978 4.86 10.837 10.838 10.837 5.978 0 10.837-4.86 10.837-10.838v-2.408M15.031 9.11a5.705 5.705 0 0 1 3.939 0M15.866 12.113a4.447 4.447 0 0 1 2.281 0M17 26.917v4.25"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default MicrophoneBlackIconSvg;
