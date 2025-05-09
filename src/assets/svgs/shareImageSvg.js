import * as React from "react"
import Svg, { Path, G, Defs, ClipPath } from "react-native-svg"

const ShareImageSvg = (props) => (
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
      d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
    />
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
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m2.67 18.95 4.93-3.31c.79-.53 1.93-.47 2.64.14l.33.29c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0L22 13.9"
    />
    <G
      stroke="#2F3A4E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.5}
      clipPath="url(#a)"
    >
      <Path
        fill="#2F3A4E"
        d="M21 2.667a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM21 7.335a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
      <Path d="M17.863 4.503 20.14 5.83M20.137 2.17l-2.274 1.327" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M15 0h8v8h-8z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default ShareImageSvg;
