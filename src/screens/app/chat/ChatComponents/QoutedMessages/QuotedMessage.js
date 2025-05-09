import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import React from 'react';
import {SCREEN_WIDTH, globalStyles} from '../../../../../styles/globalStyles';
import {VARIABLES} from '../../../../../utils/variables';
import {scale} from '../../../../../utils/metrics';
import RNFS from 'react-native-fs';
import {APP_IMAGE, STICKERS} from '../../../../../utils/constants';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
import FastImage from 'react-native-fast-image';
import {colors} from '../../../../../styles/colors';

const QuotedMessage = ({item}) => {
  let textColor = '';
  const sentByUser = item?.sender === VARIABLES.user?._id;
  if (sentByUser) {
    if (VARIABLES.user?.iconColor === 1) {
      textColor = '#619FFF';
    } else {
      textColor = '#5B44BB';
    }
  } else {
    if (VARIABLES?.user?.partnerData?.partner?.iconColor === 1) {
      textColor = '#619FFF';
    } else {
      textColor = '#5B44BB';
    }
  }
  return (
    <View style={{paddingTop: scale(10)}}>
      {(() => {
        switch (item.type) {
          case 'message':
            return <QuotedText quoted={item} textColor={textColor} />;
          case 'sticker':
            return <QuotedSticker quoted={item} textColor={textColor} />;
          case 'emoji':
            return (
              <QuotedSticker type="emoji" quoted={item} textColor={textColor} />
            );
          case 'location':
            return (
              <QuotedLocation
                lat={item.lat}
                long={item.long}
                textColor={textColor}
              />
            );
          case 'doc':
            return <QuotedDocument quoted={item} textColor={textColor} />;
          case 'image':
            return <QuotedChatImage quoted={item} textColor={textColor} />;
          case 'video':
            return <QuotedChatVideo quoted={item} textColor={textColor} />;
          case 'link':
            return (
              <QuotedChatLinkPreview quoted={item} textColor={textColor} />
            );
          case 'audio':
            return <QuotedChatAudio quoted={item} textColor={textColor} />;
          case 'story':
            return <QuotedStoryImage quoted={item} textColor={textColor} />;
          case 'gif':
            return <QuotedGif quoted={item} textColor={textColor} />;
          default:
            break;
        }
      })()}
    </View>
  );
};

export default QuotedMessage;

const QuotedText = ({quoted, textColor}) => {
  return (
    <View
      style={{
        ...quotedTextStyles.container,
        backgroundColor: colors.blue3,
      }}>
      <Text
        style={{
          ...globalStyles.semiBoldLargeText,
          color: textColor,
        }}>
        {quoted?.sender === VARIABLES.user?._id
          ? 'You'
          : VARIABLES.user?.partnerData?.partner?.name}
      </Text>
      <Text style={quotedTextStyles.textStyle} numberOfLines={3}>
        {quoted?.message}
      </Text>
    </View>
  );
};

const quotedTextStyles = StyleSheet.create({
  container: {
    padding: scale(10),
    backgroundColor: colors.blue3,
    borderRadius: scale(10),
    marginBottom: scale(5),
  },
  textStyle: {...globalStyles.regularMediumText, marginTop: 3},
  imageStyles: {
    width: scale(40),
    height: scale(70),
    marginHorizontal: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: 'flex-end',
  },
});

const QuotedSticker = ({quoted, textColor, type = 'sticker'}) => {
  return (
    <View
      style={{
        ...quotedStickerStyles.container,
        backgroundColor: colors.blue3,
      }}>
      <View style={quotedStickerStyles.namecontainer}>
        <Text style={{...globalStyles.semiBoldLargeText, color: textColor}}>
          {quoted?.sender === VARIABLES.user?._id
            ? 'You'
            : VARIABLES.user?.partnerData?.partner?.name}
        </Text>
      </View>
      {type === 'sticker' ? (
        <Image
          source={STICKERS[Number(quoted.message)]?.sticker}
          style={quotedStickerStyles.stickerImg}
        />
      ) : (
        <Text
          style={{
            fontSize: scale(20),
            marginRight: 8,
            color: '#000',
          }}>
          {quoted.message}
        </Text>
      )}
    </View>
  );
};

const quotedStickerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blue3,
    borderRadius: scale(10),
    marginBottom: scale(5),
  },
  namecontainer: {padding: 10},
  stickerImg: {
    width: scale(40),
    height: '100%',
    marginStart: 10,
    resizeMode: 'contain',
    marginRight: 3,
  },
});

const QuotedChatImage = ({quoted, textColor}) => {
  return (
    <View
      style={{
        ...quotedChatImageStyles.container,
        backgroundColor: colors.blue3,
      }}>
      <View style={quotedChatImageStyles.textContainer}>
        <Text style={{...globalStyles.semiBoldLargeText, color: textColor}}>
          {quoted?.sender === VARIABLES.user?._id
            ? 'You'
            : VARIABLES.user?.partnerData?.partner?.name}
        </Text>
        <Text style={quotedChatImageStyles.textLabel}>Photo</Text>
      </View>
      <Image
        source={{uri: `file://${RNFS.DocumentDirectoryPath}/${quoted.message}`}}
        style={quotedChatImageStyles.imageStyles}
      />
    </View>
  );
};

const QuotedStoryImage = ({quoted, textColor}) => {
  return (
    // <View
    //   style={{
    //     ...quotedChatImageStyles.container,
    //     backgroundColor: colors.blue3,
    //   }}>
    //   <View style={quotedChatImageStyles.textContainer}>
    //     <Text style={{...globalStyles.semiBoldLargeText, color: textColor}}>
    //       {quoted?.sender === VARIABLES.user?._id
    //         ? 'You'
    //         : VARIABLES.user?.partnerData?.partner?.name}
    //     </Text>
    //     <Text style={quotedChatImageStyles.textLabel}>{quoted.message}</Text>
    //   </View>
    //   <FastImage source={{uri: quoted.storyImage}} style={quotedChatImageStyles.imageStyles} />
    // </View>

    <View
      style={{
        ...quotedDocStyles.container,
        backgroundColor: colors.blue3,
      }}>
      <View style={quotedDocStyles.textContainer}>
        <Text style={{...globalStyles.semiBoldLargeText, color: textColor}}>
          {quoted?.sender === VARIABLES.user?._id
            ? 'You'
            : VARIABLES.user?.partnerData?.partner?.name}
        </Text>
        <Text style={quotedDocStyles.textLabel} numberOfLines={2}>
          {quoted.message}
        </Text>
      </View>
      <FastImage
        source={{uri: quoted.storyImage}}
        style={quotedDocStyles.imageStyles}
      />
    </View>
  );
};

const quotedChatImageStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blue3,
    borderRadius: scale(10),
    marginBottom: scale(5),
  },
  textContainer: {padding: 10, paddingEnd: scale(60)},
  textLabel: {...globalStyles.regularMediumText, marginTop: 6},
  imageStyles: {
    width: scale(75),
    height: '100%',
    marginStart: 10,
    backgroundColor: 'lightgrey',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: 'flex-end',
  },
});

const QuotedChatVideo = ({quoted, textColor}) => {
  return (
    <View
      style={{
        ...quotedChatVidStyles.container,
        backgroundColor: colors.blue3,
      }}>
      <View style={quotedChatVidStyles.textContainer}>
        <Text
          style={{
            ...globalStyles.semiBoldLargeText,
            color: textColor,
          }}>
          {quoted?.sender === VARIABLES.user?._id
            ? 'You'
            : VARIABLES.user?.partnerData?.partner?.name}
        </Text>
        <Text style={quotedChatVidStyles.labelStyles}>Video</Text>
      </View>
      <FastImage
        source={{
          uri: `file://${RNFS.DocumentDirectoryPath}/${quoted.thumbnailImage}`,
        }}
        style={quotedChatVidStyles.imageStyles}
      />
    </View>
  );
};

const quotedChatVidStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blue3,
    borderRadius: scale(10),
    marginBottom: scale(5),
  },
  textContainer: {
    padding: 10,
    paddingEnd: scale(60),
  },
  labelStyles: {
    ...globalStyles.regularMediumText,
    marginTop: 6,
  },
  imageStyles: {
    width: scale(75),
    height: '100%',
    marginStart: 10,
    backgroundColor: 'lightgrey',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: 'flex-end',
  },
});

const QuotedLocation = ({lat, long, quoted, textColor}) => {
  const prepareStaticMapUrl = (latitude, longitude) => {
    let baseURL = 'https://maps.googleapis.com/maps/api/staticmap?';
    let url = new URL(baseURL);
    let params = url.searchParams;
    params.append('center', `${latitude},${longitude}`);
    params.append('zoom', '18');
    params.append('size', '300x300');
    params.append('maptype', 'roadmap');
    params.append('key', 'AIzaSyC9GvyjT81OMWatHLczAlDI1B7ICtG_pEg');
    return url.toString();
  };

  const mapApi = prepareStaticMapUrl(lat, long);

  return (
    <View
      style={{
        ...quotedChatLocStyles.container,
        backgroundColor: colors.blue3,
      }}>
      <View style={quotedChatLocStyles.textContainer}>
        <Text
          style={{
            ...globalStyles.semiBoldLargeText,
            color: textColor,
          }}>
          {quoted?.sender === VARIABLES.user?._id
            ? 'You'
            : VARIABLES.user?.partnerData?.partner?.name}
        </Text>
        <Text style={quotedChatLocStyles.textLabel}>Location</Text>
      </View>
      <ImageBackground
        source={{uri: mapApi}}
        style={quotedChatLocStyles.imageContainer}
        imageStyle={quotedChatLocStyles.imageStyles}
      />
    </View>
  );
};

const quotedChatLocStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blue3,
    borderRadius: scale(10),
    marginBottom: scale(5),
  },
  textContainer: {padding: 10, paddingEnd: scale(60)},
  textLabel: {...globalStyles.regularMediumText, marginTop: 6},
  imageContainer: {width: scale(75), height: '100%'},
  imageStyles: {
    borderTopRightRadius: scale(10),
    borderBottomRightRadius: scale(10),
  },
});

const QuotedDocument = ({quoted, textColor}) => {
  return (
    <View
      style={{
        ...quotedDocStyles.container,
        backgroundColor: colors.blue3,
      }}>
      <View style={quotedDocStyles.textContainer}>
        <Text style={{...globalStyles.semiBoldLargeText, color: textColor}}>
          {quoted?.sender === VARIABLES.user?._id
            ? 'You'
            : VARIABLES.user?.partnerData?.partner?.name}
        </Text>
        <Text style={quotedDocStyles.textLabel} numberOfLines={2}>
          {quoted.docName}
        </Text>
      </View>
      <Image source={APP_IMAGE.pdfImage} style={quotedDocStyles.imageStyles} />
    </View>
  );
};

const quotedDocStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(10),
    marginBottom: scale(5),
    minWidth: SCREEN_WIDTH * 0.5,
  },
  textContainer: {padding: 10, flex: 1},
  textLabel: {...globalStyles.regularMediumText, marginTop: 6, flex: 1},
  imageStyles: {
    width: scale(60),
    height: '100%',
    // marginHorizontal: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: 'flex-end',
    resizeMode: 'contain',
  },
});

