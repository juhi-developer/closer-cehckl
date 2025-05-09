const quizTypeConfig = {
    couch: {
        type: 'couch',
        title: 'COUCH CONVERSATIONS',
        icon: require('../../../assets/images/quiz/Frame2087327701.png'),
        // icon: require('../../../assets/images/quiz/couch.png'),
        submitIcon: require('../../../assets/images/quiz/send.png'),
        playButtonColor: '#ff9c7d',
        bgcolorMain: ['#FFE7DB', '#FFDEDB'],
    },


    just_talk: {
        type: 'just_talk',
        title: 'JUST TALK',
        icon: require('../../../assets/images/quiz/just_talk.png'),
        submitIcon: require('../../../assets/images/quiz/send.png'),

        playButtonColor: '#72bd90',
        bgcolorMain: ['#CBF1EA', '#CBF1D7'],
    },
    tales_of_us: {
        type: 'tales_of_us',
        title: 'TALES OF US',
        icon: require('../../../assets/images/quiz/talesofus.png'),
        submitIcon: require('../../../assets/images/quiz/sendtales_us.png'),

        playButtonColor: '#efca2a',
        bgcolorMain: ['#FFEFA6', '#FFE8AD'],
    },
    who_s_more_likely: {
        type: 'who_s_more_likely',
        title: 'WHOS MORE LIKELY',
        icon: require('../../../assets/images/quiz/whos.png'),
        submitIcon: require('../../../assets/images/quiz/send.png'),

        playButtonColor: '#6cafeb',
        bgcolorMain: ['#CEE0F0', '#CED9F0'],
    },
};

export default quizTypeConfig;