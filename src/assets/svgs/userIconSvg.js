import * as React from "react"
import Svg, { Path } from "react-native-svg"

const UserIconSvg = (props) => (
    <Svg
        width={28}
        height={28}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M14 14a5.833 5.833 0 1 0 0-11.667A5.833 5.833 0 0 0 14 14ZM24.022 25.667c0-4.515-4.492-8.167-10.022-8.167S3.978 21.152 3.978 25.667"
            stroke="#124698"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default UserIconSvg;
