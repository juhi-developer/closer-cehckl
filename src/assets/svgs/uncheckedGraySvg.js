import * as React from "react"
import Svg, { Circle } from "react-native-svg"

const UncheckedGraySvg = (props) => (
    <Svg
        width={22}
        height={23}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Circle cx={11} cy={11.5} r={10.25} stroke="#929292" strokeWidth={1.5} />
    </Svg>
)

export default UncheckedGraySvg;
