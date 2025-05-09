import * as React from "react"
import Svg, { Path } from "react-native-svg"

const AddCircleIconSvg = (props) => (
    <Svg
        width={25}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M12.769 22.75c-5.93 0-10.75-4.82-10.75-10.75s4.82-10.75 10.75-10.75S23.519 6.07 23.519 12s-4.82 10.75-10.75 10.75Zm0-20c-5.1 0-9.25 4.15-9.25 9.25s4.15 9.25 9.25 9.25 9.25-4.15 9.25-9.25-4.15-9.25-9.25-9.25Z"
            fill="#292D32"
        />
        <Path
            d="M16.769 12.75h-8c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h8c.41 0 .75.34.75.75s-.34.75-.75.75Z"
            fill="#292D32"
        />
        <Path
            d="M12.769 16.75c-.41 0-.75-.34-.75-.75V8c0-.41.34-.75.75-.75s.75.34.75.75v8c0 .41-.34.75-.75.75Z"
            fill="#292D32"
        />
    </Svg>
)

export default AddCircleIconSvg;
