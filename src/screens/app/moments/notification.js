import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Pressable,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppView from '../../../components/AppView';
import CenteredHeader from '../../../components/centeredHeader';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import {globalStyles} from '../../../styles/globalStyles';
import {APP_STRING} from '../../../utils/constants';
import {colors} from '../../../styles/colors';
import ArrowRightIconSvg from '../../../assets/svgs/arrowRightIconSvg';
import {scale} from '../../../utils/metrics';

const DATA = [
  {
    title: 'January 20,2021',
    data: [
      {
        id: 1,
        text: APP_STRING.dummyNotificationText,
        date: '11/11/09',
      },
      {
        id: 2,
        text: APP_STRING.dummyNotificationText,
        date: '11/11/09',
      },
    ],
  },
  {
    title: 'January 22,2021',
    data: [
      {
        id: 1,
        text: APP_STRING.dummyNotificationText,
        date: '11/11/09',
      },
      {
        id: 2,
        text: APP_STRING.dummyNotificationText,
        date: '11/11/09',
      },
    ],
  },
  {
    title: 'January 24,2021',
    data: [
      {
        id: 1,
        text: APP_STRING.dummyNotificationText,
        date: '11/11/09',
      },
      {
        id: 2,
        text: APP_STRING.dummyNotificationText,
        date: '11/11/09',
      },
    ],
  },
  {
    title: 'January 26,2021',
    data: [
      {
        id: 1,
        text: APP_STRING.dummyNotificationText,
        date: '11/11/09',
      },
      {
        id: 2,
        text: APP_STRING.dummyNotificationText,
        date: '11/11/09',
      },
    ],
  },
];

export default function Notification(props) {
  const [loading, setLoading] = useState(false);

  const AppHeader = () => {
    return (
      <CenteredHeader
        leftIcon={<ArrowLeftIconSvg />}
        leftPress={() => props.navigation.goBack()}
        title={'Notification'}
        titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.notificationItem}>
        <Text
          style={{
            ...globalStyles.regularMediumText,
            lineHeight: 23,
            fontWeight: 500,
          }}>
          {APP_STRING.dummyNotificationText}
        </Text>
        <View style={styles.notificationItemFooter}>
          <Text style={styles.notifyDate}>11/11/19</Text>
          <Pressable
            hitSlop={20}
            onPress={() => alert('go')}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.goCheck}>Go to Feelings check</Text>
            <ArrowRightIconSvg />
          </Pressable>
        </View>
      </View>
    );
  };

  const itemSepratorComponent = () => {
    return <View style={{height: 16}} />;
  };

  const Header = () => {
    return <View style={{height: -20}} />;
  };

  const Footer = () => {
    return <View style={{height: 30}} />;
  };

  return (
    <AppView
      scrollContainerRequired={false}
      isScrollEnabled={false}
      isLoading={false}
      header={AppHeader}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={DATA}
        keyExtractor={(item, index) => index}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeaderTitle}>{title}</Text>
        )}
        style={{marginHorizontal: scale(20)}}
        ItemSeparatorComponent={itemSepratorComponent}
        // ListHeaderComponent={Header}
        ListFooterComponent={Footer}
      ListEmptyComponent={() => {
        return(
          <View>
            <Text style = {{...globalStyles.regularLargeText}}>No notifications listed</Text>
          </View>
        )
      }}
      />
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
  notificationItem: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    backgroundColor: '#fff',
    borderRadius: scale(10),
  },
  notifyDate: {
    ...globalStyles.regularSmallText,
    opacity: 0.6,
  },
  notificationItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(10),
  },
  goCheck: {
    ...globalStyles.semiBoldMediumText,
    color: colors.blue1,
    marginEnd: scale(12),
  },
  sectionHeaderTitle: {
    ...globalStyles.semiBoldLargeText,
    marginBottom: scale(20),
    marginTop: scale(30),
  },
});
