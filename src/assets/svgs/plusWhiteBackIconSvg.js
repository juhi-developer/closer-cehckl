import * as React from "react"
import Svg, { G, Circle, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const PlusWhiteBackIconSvg = (props) => (
    <Svg
        width={52}
        height={58}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <G filter="url(#a)">
            <Circle cx={26} cy={14} r={14} fill="#fff" />
        </G>
        <Path
            d="M20.558 13.983h10.889M26.002 19.427V8.538"
            stroke="#124698"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Defs></Defs>
    </Svg>
)

export default PlusWhiteBackIconSvg;
