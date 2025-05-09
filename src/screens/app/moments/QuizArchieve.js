import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AppView from '../../../components/AppView';
import API from '../../../redux/saga/request';
import {scale} from '../../../utils/metrics';
import CenteredHeader from '../../../components/centeredHeader';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import {colors} from 'react-native-swiper-flatlist/src/themes';
import {globalStyles} from '../../../styles/globalStyles';
import QuizCardComp from './components/QuizCardComp';
import {MomentLoader, NotificationLoader} from '../notifications/Loader';
import GoBackIconSvg from '../../../assets/svgs/goBackIconSvg';
import CornerHeader from '../../../components/cornerHeader';
import {VARIABLES} from '../../../utils/variables';

export default function QuizArchieve(props) {
  const {navigation} = props;
  const [archieveArray, setArchieveArray] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadinng2, setLoading2] = useState(false);

  const [askPartnerInput, setAskPartnerInput] = useState('');
  const [dataSourceCords, setDataSourceCords] = useState({});

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getArchieveData(0, true);
  }, []);

  const getArchieveData = async (page, shouldFetch = true) => {
    if (!shouldFetch || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const resp = await API(
        `user/moments/qnaArchive?page=${page}&limit=10`,
        'GET',
      );
      setLoading(false);
      setFooterLoader(false);
      setRefreshing(false);

      if (resp.body.statusCode === 200) {
        if (page === 0) {
          setArchieveArray(resp.body.data);
        } else {
          setArchieveArray(prevData => [...prevData, ...resp.body.data]);
        }

        setHasMore(resp.body.data.length === 10);
        if (resp.body.data.length > 0) {
          setPage(page + 1);
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
      setFooterLoader(false);
      setIsLoadingMore(false); // Reset loading lock
    }
  };

  function _renderFooterPosts() {
    if (hasMore && footerLoader) {
      return (
        <View style={{height: 20, marginBottom: 40, marginTop: 10}}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
  }

  const onRefresh = async () => {
    getArchieveData(0, true);
    setRefreshing(true);
  };

  const renderFeedItem = ({item, index}) => {
    return (
      <View>
        <QuizCardComp
          hornyMode={item.isHornyCard}
          QnAData={item.QnA}
          loading={loadinng2}
          setLoading={setLoading2}
          disabled={true}
          //  profileData={profileData}
          feelingToggler={false}
          addComment={() => {
            // addComment({});
          }}
          askPartnerInput={askPartnerInput}
          setAskPartnerInput={setAskPartnerInput}
          navigation={props.navigation}
          dataSourceCords={dataSourceCords}
        />
      </View>
    );
  };

  const AppHeader = () => {
    return (
      <CornerHeader
        leftIcon={<GoBackIconSvg />}
        leftPress={() => props.navigation.goBack()}
        titleBox={
          <Text
            style={{
              ...globalStyles.semiBoldLargeText,
              marginStart: scale(6),
              fontSize: scale(18),
            }}>
            Quiz archive
          </Text>
        }
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      // keyboardVerticalOffset={keyboardHeight}
    >
      <AppView
        scrollContainerRequired={false}
        isScrollEnabled={false}
        //   isLoading={isLoading}
        header={AppHeader}>
        {loading && <NotificationLoader />}
        {/* <OverlayLoader visible={uploading} /> */}

        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={() => {
            if (!footerLoader && hasMore && !isLoadingMore) {
              setFooterLoader(true);
              getArchieveData(page, hasMore);
            }
          }}
          ListEmptyComponent={() => {
            return (
              <View style={{alignItems: 'center', marginTop: 12}}>
                <Text style={{...globalStyles.regularLargeText}}>
                  No archives yet.
                </Text>
              </View>
            );
          }}
          ListFooterComponent={_renderFooterPosts}
          onEndReachedThreshold={0.5}
          data={archieveArray}
          showsVerticalScrollIndicator={false}
          renderItem={renderFeedItem}
          keyExtractor={item => item?._id}
          contentContainerStyle={{
            //  marginTop: scale(12),
            paddingBottom: scale(60),
          }}
          keyboardShouldPersistTaps={'always'}
        />
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
