import * as React from "react"
import Svg, { Path } from "react-native-svg"

const FilterAddSvg = (props) => (
    <Svg
        width={28}
        height={28}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M25.236 17.209a5.467 5.467 0 0 1-.805 2.858 5.494 5.494 0 0 1-4.737 2.683 5.519 5.519 0 0 1-4.737-2.683 5.436 5.436 0 0 1-.805-2.858 5.547 5.547 0 0 1 5.542-5.542 5.547 5.547 0 0 1 5.542 5.542ZM21.77 17.186H17.63M19.693 15.167v4.142"
            stroke="#124698"
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M24.138 4.69v2.59c0 .945-.595 2.123-1.178 2.718l-2.054 1.808a5.16 5.16 0 0 0-1.213-.14 5.547 5.547 0 0 0-5.542 5.542c0 1.038.292 2.018.805 2.858a5.228 5.228 0 0 0 1.75 1.785v.397c0 .712-.466 1.657-1.061 2.007L14 25.316c-1.529.945-3.652-.116-3.652-2.006v-6.242c0-.828-.478-1.89-.945-2.473L4.923 9.88c-.583-.595-1.062-1.656-1.062-2.356V4.806c0-1.411 1.062-2.473 2.357-2.473h15.563a2.365 2.365 0 0 1 2.357 2.357Z"
            stroke="#124698"
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default FilterAddSvg;
