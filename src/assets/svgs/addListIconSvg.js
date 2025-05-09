import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const AddListIconSvg = props => (
  <Svg
    width={34}
    height={34}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M17 7.083v19.834M7.083 17h19.834"
      stroke="#2F3A4E"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default AddListIconSvg;
