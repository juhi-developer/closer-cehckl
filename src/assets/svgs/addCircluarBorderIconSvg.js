import * as React from "react"
import Svg, { Path } from "react-native-svg"

const AddCircularBorderIconSvg = (props) => (
    <Svg
        width={28}
        height={28}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M14 26.542C7.08 26.542 1.458 20.918 1.458 14S7.081 1.458 14 1.458C20.918 1.458 26.54 7.082 26.54 14S20.918 26.542 14 26.542Zm0-23.334C8.05 3.208 3.208 8.05 3.208 14S8.05 24.792 14 24.792 24.79 19.95 24.79 14 19.95 3.208 14 3.208Z"
            fill="#124698"
        />
        <Path
            d="M18.666 14.875H9.333A.881.881 0 0 1 8.458 14c0-.478.397-.875.875-.875h9.333c.479 0 .875.397.875.875a.881.881 0 0 1-.875.875Z"
            fill="#124698"
        />
        <Path
            d="M14 19.542a.881.881 0 0 1-.875-.875V9.333c0-.478.397-.875.875-.875s.875.397.875.875v9.334a.881.881 0 0 1-.875.875Z"
            fill="#124698"
        />
    </Svg>
)

export default AddCircularBorderIconSvg;
