import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {APP_IMAGE} from '../../utils/constants';
import {fonts} from '../../styles/fonts';
import {scale} from '../../utils/metrics';
import SwitchCustom from '../SwitchCustom';

export default function ManageNotificationsModal(props) {
  const {setModalVisible, modalVisible, setData, pushNotificationsData} = props;

  const [isChat, setIsChat] = useState(false);
  const [storiesHighlights, setStoriesHighlights] = useState(false);
  const [stickyNotes, setStickyNotes] = useState(false);
  const [moods, setMoods] = useState(false);
  const [poke, setPoke] = useState(false);
  const [feed, setFeed] = useState(false);
  const [quizzies, setQuizzies] = useState(false);
  const [organize, setOrganize] = useState(false);
  const [allReactions, setAllReactions] = useState(false);

  useEffect(() => {
    if (pushNotificationsData !== '') {
      setIsChat(pushNotificationsData.chat);
      setFeed(pushNotificationsData.feed);
      setMoods(pushNotificationsData.moods);
      setOrganize(pushNotificationsData.organize);
      setQuizzies(pushNotificationsData.quiz);
      setAllReactions(pushNotificationsData.reactions);
      setStickyNotes(pushNotificationsData.stickyNotes);
      setStoriesHighlights(pushNotificationsData.storiesAndHighlights);
      setPoke(pushNotificationsData.poke);
    }
  }, [pushNotificationsData]);

  const onSubmit = () => {
    let data = {
      chat: isChat,
      storiesAndHighlights: storiesHighlights,
      stickyNotes: stickyNotes,
      moods: moods,
      poke: poke,
      feed: feed,
      quiz: quizzies,
      organize: organize,
      reactions: allReactions,
    };

    setData(data);
    setModalVisible(false);
  };

  return (
    <Modal
      backdropTransitionOutTiming={1000}
      backdropOpacity={0.3}
      isVisible={modalVisible}
      // avoidKeyboard={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationOutTiming={1000}
      animationInTiming={500}
      onBackButtonPress={() => {
        setModalVisible(false);
      }}
      onBackdropPress={() => {
        setModalVisible(false);
      }}
      style={{margin: 0}}>
      <View
        style={{
          backgroundColor: colors.white,
          margin: 20,
          // alignItems: 'center',

          borderRadius: 12,
        }}>
        <Pressable
          hitSlop={20}
          style={{
            alignSelf: 'flex-end',
            paddingTop: scale(20),
            paddingEnd: scale(20),
          }}
          onPress={() => setModalVisible(false)}>
          <Image
            source={APP_IMAGE.XIcon}
            style={{
              width: scale(24),
              height: scale(24),
            }}
          />
        </Pressable>

        <Text style={styles.title}>Manage push notifications</Text>
        <>
          <View style={styles.viewRow}>
            <Text style={styles.textTitle}>Chat</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!isChat && <Text style={styles.textOff}>OFF</Text>}
              <SwitchCustom
                value={isChat}
                onValueChange={val => setIsChat(val)}
              />
              <Text
                style={
                  isChat
                    ? {...styles.textOn}
                    : {...styles.textOn, color: colors.white}
                }>
                ON
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>
        <>
          <View style={styles.viewRow}>
            <Text style={styles.textTitle}>Stories & Highlights</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!storiesHighlights && <Text style={styles.textOff}>OFF</Text>}
              <SwitchCustom
                value={storiesHighlights}
                onValueChange={val => setStoriesHighlights(val)}
              />
              <Text
                style={
                  storiesHighlights
                    ? {...styles.textOn}
                    : {...styles.textOn, color: colors.white}
                }>
                ON
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>
        <>
          <View style={styles.viewRow}>
            <Text style={styles.textTitle}>Sticky Notes</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!stickyNotes && <Text style={styles.textOff}>OFF</Text>}
              <SwitchCustom
                value={stickyNotes}
                onValueChange={val => setStickyNotes(val)}
              />
              <Text
                style={
                  stickyNotes
                    ? {...styles.textOn}
                    : {...styles.textOn, color: colors.white}
                }>
                ON
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>
        <>
          <View style={styles.viewRow}>
            <Text style={styles.textTitle}>Wellbeing</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!moods && <Text style={styles.textOff}>OFF</Text>}
              <SwitchCustom
                value={moods}
                onValueChange={val => setMoods(val)}
              />
              <Text
                style={
                  moods
                    ? {...styles.textOn}
                    : {...styles.textOn, color: colors.white}
                }>
                ON
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>

        <>
          <View style={styles.viewRow}>
            <Text style={styles.textTitle}>Poke</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!poke && <Text style={styles.textOff}>OFF</Text>}
              <SwitchCustom value={poke} onValueChange={val => setPoke(val)} />
              <Text
                style={
                  poke
                    ? {...styles.textOn}
                    : {...styles.textOn, color: colors.white}
                }>
                ON
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>
        <>
          <View style={styles.viewRow}>
            <Text style={styles.textTitle}>Feed</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!feed && <Text style={styles.textOff}>OFF</Text>}
              <SwitchCustom value={feed} onValueChange={val => setFeed(val)} />
              <Text
                style={
                  feed
                    ? {...styles.textOn}
                    : {...styles.textOn, color: colors.white}
                }>
                ON
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>
        <>
          <View style={styles.viewRow}>
            <Text style={styles.textTitle}>Quizzes</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!quizzies && <Text style={styles.textOff}>OFF</Text>}
              <SwitchCustom
                value={quizzies}
                onValueChange={val => setQuizzies(val)}
              />
              <Text
                style={
                  quizzies
                    ? {...styles.textOn}
                    : {...styles.textOn, color: colors.white}
                }>
                ON
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>

        <>
          <View style={styles.viewRow}>
            <Text style={styles.textTitle}>Organise</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!organize && <Text style={styles.textOff}>OFF</Text>}
              <SwitchCustom
                value={organize}
                onValueChange={val => setOrganize(val)}
              />
              <Text
                style={
                  organize
                    ? {...styles.textOn}
                    : {...styles.textOn, color: colors.white}
                }>
                ON
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>

        <>
          <View style={styles.viewRow}>
            <Text style={styles.textTitle}>All reactions</Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!allReactions && <Text style={styles.textOff}>OFF</Text>}
              <SwitchCustom
                value={allReactions}
                onValueChange={val => setAllReactions(val)}
              />
              <Text
                style={
                  allReactions
                    ? {...styles.textOn}
                    : {...styles.textOn, color: colors.white}
                }>
                ON
              </Text>
            </View>
          </View>
        </>

        <Pressable
          onPress={() => {
            onSubmit();
          }}
          style={{
            height: scale(50),
            width: scale(150),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.blue1,
            borderRadius: scale(10),
            alignSelf: 'center',
            marginBottom: scale(20),
            marginTop: scale(32),
          }}>
          <Text
            style={{
              fontFamily: fonts.standardFont,
              fontSize: scale(16),
              color: colors.white,
            }}>
            Save
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: 16,
    lineHeight: 20,
    color: colors.black,
    marginTop: scale(10),
    textAlign: 'center',
    marginBottom: 30,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#414858',
    marginVertical: scale(16),
  },
  textOn: {
    fontFamily: fonts.regularFont,
    fontSize: scale(12),
    color: colors.blue2,
    marginStart: scale(4),
  },
  textOff: {
    fontFamily: fonts.regularFont,
    fontSize: scale(12),
    color: colors.black,
    marginEnd: scale(4),
  },
  textTitle: {
    fontFamily: fonts.regularFont,
    fontSize: scale(16),
    color: colors.black,
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
