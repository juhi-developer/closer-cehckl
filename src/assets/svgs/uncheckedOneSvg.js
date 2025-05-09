import * as React from "react"
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg"

const UncheckedOneSvg = (props) => (
    <Svg
        width={22}
        height={22}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Circle cx={11} cy={11} r={10.25} stroke="url(#a)" strokeWidth={1.5} />
        <Defs>
            <LinearGradient
                id="a"
                x1={-0.44}
                y1={-0.44}
                x2={22.439}
                y2={4.657}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#124698" />
                <Stop offset={1} stopColor="#F3BACA" />
            </LinearGradient>
        </Defs>
    </Svg>
)

export default UncheckedOneSvg;
