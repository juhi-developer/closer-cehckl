import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

const ProfileUploadIconSvg = (props) => (
    <Svg
        width={230}
        height={230}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Rect width={230} height={230} rx={115} fill="#D8E7F8" />
        <Path
            d="M115.326 31.667c-21.834 0-39.584 17.75-39.584 39.583 0 21.417 16.75 38.75 38.584 39.5.666-.083 1.333-.083 1.833 0h.583a39.484 39.484 0 0 0 38.167-39.5c0-21.833-17.75-39.583-39.583-39.583Zm42.333 101.241c-23.25-15.5-61.167-15.5-84.583 0-10.584 7.084-16.417 16.667-16.417 26.917s5.833 19.75 16.333 26.75c11.667 7.833 27 11.75 42.334 11.75 15.333 0 30.666-3.917 42.333-11.75 10.5-7.083 16.333-16.583 16.333-26.917-.083-10.25-5.833-19.75-16.333-26.75Z"
            fill="#fff"
            fillOpacity={0.5}
        />
        <Rect x={175.5} y={184.5} width={33} height={33} rx={16.5} fill="#fff" />
        <Path
            d="M192 193.944v14.113M184.943 201h14.113"
            stroke="#124698"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Rect
            x={175.5}
            y={184.5}
            width={33}
            height={33}
            rx={16.5}
            stroke="#F5F1F0"
            strokeWidth={3}
        />
    </Svg>
)

export default ProfileUploadIconSvg;
