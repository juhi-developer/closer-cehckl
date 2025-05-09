import * as React from "react"
import Svg, { Path } from "react-native-svg"

const CalendarIconSvg = (props) => (
    <Svg
        width={24}
        height={25}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M8 2.5v3m8-3v3M3.5 9.59h17M21 9v8.5c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V9c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
            stroke="#124698"
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M15.695 14.2h.009m-.01 3h.01m-3.71-3h.01m-.01 3h.01m-3.71-3h.01m-.01 3h.01"
            stroke="#124698"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default CalendarIconSvg;
