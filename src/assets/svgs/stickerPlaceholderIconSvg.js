import * as React from "react"
import Svg, { Path } from "react-native-svg"

const StickerPlaceholderIconSvg = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M21.377 9.717v4.858c0 4.858-1.944 6.802-6.802 6.802h-5.83c-4.858 0-6.802-1.944-6.802-6.802v-5.83c0-4.858 1.944-6.802 6.802-6.802h4.858"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M21.377 9.717H17.49c-2.915 0-3.886-.972-3.886-3.887V1.943l7.773 7.774Z"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default StickerPlaceholderIconSvg;
