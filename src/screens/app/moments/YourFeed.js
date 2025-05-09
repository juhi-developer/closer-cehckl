/* eslint-disable no-catch-shadow */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useEffect, useState, useMemo, useCallback} from 'react';
import FeedCard from '../../../components/FeedCard';
import RNFS from 'react-native-fs';
import {scale} from '../../../utils/metrics';
import CenteredHeader from '../../../components/centeredHeader';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import {
  BOTTOM_SPACE,
  SCREEN_WIDTH,
  globalStyles,
} from '../../../styles/globalStyles';
import AppView from '../../../components/AppView';
import {useDispatch, useSelector} from 'react-redux';
import {
  addCommentToPost,
  addReactionToPost,
  deleteCommentPost,
  deletePost,
  getMomentsData,
} from '../../../redux/saga/handlers';
import {VARIABLES} from '../../../utils/variables';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {STICKERS} from '../../../utils/constants';
import {
  delay,
  shareUrlImageStory,
  updateRecentlyUsedEmoji,
} from '../../../utils/helpers';
import {ToastMessage} from '../../../components/toastMessage';
import {AddReaction} from '../../../redux/actions';
import API from '../../../redux/saga/request';
import {useNetInfo} from '@react-native-community/netinfo';
import FastImage from 'react-native-fast-image';
import {colors} from '../../../styles/colors';
import ShareImageSvg from '../../../assets/svgs/shareImageSvg';
import DeleteIconSvg from '../../../assets/svgs/deleteIconSvg';
import OverlayLoader from '../../../components/overlayLoader';
import StickersBottomSheet from '../../../components/bottomSheet/StickersBottomSheet';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

const CONTENT_MESSAGE = [
  {
    id: 1,
    key: 'Delete',
    label: 'Delete comment',
    icon: <DeleteIconSvg />,
  },
];

const CONTENT_POST = [
  // {
  //   id: 1,
  //   key: 'Reply_Chat',
  //   label: 'Reply in chat',
  //   icon: <AddDocumentIconSvg />,
  // },
  {
    id: 1,
    key: 'Share_Image',
    label: 'Share Post',
    icon: <ShareImageSvg />,
  },
  {
    id: 2,
    key: 'Delete_Image',
    label: 'Delete Post',
    icon: <DeleteIconSvg />,
  },
];

const CONTENT_POST_WITHOUT_DELETE = [
  // {
  //   id: 1,
  //   key: 'Reply_Chat',
  //   label: 'Reply in chat',
  //   icon: <AddDocumentIconSvg />,
  // },
  {
    id: 1,
    key: 'Share_Image',
    label: 'Share Post',
    icon: <ShareImageSvg />,
  },
];

const CleverTap = require('clevertap-react-native');

