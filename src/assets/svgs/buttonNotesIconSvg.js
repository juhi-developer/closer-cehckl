import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ButtonNotesIconSvg = (props) => (
    <Svg
        width={30}
        height={30}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M27.5 12.5v6.25c0 6.25-2.5 8.75-8.75 8.75h-7.5C5 27.5 2.5 25 2.5 18.75v-7.5C2.5 5 5 2.5 11.25 2.5h6.25"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M8.75 16.25h7.5m-7.5 5h5M27.5 12.5h-5c-3.75 0-5-1.25-5-5v-5l10 10Z"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default ButtonNotesIconSvg;
