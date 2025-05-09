import * as React from "react"
import Svg, { Path } from "react-native-svg"

const PlayIconSvg = (props) => (
    <Svg
        width={13}
        height={14}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="m11.462 7.947-9.62 5.591c-.179.105-.373.158-.566.158a1.137 1.137 0 0 1-.566-.157l-.022-.014a1.134 1.134 0 0 1-.545-.974V1.368c0-.207.052-.402.15-.573L.307.773C.404.613.54.48.71.381a1.114 1.114 0 0 1 1.133 0l9.619 5.591a1.13 1.13 0 0 1 .566.987 1.14 1.14 0 0 1-.566.988Z"
            fill="#fff"
        />
    </Svg>
)

export default PlayIconSvg;
