import * as React from "react"
import Svg, { Rect } from "react-native-svg"

const FourthActiveDotSvg = (props) => (
    <Svg
        width={70}
        height={5}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Rect width={10} height={5} rx={2.5} fill="#fff" fillOpacity={0.67} />
        <Rect
            x={15}
            width={10}
            height={5}
            rx={2.5}
            fill="#fff"
            fillOpacity={0.67}
        />
        <Rect
            x={30}
            width={10}
            height={5}
            rx={2.5}
            fill="#fff"
            fillOpacity={0.67}
        />
        <Rect x={45} width={25} height={5} rx={2.5} fill="#7DB0E9" />
    </Svg>
)

export default FourthActiveDotSvg;