export default function YourFeed(props) {
  const {route} = props;
  const flatListRef = useRef();
  const dispatch = useDispatch();
  const netInfo = useNetInfo();

  const scrollToIndex = route.params?.index;

  const {
    posts: postData,
    hasMore,
    currentPage,
    error,
    loading: isLoading,
    footerLoader,
  } = useSelector(state => state.moments);

  const [uploading, setUploading] = useState(false);

  const [sheetEnabled, setSheetEnabled] = useState(false);
  const [reactionData, setReactionData] = useState('');
  const [deletedPostId, setDeletedPostId] = useState('');
  const [commentId, setCommentId] = useState('');

  const bottomSheetModalPostRef = useRef(null);

  const bottomSheetModalCommentRef = useRef(null);

  const [stickersBottomSheetVisible, setStickersBottomSheetVisible] =
    useState(false);

  const [postID, setPostID] = useState('');
  const [createdById, setCreatedById] = useState('');
  const [sharedURL, setSharedURL] = useState('');

  const snapPointsPost = useMemo(
    () => [
      SCREEN_WIDTH / 3.5 + BOTTOM_SPACE,
      SCREEN_WIDTH / 3.5 + BOTTOM_SPACE,
    ],
    [],
  );

  const [itemHeights, setItemHeights] = useState({});

  const snapPointsComment = useMemo(
    () => [
      SCREEN_WIDTH / 3.8 + BOTTOM_SPACE,
      SCREEN_WIDTH / 3.8 + BOTTOM_SPACE,
    ],
    [],
  );

  // Improve getItemLayout with cached measurements
  const [layoutCache, setLayoutCache] = useState({});

  const getItemLayout = (data, index) => {
    if (layoutCache[index]) {
      return layoutCache[index];
    }

    let offset = 0;
    const defaultHeight = scale(750);

    // Use cached heights for previous items
    for (let i = 0; i < index; i++) {
      const cachedItem = layoutCache[i];
      if (cachedItem) {
        offset += cachedItem.length;
      } else {
        offset += (itemHeights[i] || defaultHeight) + scale(20);
      }
    }

    const height = itemHeights[index] || defaultHeight;
    const layout = {
      length: height,
      offset,
      index,
    };

    // Cache the calculation
    setLayoutCache(prev => ({
      ...prev,
      [index]: layout,
    }));

    return layout;
  };

  const handleSheetNoteChanges = useCallback(index => {
    // console.log('handleSheetChanges', index);
    if (index === -1) {
      console.log('close modal');
      // bottomSheetModalRef.current.dismiss()
      setSheetEnabled(false);
    }
  }, []);

  // callbacks
  const handlePresentModalCommentPress = useCallback(() => {
    bottomSheetModalCommentRef.current.present();
    setSheetEnabled(true);
  }, []);

  const handleSheetCommentChanges = useCallback(index => {
    // console.log('handleSheetChanges', index);
    if (index === -1) {
      setCommentId('');
      // bottomSheetModalRef.current.dismiss()
      setSheetEnabled(false);
    }
  }, []);

  function _renderFooterPosts() {
    if (hasMore && footerLoader) {
      return (
        <View style={{height: 20, marginBottom: 20, marginTop: 10}}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
  }

  const AppHeader = () => {
    return (
      <CenteredHeader
        leftIcon={<ArrowLeftIconSvg />}
        leftPress={() => props.navigation.goBack()}
        title={'Your Feed'}
        titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const itemContentSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 1.5,
          backgroundColor: colors.red4,
          width: '100%',
          marginVertical: 10,
        }}
      />
    );
  };

  const itemSeparatorComponent = () => {
    return (
      <View
        style={{
          // height: 1.5,
          // backgroundColor: strokeColor,
          // width: '100%',
          marginTop: scale(20),
        }}
      />
    );
  };

  const handlePresentModalPostPress = useCallback(() => {
    bottomSheetModalPostRef.current.present();
    setSheetEnabled(true);
  }, []);

  const handlePresentEmojiModalPress = useCallback(() => {
    Keyboard.dismiss();
    setStickersBottomSheetVisible(true);

    setSheetEnabled(true);
  }, []);

  const addContentNoteItem = ({item, index}) => {
    return (
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={async () => {
          if (item.key === 'Delete_Image') {
            if (netInfo.isConnected === false) {
              ToastMessage('Network issue :(', 'Please Check Your Network !');
              return;
            }
            //   setLoading(true);
            let params = {
              id: postID,
            };
            bottomSheetModalPostRef.current.dismiss();
            setSheetEnabled(false);
            //  dispatch(deletePost(postId));

            dispatch(deletePost(postID));
          } else if (item.key === 'Share_Image') {
            bottomSheetModalPostRef?.current?.dismiss?.();
            setUploading(true);
            await delay(1000);

            console.log('sharedddd urlll post', sharedURL);
            shareUrlImageStory({
              image: sharedURL,
            }).finally(res => {
              setUploading(false);
              setSheetEnabled(false);
              bottomSheetModalPostRef.current.dismiss();
            });
          }
        }}>
        {/* <Image source={item.image}/> */}
        <View>{item.icon}</View>
        <Text style={{...globalStyles.regularLargeText, marginStart: 16}}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const SendReactionHandler = (reaction, id, type, reactionDataNotes) => {
    // CleverTap.recordEvent('Sticker reactions added');
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    console.log('reactionnn', reaction, type);
    if (reaction.type !== undefined) {
      if (reaction.type === 'emoji' || reaction.type === 'post') {
        let params = {
          id: reactionData.id,
          type: reactionData.type,
          reaction: reaction,
          reactionNew: id?.toString(),
          reactionType: type,
        };

        dispatch(AddReaction(params));
      } else if (reactionData.type === 'comment') {
        sendCommentReaction(reaction, id, type);
        // SendPostReactionHandler(reaction, type)
      }
    } else {
      if (
        reactionDataNotes.type === 'message' ||
        reactionDataNotes.type === 'audio'
      ) {
        // addReactionToStickyNote(reaction, type, reactionDataNotes);
      } else if (type === 'sticker' || type === 'emoji' || type === 'post') {
        let params = {
          id: reactionDataNotes !== '' ? reactionDataNotes.id : reactionData.id,
          type:
            reactionDataNotes !== ''
              ? reactionDataNotes.type
              : reactionData.type,
          reaction: reaction,
          reactionNew: id?.toString(),
          reactionType: type,
        };

        CleverTap.recordEvent('Reactions on posts');

        dispatch(addReactionToPost(params));

        //   dispatch(AddReaction(params));
      }
    }
  };

  const sendCommentReaction = async (reaction, id, type) => {
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    try {
      const resp = await API('user/moments/reaction', 'POST', {
        type: 'comment',
        reactionType: type,
        reaction,
        reactionNew: id?.toString(),
        id: reactionData.id,
      });
      if (resp.body.statusCode === 200) {
        console.log('resp coment reaction', resp.body.data);
      }
    } catch (error) {
      console.log('send comment error', error);
    }
  };

  const onPressAddComment = data => {
    if (data.comment.trim() === '') {
      return;
    }
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    CleverTap.recordEvent('Memories comments added');

    dispatch(addCommentToPost(data.comment, data.postId));
    //  setComment('');

    //  dispatch(AddComment(data));
  };

  const deleteCommentContent = ({item, index}) => {
    return (
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          if (netInfo.isConnected === false) {
            ToastMessage('Network issue :(', 'Please Check Your Network !');
            return;
          }
          bottomSheetModalCommentRef.current.dismiss();
          if (item.key === 'Delete') {
            // setGalleryAndCameraModal(true)

            dispatch(deleteCommentPost(commentId));
            setCommentId('');

            // setLoading(true);
            //     dispatch(DeleteComment(params));
            setSheetEnabled(false);
          }
        }}>
        <View>{item.icon}</View>
        <Text style={{...globalStyles.regularLargeText, marginStart: 16}}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const renderFeedItem = useCallback(({item, index}) => {
    return (
      <View
      // onLayout={event => {
      //   const {height} = event.nativeEvent.layout;
      //   setItemHeights(prev => {
      //     const newHeights = {...prev, [index]: height};
      //     return newHeights;
      //   });

      //   // Update layout cache when height changes
      //   setLayoutCache(prev => ({
      //     ...prev,
      //     [index]: {
      //       length: height,
      //       offset: prev[index]?.offset || index * height,
      //       index,
      //     },
      //   }));
      // }}
      >
        <FeedCard
          index={index}
          onPressCard={() => {
            // props.navigation.navigate('YourFeed', {
            //   postData,
            //   index,
            //   page
            // });
          }}
          onPressCommentDelete={() => {
            setDeletedPostId(item._id);
            setCommentId(item?.comments[0]?._id);
            handlePresentModalCommentPress();
          }}
          onPressReaction={obj => {
            setReactionData(obj);
            handlePresentEmojiModalPress();
          }}
          item={item}
          navigation={props.navigation}
          onSubmit={params => {
            onPressAddComment(params);
          }}
          onPressMore={visibleIndex => {
            setSharedURL(
              `file://${RNFS.DocumentDirectoryPath}/${item.images[visibleIndex]?.url}`,
            );
            ///   setSharedURL(`${AWS_URL_S3}${item.url}`);
            setCreatedById(item?.user?._id);
            setPostID(item._id);
            handlePresentModalPostPress();
          }}
        />
      </View>
    );
  }, []);

  useEffect(() => {
    // setTimeout(() => {
    flatListRef.current.scrollToIndex({
      index: scrollToIndex,
      animated: true,
    });
    // }, 500);
  }, []);

  const scrollToIndexFailed = error => {
    console.log('error scroll to index failed', error);
    const offset = error.averageItemLength * error.index;
    console.log('offset', offset);
    flatListRef.current.scrollToOffset({offset});
    setTimeout(
      () => flatListRef.current.scrollToIndex({index: error.index}),
      100,
    ); // You may choose to skip this line if the above typically works well because your average item height is accurate.
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      dispatch(getMomentsData(currentPage));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={'padding'}
      // keyboardVerticalOffset={keyboardHeight}
    >
      <AppView
        scrollContainerRequired={false}
        isScrollEnabled={false}
        isLoading={isLoading}
        header={AppHeader}>
        <OverlayLoader visible={uploading} />
        <FlatList
          ref={flatListRef}
          initialNumToRender={scrollToIndex + 5}
          ///initialScrollIndex={scrollToIndex}
          //  getItemLayout={getItemLayout}
          ListFooterComponent={_renderFooterPosts}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          data={postData}
          showsVerticalScrollIndicator={false}
          renderItem={renderFeedItem}
          keyExtractor={item => item?._id}
          onScrollToIndexFailed={scrollToIndexFailed}
          ItemSeparatorComponent={itemSeparatorComponent}
          contentContainerStyle={{
            marginTop: scale(24),
            // paddingBottom: scale(100),
            paddingTop: scale(20),
          }}
          keyboardShouldPersistTaps={'always'}
          // initialNumToRender={Math.min(10, scrollToIndex + 5)}
          // removeClippedSubviews={true}
        />

        {stickersBottomSheetVisible && (
          <StickersBottomSheet
            bottomSheetVisible={stickersBottomSheetVisible}
            setBottomSheetVisible={setStickersBottomSheetVisible}
            SendReactionHandler={(name, type, id) => {
              setStickersBottomSheetVisible(false);
              SendReactionHandler(name, id, type, reactionData);
              setReactionData('');
            }}
          />
        )}

        <BottomSheetModal
          ref={bottomSheetModalPostRef}
          index={1}
          snapPoints={snapPointsPost}
          onChange={handleSheetNoteChanges}
          backgroundStyle={{
            backgroundColor: colors.primary,
          }}
          // style={{ backgroundColor: themeColor }}
        >
          <BottomSheetFlatList
            data={
              createdById === VARIABLES?.user?._id || createdById === undefined
                ? CONTENT_POST
                : CONTENT_POST_WITHOUT_DELETE
            }
            keyExtractor={(i, index) => index}
            renderItem={addContentNoteItem}
            contentContainerStyle={{
              ...styles.contentContainer,
              marginTop: 12,
            }}
            ItemSeparatorComponent={itemContentSeparatorComponent}
          />
        </BottomSheetModal>

        <BottomSheetModal
          ref={bottomSheetModalCommentRef}
          index={1}
          snapPoints={snapPointsComment}
          onChange={handleSheetCommentChanges}
          backgroundStyle={{
            backgroundColor: colors.primary,
          }}
          // style={{ backgroundColor: themeColor }}
        >
          <BottomSheetFlatList
            data={CONTENT_MESSAGE}
            keyExtractor={(i, index) => index}
            renderItem={deleteCommentContent}
            contentContainerStyle={{
              ...styles.contentContainer,
              marginTop: scale(16),
            }}
            ItemSeparatorComponent={itemContentSeparatorComponent}
          />
        </BottomSheetModal>
      </AppView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerTitleStyle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(20),
    fontWeight: 600,
    // color: colors.blue1
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: scale(16),
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
});
