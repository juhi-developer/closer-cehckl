import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ButtonListIconSvg = (props) => (
    <Svg
        width={30}
        height={30}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5 19.5H3V27h7.5v-7.5ZM3 18a1.5 1.5 0 0 0-1.5 1.5V27A1.5 1.5 0 0 0 3 28.5h7.5A1.5 1.5 0 0 0 12 27v-7.5a1.5 1.5 0 0 0-1.5-1.5H3ZM10.5 3H3v7.5h7.5V3ZM3 1.5A1.5 1.5 0 0 0 1.5 3v7.5A1.5 1.5 0 0 0 3 12h7.5a1.5 1.5 0 0 0 1.5-1.5V3a1.5 1.5 0 0 0-1.5-1.5H3ZM28.5 4.5H15V3h13.5v1.5Zm-4.5 6h-9V9h9v1.5ZM28.5 21H15v-1.5h13.5V21ZM24 27h-9v-1.5h9V27Z"
            fill="#292D32"
        />
    </Svg>
)

export default ButtonListIconSvg;
