import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ReplyChatIconSvg = (props) => (
    <Svg
        width={24}
        height={25}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="m18.47 17.347.39 3.16c.1.83-.79 1.41-1.5.98l-4.19-2.49c-.46 0-.91-.03-1.35-.09a4.86 4.86 0 0 0 1.18-3.16c0-2.84-2.46-5.14-5.5-5.14-1.16 0-2.23.33-3.12.91-.03-.25-.04-.5-.04-.76 0-4.55 3.95-8.24 8.83-8.24S22 6.207 22 10.757c0 2.7-1.39 5.09-3.53 6.59Z"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M13 15.747c0 1.19-.44 2.29-1.18 3.16-.99 1.2-2.56 1.97-4.32 1.97l-2.61 1.55c-.44.27-1-.1-.94-.61l.25-1.97c-1.34-.93-2.2-2.42-2.2-4.1 0-1.76.94-3.31 2.38-4.23.89-.58 1.96-.91 3.12-.91 3.04 0 5.5 2.3 5.5 5.14Z"
            stroke="#2F3A4E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

export default ReplyChatIconSvg;