const QuotedChatLinkPreview = ({quoted, textColor}) => {
  return (
    <View
      style={{
        ...quotedChatLinkStyles.container,
        backgroundColor: colors.blue3,
      }}>
      <View style={quotedChatLinkStyles.textContainer}>
        <Text
          style={{
            ...globalStyles.semiBoldLargeText,

            color: textColor,
          }}>
          {quoted?.sender === VARIABLES.user?._id
            ? 'You'
            : VARIABLES.user?.partnerData?.partner?.name}
        </Text>
        <Text style={quotedChatLinkStyles.textLabel} numberOfLines={2}>
          {quoted.message}
        </Text>
      </View>
      <LinkPreview
        text={quoted?.message}
        touchableWithoutFeedbackProps={{
          disabled: true,
        }}
        renderLinkPreview={({previewData}) => {
          console.log({previewData});
          return (
            <Image
              source={{uri: previewData?.image?.url}}
              style={quotedChatLinkStyles.linkImgStyles}
            />
          );
        }}
      />
    </View>
    // <View style={quotedChatLinkStyles.container}>
    //   <View style={quotedChatLinkStyles.textContainer}>
    //     <Text style={{...globalStyles.semiBoldLargeText}}>
    //       {quoted?.sender === VARIABLES.user?._id
    //         ? 'You'
    //         : VARIABLES.user?.partnerData?.partner?.name}
    //     </Text>
    //     <Text style={quotedChatLinkStyles.textLabel}>{quoted.message}</Text>
    //   </View>

    // </View>
  );
};

const quotedChatLinkStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.blue3,
    borderRadius: scale(10),
    marginBottom: scale(5),
    width: SCREEN_WIDTH * 0.55,
    paddingLeft: scale(5),
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
    padding: 5,
  },
  textLabel: {...globalStyles.regularMediumText, marginTop: 6, flex: 1},
  imageStyles: {
    width: scale(40),
    height: '100%',
    marginHorizontal: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: 'flex-end',
  },
  linkImgStyles: {
    width: scale(75),
    height: 70,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

const QuotedChatAudio = ({quoted, textColor}) => {
  return (
    <View
      style={{
        ...quotedChatAudioStyles.container,
        backgroundColor: colors.blue3,
      }}>
      <View style={quotedChatAudioStyles.textContainer}>
        <Text style={{...globalStyles.semiBoldLargeText, color: textColor}}>
          {quoted?.sender === VARIABLES.user?._id
            ? 'You'
            : VARIABLES.user?.partnerData?.partner?.name}
        </Text>
        <Text style={quotedChatAudioStyles.textLabel}>
          Voice message ({quoted.recordTime})
        </Text>
      </View>
    </View>
  );
};

const quotedChatAudioStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blue3,
    borderRadius: scale(10),
    marginBottom: scale(5),
  },
  textContainer: {padding: 10, paddingEnd: scale(10)},
  textLabel: {...globalStyles.regularMediumText, marginTop: 6},
  imageStyles: {
    width: scale(40),
    height: '100%',
    marginStart: 10,
    backgroundColor: 'lightgrey',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: 'flex-end',
  },
});

const QuotedGif = ({quoted, textColor}) => {
  return (
    <View
      style={{
        ...quotedGifStyles.container,
        backgroundColor: colors.blue3,
      }}>
      <View style={quotedGifStyles.textContainer}>
        <Text style={{...globalStyles.semiBoldLargeText, color: textColor}}>
          {quoted?.sender === VARIABLES.user?._id
            ? 'You'
            : VARIABLES.user?.partnerData?.partner?.name}
        </Text>
        <Text style={quotedGifStyles.textLabel}>Gif</Text>
      </View>
      <FastImage
        source={{uri: quoted.message}}
        style={quotedGifStyles.imageStyles}
      />
    </View>
  );
};

const quotedGifStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blue3,
    borderRadius: scale(10),
    marginBottom: scale(5),
  },
  textContainer: {padding: 10, paddingEnd: scale(60)},
  textLabel: {...globalStyles.regularMediumText, marginTop: 6},
  imageStyles: {
    width: scale(75),
    height: '100%',
    marginStart: 10,
    backgroundColor: 'lightgrey',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignSelf: 'flex-end',
  },
});
