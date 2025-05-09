/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Platform,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {scaleNew} from '../../utils/metrics2';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import AppButton from '../../components/appButton';
import {ToastMessage} from '../../components/toastMessage';
import API from '../../redux/saga/requestAuth';
import {CommonActions} from '@react-navigation/native';
import OverlayLoader from '../../components/overlayLoader';
import {setData} from '../../utils/storage';

import {scale} from '../../utils/metrics';
import {VARIABLES} from '../../utils/variables';
import {optionsBothLive, optionsRelationship} from '../../utils/constants';
import {initializeTooltipStates} from '../../utils/contextualTooltips';

const CleverTap = require('clevertap-react-native');

export default function HearAboutUs({navigation}) {
  const [loading, setloading] = useState(false);

  const data = [
    {key: 'Partner', selected: false},
    {key: 'Friend or Family', selected: false},
    {key: 'Instagram', selected: false},
    {key: 'App store or play store', selected: false},
    {key: 'Play Date', selected: false},
    {key: 'Search', selected: false},
    {key: 'Twitter', selected: false},
    {key: 'YouTube', selected: false},
    {key: 'Google Ads', selected: false},
    {key: 'Others', selected: false},
  ];

  const [items, setItems] = useState(data);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleSelect = index => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        return {...item, selected: !item.selected};
      }
      return item;
    });
    setItems(newItems);

    const selectedKeys = newItems
      .filter(item => item.selected)
      .map(item => item.key);
    setSelectedKeys(selectedKeys); // Assuming setSelectedKeys is a state updater for `selectedKeys`
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={[
        styles.item,
        item.selected ? styles.selected : null,
        {
          marginEnd: index % 2 === 0 ? scaleNew(6) : 0,
          marginStart: index % 2 === 0 ? 0 : scaleNew(6),
        },
      ]}
      onPress={() => handleSelect(index)}>
      <Text style={[styles.text, item.selected ? styles.selectedText : null]}>
        {item.key}
      </Text>
    </TouchableOpacity>
  );

  const onSubmit = async () => {
    if (selectedKeys.length === 0) {
      ToastMessage('Please select the above options first');
      return;
    }

    try {
      setloading(true);
      const resp = await API('user/auth/hearAboutUs', 'POST', {
        hearAboutUs: selectedKeys,
      });

      if (resp.body.statusCode === 200) {
        const respData = resp.body.data;
        const params2 = {
          Name: respData.name,
          userName: respData.name,

          Email: respData.email,

          Gender: respData.gender,

          'MSG-push': true,

          children: respData.personalise?.children,
          relationshipDistance:
            optionsBothLive[Number(respData.personalise?.relationshipDistance)]
              ?.label,
          relationshipStatus:
            optionsRelationship[
              Number(respData.personalise?.relationshipStatus)
            ]?.label,
        };

        // Remove keys with empty values
        Object.keys(params2).forEach(key => {
          if (
            params2[key] === '' ||
            params2[key] === null ||
            params2[key] === undefined ||
            (Array.isArray(params2[key]) && params2[key].length === 0)
          ) {
            delete params2[key];
          }
        });

        CleverTap.onUserLogin(params2);
        CleverTap.registerForPush();
        if (VARIABLES.deviceToken !== null && VARIABLES.deviceToken !== '') {
          CleverTap.setPushToken(VARIABLES.deviceToken, CleverTap.FCM);
        }
        initializeTooltipStates();
        setData('USER', JSON.stringify(resp.body.data));
        setloading(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'App',
              },
            ],
          }),
        );
      } else {
        ToastMessage(resp.body.Message);
      }
    } catch (error) {
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E9FFFE', '#FFEBDB']}
      locations={[0, 0.3]}
      useAngle
      angle={190}
      style={styles.container}>
      <OverlayLoader visible={loading} />
      <View
        style={{
          shadowColor: colors.shadow,
          shadowOffset: {width: -4, height: scaleNew(-4)},
          shadowOpacity: Platform.OS === 'ios' ? 0.1 : 1,
          shadowRadius: scaleNew(4),
          elevation: scaleNew(24),
          flex: 1,
          marginTop: scaleNew(70),
        }}>
        <LinearGradient
          colors={['#E9FFFE', '#FFEBDB']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          locations={[0, 0.7]}
          useAngle={true}
          angle={160}
          style={{
            ...styles.container,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: scaleNew(20),
            paddingTop: scaleNew(20),
          }}>
          <Text style={{...styles.title}}>
            One last thing, how did you hear about us?
          </Text>

          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scaleNew(14),
              color: '#808491',
              marginTop: scaleNew(20),
            }}>
            You can choose multiple options
          </Text>
          <View>
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={item => item.key}
              numColumns={2}
              columnWrapperStyle={styles.row}
              style={{marginTop: scale(26)}}
            />

            <AppButton
              onPress={onSubmit}
              text="Continue"
              style={{
                backgroundColor:
                  selectedKeys.length === 0 ? '#A5B2CC' : colors.blue1,

                marginTop: scaleNew(60),
              }}
            />
          </View>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(21),
    color: '#444444',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  item: {
    backgroundColor: colors.white,
    height: scaleNew(60),

    flex: 1,
    marginBottom: scaleNew(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleNew(100),
    borderWidth: scaleNew(2),
    borderColor: colors.white,
    paddingHorizontal: scaleNew(20),
  },
  selected: {
    borderColor: '#124698',
    borderWidth: scaleNew(2),
  },
  text: {
    fontSize: scaleNew(16),
    color: '#595959',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: fonts.regularFont,
    includeFontPadding: false,
  },
  selectedText: {
    color: '#124698',
    fontFamily: fonts.standardFont,
  },
});
