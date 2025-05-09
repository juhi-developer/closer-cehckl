import * as React from "react"
import Svg, { Path } from "react-native-svg"

const MoreVerticleIconSvg = (props) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M11 7.333A1.839 1.839 0 0 0 12.833 5.5 1.839 1.839 0 0 0 11 3.667 1.839 1.839 0 0 0 9.167 5.5c0 1.008.825 1.833 1.833 1.833Zm0 1.834A1.839 1.839 0 0 0 9.167 11c0 1.008.825 1.833 1.833 1.833A1.839 1.839 0 0 0 12.833 11 1.839 1.839 0 0 0 11 9.167Zm0 5.5A1.839 1.839 0 0 0 9.167 16.5c0 1.008.825 1.833 1.833 1.833a1.839 1.839 0 0 0 1.833-1.833A1.839 1.839 0 0 0 11 14.667Z"
            fill={props.fill}
            fillOpacity={0.87}
        />
    </Svg>
)

export default MoreVerticleIconSvg;
