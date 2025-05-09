import * as React from "react"
import { Image } from "react-native";
import Svg, { Path, Ellipse } from "react-native-svg"
import { APP_IMAGE } from "../../utils/constants";

const MomentActiveIconSvg = (props) => (
  <Svg
    width={95}
    height={53}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M48.22.002C28.568-.205 18.712 18 0 18h95C77.008 18 67.333.203 48.22.002Z"
      fill="#fff"
    />
    <Image 
    style={{
      width: 45, height: 45, position: "absolute",
      right: 25,
       top: 8,
       resizeMode: "contain"
    }}
    source={APP_IMAGE.momentActive}
    />
    {/* <Ellipse cx={46.941} cy={29.5} rx={22.235} ry={23.5} fill="#124698" /> */}
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M59.814 18.821v9.135c0 2.015-.85 2.822-2.96 2.822H51.49c-2.111 0-2.96-.806-2.96-2.822v-9.135c0-2.015.849-2.821 2.96-2.821h5.363c2.111 0 2.96.806 2.96 2.821Zm-13.941 21.23v-9.136c0-2.015-.85-2.821-2.961-2.821h-5.364c-2.11 0-2.96.806-2.96 2.82v9.136c0 2.015.85 2.821 2.96 2.821h5.364c2.11 0 2.96-.806 2.96-2.82Zm13.94-.003v-3.762c0-2.015-.849-2.821-2.96-2.821H51.49c-2.111 0-2.96.806-2.96 2.821v3.762c0 2.015.849 2.82 2.96 2.82h5.363c2.111 0 2.96-.805 2.96-2.82ZM45.874 18.82v3.762c0 2.015-.85 2.82-2.961 2.82h-5.364c-2.11 0-2.96-.805-2.96-2.82V18.82c0-2.015.85-2.821 2.96-2.821h5.364c2.11 0 2.96.806 2.96 2.821Z"
      fill="#fff"
    />
  </Svg>
)

export default MomentActiveIconSvg;
