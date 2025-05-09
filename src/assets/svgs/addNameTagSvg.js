import * as React from "react"
import Svg, { Path } from "react-native-svg"

const AddNameTagSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2F3A4E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-5"
    />
    <Path
      stroke="#2F3A4E"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M15.75 5h5.5M18.5 7.75v-5.5"
    />
    <Path
      stroke="#2F3A4E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18 17.76h-1.85M13.47 17.76H7M18 14h-5.53M9.77 14H7"
    />
  </Svg>
)
export default AddNameTagSvg;
