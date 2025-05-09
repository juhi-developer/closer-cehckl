import {Dimensions, PixelRatio} from 'react-native';
const {width, height} = Dimensions.get('window');
// import Device from 'react-native-device-info';

// const isTablet = Device.isTablet();

//Guideline sizes are based on standard ~iphone14" screen mobile device
// const guidelineBaseWidth = width < height ? 428 : 926;
// const guidelineBaseHeight = width < height ? 926 : 428;
const guidelineBaseWidth = width < height ? 393 : 852;
const guidelineBaseHeight = width < height ? 852 : 393;

const aspectRatio = width / height;
// const aspectCompare = aspectRatio / 2.1635514;
const aspectCompare = aspectRatio / 2.16793893;

if (aspectCompare > 1) {
  // const widthNew = height * width < height ? 0.46220302 : 2.1635514;
  // const aspect = widthNew / width < height ? 428 : 926;
  const widthNew = height * width < height ? 0.46126761 : 2.16793893;
  const aspect = widthNew / width < height ? 393 : 852;

  var scale1 = size => aspect * size;
} else {
  var scale1 = size => (width / guidelineBaseWidth) * size;
}

const scaleNew = scale1;
const verticalScaleNew = size => (height / guidelineBaseHeight) * size;
const moderateScaleNew = (size, factor = 0.5) =>
  size + (scaleNew(size) - size) * factor;

export {scaleNew, verticalScaleNew, moderateScaleNew};
