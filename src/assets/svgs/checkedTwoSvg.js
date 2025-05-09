import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

const CheckedTwoSvg = (props) => (
    <Svg
        width={22}
        height={22}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M11 0C4.939 0 0 4.939 0 11s4.939 11 11 11 11-4.939 11-11S17.061 0 11 0Zm5.258 8.47-6.237 6.237a.824.824 0 0 1-1.166 0l-3.113-3.113a.83.83 0 0 1 0-1.166.83.83 0 0 1 1.166 0l2.53 2.53 5.654-5.654a.83.83 0 0 1 1.166 0 .83.83 0 0 1 0 1.166Z"
            fill="url(#a)"
        />
        <Defs>
            <LinearGradient
                id="a"
                x1={3.08}
                y1={3.96}
                x2={20.68}
                y2={18.48}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.167} stopColor="#9BC2FF" />
                <Stop offset={0.679} stopColor="#5698FF" />
            </LinearGradient>
        </Defs>
    </Svg>
)

export default CheckedTwoSvg;
