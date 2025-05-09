import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

const SearchWhiteBackIconSvg = (props) => (
    <Svg
        width={42}
        height={42}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Rect width={42} height={42} rx={20} fill="#fff" />
        <Path
            d="M20.542 29.25a8.708 8.708 0 1 0 0-17.417 8.708 8.708 0 0 0 0 17.417ZM30.167 30.167l-1.834-1.834"
            stroke="#124698"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default SearchWhiteBackIconSvg
