import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

const CheckedOneSvg = (props) => (
    <Svg
        width={22}
        height={23}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M11 .5C4.939.5 0 5.439 0 11.5s4.939 11 11 11 11-4.939 11-11-4.939-11-11-11Zm5.258 8.47-6.237 6.237a.824.824 0 0 1-1.166 0l-3.113-3.113a.83.83 0 0 1 0-1.166.83.83 0 0 1 1.166 0l2.53 2.53 5.654-5.654a.83.83 0 0 1 1.166 0 .83.83 0 0 1 0 1.166Z"
            fill="url(#a)"
        />
        <Defs>
            <LinearGradient
                id="a"
                x1={-0.44}
                y1={0.06}
                x2={22.439}
                y2={5.157}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#124698" />
                <Stop offset={1} stopColor="#F3BACA" />
            </LinearGradient>
        </Defs>
    </Svg>
)

export default CheckedOneSvg;
