import * as React from "react"
import Svg, { Path } from "react-native-svg"

const NotesIconSvg = (props) => (
    <Svg
        width={28}
        height={28}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M9.333 2.333v3.5M18.667 2.333v3.5M24.5 9.917v9.916c0 3.5-1.75 5.834-5.833 5.834H9.333c-4.083 0-5.833-2.334-5.833-5.834V9.917c0-3.5 1.75-5.834 5.833-5.834h9.334c4.083 0 5.833 2.334 5.833 5.834ZM9.333 12.833h9.334M9.333 18.667H14"
            stroke="#124698"
            strokeWidth={2}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default NotesIconSvg;
