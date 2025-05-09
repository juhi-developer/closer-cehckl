import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const PlayRecordAudioIconSvg = (props) => (
  <Svg
    width={58}
    height={58}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={29} cy={29} r={29} fill="#124698" />
    <Path
      d="m37.142 30.694-14.568 8.467a1.692 1.692 0 0 1-.858.239 1.722 1.722 0 0 1-.857-.237l-.033-.021A1.715 1.715 0 0 1 20 37.667V20.731c0-.313.08-.608.228-.867l.021-.034c.146-.24.353-.444.61-.594a1.687 1.687 0 0 1 1.716 0l14.567 8.468A1.712 1.712 0 0 1 38 29.199a1.714 1.714 0 0 1-.858 1.495Z"
      fill="#fff"
    />
  </Svg>
)

export default PlayRecordAudioIconSvg;
