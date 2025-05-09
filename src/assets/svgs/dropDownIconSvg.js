import * as React from "react"
import Svg, { Path } from "react-native-svg"

function DropDownIconSvg(props) {
    return (
        <Svg
            width={16}
            height={17}
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M13.041 6.119l-.515-.516a.325.325 0 00-.474 0L8 9.655 3.948 5.603a.326.326 0 00-.474 0l-.515.516a.326.326 0 000 .474l4.804 4.804a.326.326 0 00.474 0l4.804-4.804a.326.326 0 000-.474z"
                fill="#222"
            />
        </Svg>
    )
}

export default DropDownIconSvg;
