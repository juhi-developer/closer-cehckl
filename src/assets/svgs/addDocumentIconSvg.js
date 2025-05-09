import * as React from "react"
import Svg, { Path } from "react-native-svg"

const AddDocumentIconSvg = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M10 14h4m-2 2v-4"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default AddDocumentIconSvg;
