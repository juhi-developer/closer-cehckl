/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import API from '../../../redux/saga/request';
import { VARIABLES } from '../../../utils/variables';
import quizTypeConfig from './quizTypeConfig';
import QuizCard from './QuizCard';


const QuizListScreen = (props) => {
  const [quizData, setQuizData] = useState([]);
  const { item } = props.route.params;
  useEffect(() => {

    setQuizData(item);
    // getQuizData('all');
  }, [item]);

  const getQuizData = async (type) => {
    try {
      const payload = {
        limit: '10',
        type: type,
        userId: VARIABLES.user?._id,
        partnerId: VARIABLES.user.partnerData.partner._id,
      };
      const response = await API('user/moments/quiz/my', 'POST', payload);
      let data = response.body.data;
      if (data) {
        setQuizData(data.playData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: 'center', margin: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Turn</Text>
      </View>
      <Text style={{ fontSize: 14, color: '#7e6d5e', marginBottom: 10, textAlign: 'center' }}>
        Pending from today
      </Text>
      {quizData.map((item, index) => {
         let type = item?.quizId?.type;
        const config = quizTypeConfig[type] || quizTypeConfig.couch;
        return (
          <QuizCard
            key={`${item.id || index}`} // Ensure the key is unique
            item={item}
            config={config}
            navigation={props.navigation}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
});

const stylesNew = StyleSheet.create({
  container: {
    borderRadius: 2,
  },
  newContainer: {
    borderRadius: 15,
    marginBottom: 15,
  },
  playButtonMain: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 80,
    justifyContent: 'center',
    marginTop: 10,
  },
  shuffleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 20,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7e6d5e',
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343434',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: '#242424',
    marginBottom: 20,
    fontWeight: '500',
    lineHeight: 20,
    maxWidth: '90%',
    alignSelf: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    padding: 2,
  },
  iconContainer: {
    width: '20%',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
});

export default QuizListScreen;
