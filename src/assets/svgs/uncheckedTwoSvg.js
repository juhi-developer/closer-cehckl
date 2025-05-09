import * as React from "react"
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg"

const UncheckedTwoSvg = (props) => (
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

export default UncheckedTwoSvg;
