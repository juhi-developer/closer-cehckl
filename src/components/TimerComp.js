import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import { globalStyles } from '../styles/globalStyles';

const TimerComp = ({timeVal = 60, textStyle = {}, startTimer}) => {
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    let ret = '';

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;

    return ret;
  }
  return (
    <View>
      <Text style={{
        ...globalStyles.regularSmallText,
        color: "rgba(47, 58, 78, 0.60)"
      }}>{formatTime(timeVal)}</Text>
    </View>
  );
};

export default TimerComp;

// const Timer = ({ seconds }) => {
//     // initialize timeLeft with the seconds prop
//     const [timeLeft, setTimeLeft] = useState(seconds);

//     useEffect(() => {
//       // exit early when we reach 0
//       if (!timeLeft) return;

//       // save intervalId to clear the interval when the
//       // component re-renders
//       const intervalId = setInterval(() => {
//         setTimeLeft(timeLeft - 1);
//       }, 1000);

//       // clear interval on re-render to avoid memory leaks
//       return () => clearInterval(intervalId);
//       // add timeLeft as a dependency to re-rerun the effect
//       // when we update it
//     }, [timeLeft]);

//     return (
//       <div>
//         <h1>{timeLeft}</h1>
//       </div>
//     );
//   };
