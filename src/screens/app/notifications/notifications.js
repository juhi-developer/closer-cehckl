import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  AppState,
} from 'react-native';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState, useRef, useContext} from 'react';
import AppView from '../../../components/AppView';
import CenteredHeader from '../../../components/centeredHeader';
import {SCREEN_WIDTH, globalStyles} from '../../../styles/globalStyles';
import {APP_IMAGE} from '../../../utils/constants';
import {colors} from '../../../styles/colors';
import {scale} from '../../../utils/metrics';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Menu, MenuItem} from 'react-native-material-menu';
import NotificationRow from '../../../components/NotificationRow';
import API from '../../../redux/saga/request';
import {VARIABLES} from '../../../utils/variables';
import RNFS from 'react-native-fs';
import {AWS_URL_S3} from '../../../utils/urls';
import {ToastMessage} from '../../../components/toastMessage';
import {notificationHandler} from '../../../notificationHandler/notificationHandler';
import OverlayLoader from '../../../components/overlayLoader';
import {NetworkContext} from '../../../components/NetworkContext';
import {NotificationLoader} from './Loader';
import {useAppContext} from '../../../utils/VariablesContext';
import {useAppState} from '../../../utils/AppStateContext';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';

export default function Notifications(props) {
  const {notifData, updateNotifData, updateMomentsKeyData} = useAppContext();
  const appStateGlobal = useAppState();

  const [loading, setLoading] = useState(false);
  const [refreshingLoading, setRefreshingLoading] = useState(false);
  const [loadingSkelton, setLoadingSkelton] = useState(true);
  const swipeRef = useRef(null);
  const {isConnected} = useContext(NetworkContext);

  const [visible, setVisible] = useState(false);
  const [notification, setnotification] = useState([]);
  const [page, setpage] = useState(0);
  const [isLoadingMore, setisLoadingMore] = useState(false);
  const [isNoMoreData, setisNoMoreData] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);

  useEffect(() => {
    getnotifications(0);
    setisLoadingMore(false);
    setisNoMoreData(false);
    // setLoading(true);
    setisRefreshing(false);
  }, []);

  useEffect(() => {
    if (appStateGlobal === 'active' && !VARIABLES.isMediaOpen) {
      setisRefreshing(true);
      getnotifications(0);
    }
  }, [appStateGlobal]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      updateNotifData({...VARIABLES.appNotifData, notification: false});
    });
    return unsubscribe;
  });

  const markAllNotifRead = async () => {
    try {
      const resp = await API('user/home/notifications', 'PUT', {
        type: 'all',
      });
      console.log('ressssssssss', resp);
      if (resp.body.statusCode == 200) {
        ToastMessage('All marked as read');
        const notif = notification.map(i => {
          return {...i, isChecked: true};
        });
        setnotification(notif);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.log('notification mark as read error', error);
      setLoading(false);
    }
  };

  const markAsRead = async notifId => {
    const notif = notification.map(i => {
      if (i._id === notifId) {
        return {...i, isChecked: true};
      }
      return i;
    });
    setnotification(notif);
    try {
      const resp = await API('user/home/notifications', 'PUT', {
        type: 'single',
        notificationId: notifId,
      });
      if (resp.body.statusCode !== 200) {
        ToastMessage('Something went wrong');
        const notif = notification.map(i => {
          if (i._id === notifId) {
            return {...i, isChecked: false};
          }
          return i;
        });
        setnotification(notif);
      }
    } catch (error) {
      ToastMessage('Something went wrong');
      const notif = notification.map(i => {
        if (i._id === notifId) {
          return {...i, isChecked: false};
        }
        return i;
      });
      setnotification(notif);
    }
  };

  const deleteNotification = async id => {
    setLoading(true);
    try {
      const resp = await API(
        `user/home/notifications?${[id]
          .map((n, index) => `notificationId[${index}]=${n}`)
          .join('&')}`,
        'DELETE',
      );
      console.log(resp);
      const notif = notification.filter(i => i._id !== id);
      setnotification(notif);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getnotifications = async page => {
    try {
      const resp = await API(
        `user/home/notifications?page=${page}&limit=${20}`,
        'GET',
      );
      const newData =
        page === 0
          ? resp.body.data.notifications
          : [...notification, ...resp.body.data.notifications];
      setLoading(false);

      setRefreshingLoading(false);
      setLoadingSkelton(false);
      setnotification(newData);
      setisLoadingMore(false);
      setisNoMoreData(resp.body?.data?.notifications?.length === 0);
      setisRefreshing(false);
    } catch (error) {
      ToastMessage('Something went wrong, Please try again later');
      setLoading(false);
      setRefreshingLoading(false);
      setLoadingSkelton(false);
      setisRefreshing(false);
      setisLoadingMore(false);
    }
  };

  const MenuHandler = () => {};

  const showMenu = () => {
    setVisible(true);
  };

  const hideMenu = () => {
    setVisible(false);
  };

  const AppHeader = () => {
    return (
      <CenteredHeader
        leftIcon={<ArrowLeftIconSvg />}
        leftPress={() => props.navigation.goBack()}
        rightIcon={() => {
          return (
            <>
              {notification.length > 0 ? (
                <Pressable onPress={showMenu}>
                  <Image
                    source={APP_IMAGE.moreCircle}
                    style={{width: scale(28), height: scale(28)}}
                  />
                </Pressable>
              ) : (
                <View
                  style={{
                    width: scale(28),
                    height: scale(28),
                  }}
                />
              )}
            </>
          );
        }}
        rightPress={MenuHandler}
        title={'Activity'}
        titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const backRowComponent = (rowData, rowMap) => {
    return (
      <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
        <Pressable
          style={{
            backgroundColor: colors.grey13,
            justifyContent: 'center',
            alignItems: 'center',
            width: scale(80),
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
          onPress={() => {
            rowMap[rowData.item._id]?.closeRow?.();
            markAsRead(rowData.item._id);
          }}>
          <Image
            source={APP_IMAGE.tickSquare}
            style={{width: scale(30), height: scale(30)}}
          />
          <Text
            style={{
              ...globalStyles.regularSmallText,
              fontSize: scale(10),
              marginTop: 4,
            }}>
            Mark read
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: colors.red7,
            justifyContent: 'center',
            alignItems: 'center',
            width: scale(80),
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPress={async () => {
            rowMap[rowData.item._id]?.closeRow?.();
            deleteNotification(rowData.item._id);
          }}>
          <Image
            source={APP_IMAGE.delete}
            style={{width: scale(30), height: scale(30)}}
          />
          <Text
            style={{
              ...globalStyles.regularSmallText,
              fontSize: scale(10),
              marginTop: 4,
            }}>
            Delete
          </Text>
        </Pressable>
      </View>
    );
  };

  const itemSepratorComponent = () => {
    return <View style={{height: 16}} />;
  };

  const renderItem = ({item, index}) => {
    return (
      <NotificationRow
        index={index}
        item={item}
        notifHandler={handleNavigation}
      />
    );
  };
  const loadFile = uri => {
    const path = RNFS.DocumentDirectoryPath + `/CloserStories/${uri}`;
    console.log('BIG PATHHHHHH', path);
    return RNFS.exists(path)
      .then(async exists => {
        console.log('RESPONSE}}}}}}}}}', exists);
        if (exists) {
          console.log('YES EXISTS', path);
          return `file://${path}`;
        } else {
          return AWS_URL_S3 + `production/stories/` + uri;
        }
      })
      .catch(err => {
        console.log('eroor', err);
      });
  };

  const handleNavigation = async notif => {
    markAsRead(notif._id);
    if (notif.type === 'nudge') {
      return;
    }

    setLoading(true);

    await notificationHandler(notif, updateMomentsKeyData, setLoading);
  };

  const onEndReached = () => {
    if (loading || isLoadingMore || isNoMoreData || isRefreshing) {
      return;
    }
    setisLoadingMore(true);
    setpage(val => {
      getnotifications(val + 1);
      return val + 1;
    });
  };

  const bottomContainer = () => {
    if (isLoadingMore) {
      return (
        <View
          style={{height: 100, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  const deleteAllNotif = async () => {
    try {
      const resp = await API('user/home/allNotifications', 'DELETE');
      if (resp.body.statusCode == 200) {
        ToastMessage('All notifications deleted');
        setnotification([]);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <AppView
      scrollContainerRequired={false}
      isScrollEnabled={false}
      header={AppHeader}>
      <Menu
        animationDuration={100}
        visible={visible}
        onRequestClose={hideMenu}
        style={{
          paddingHorizontal: 10,
          position: 'absolute',
          top: 65,
          left: SCREEN_WIDTH - 230,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(16),
          }}>
          <Image
            source={APP_IMAGE.tickSquare}
            style={{
              width: scale(30),
              height: scale(30),
              tintColor: colors.text,
            }}
          />
          <MenuItem
            onPress={() => {
              setLoading(true);
              markAllNotifRead();
              hideMenu();
            }}
            textStyle={{...globalStyles.regularLargeText, marginLeft: -5}}>
            Mark all read
          </MenuItem>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#EBC9C0',
            marginVertical: 6,
            marginHorizontal: 8,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(16),
          }}>
          <Image
            source={APP_IMAGE.delete}
            style={{width: scale(30), height: scale(30)}}
          />
          <MenuItem
            onPress={() => {
              setLoading(true);
              deleteAllNotif();
              hideMenu();
            }}
            textStyle={{...globalStyles.regularLargeText, marginLeft: -5}}>
            Clear all
          </MenuItem>
        </View>
      </Menu>

      {refreshingLoading && (
        <ActivityIndicator size={'large'} animating={true} />
      )}

      {!isConnected ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <LottieView
            style={{width: scale(400), height: scale(400)}}
            source={require('../../../assets/images/gifs/no_net.json')}
            autoPlay
            loop
          />
        </View>
      ) : (
        <>
          {loadingSkelton ? (
            <View style={{flex: 1, marginTop: scale(16)}}>
              <NotificationLoader />
            </View>
          ) : (
            <SwipeListView
              onEndReached={onEndReached}
              closeOnRowBeginSwipe={true}
              showsVerticalScrollIndicator={false}
              ref={swipeRef}
              data={notification}
              renderItem={renderItem}
              leftOpenValue={0}
              ItemSeparatorComponent={itemSepratorComponent}
              // ListHeaderComponent={header}
              keyExtractor={item => item._id}
              rightOpenValue={-scale(160)}
              // renderHiddenItem={(rowData, rowMap) => backRowComponent({ rowData, rowMap })}
              renderHiddenItem={backRowComponent}
              style={{marginHorizontal: scale(16)}}
              contentContainerStyle={{paddingTop: scale(10)}}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={() => {
                    setisRefreshing(true);
                    setpage(0);
                    setisNoMoreData(false);
                    setisLoadingMore(false);
                    getnotifications(0);
                  }}
                />
              }
              // refreshing={isRefreshing}
              // onRefresh={() => {

              // }}
              ListFooterComponent={bottomContainer}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 12,
                    }}>
                    <Text style={{...globalStyles.regularLargeText}}>
                      No activities listed
                    </Text>
                  </View>
                );
              }}
              onRightAction={(data, rowMap) => {
                console.log('swiperihgt', data, rowMap);
              }}
            />
          )}
        </>
      )}
      {visible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
      )}
      <OverlayLoader visible={loading} />
    </AppView>
  );
}

const styles = StyleSheet.create({
  headerTitleStyle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(20),
    fontWeight: 600,
    // color: colors.blue1
  },
});
