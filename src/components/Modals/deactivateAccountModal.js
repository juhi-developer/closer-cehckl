import { FlatList, StyleSheet, Text, View,Image,Pressable } from 'react-native'
import React,{useState} from 'react'
import Modal from 'react-native-modal';
import { colors } from '../../styles/colors';
import { APP_IMAGE, MOODS } from '../../utils/constants';
import { BUTTON_WIDTH, globalStyles } from '../../styles/globalStyles';
import { useSelector, useDispatch } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';
import BorderButton from '../borderButton';
import AppButton from '../appButton';
import DarkCrossIconSvg from '../../assets/svgs/darkCrossIconSvg';
import { scale } from '../../utils/metrics';

export default function DeactivateAccountModal(props) {
    const {setModalVisible, modalVisible,onPressContinue,onPressDeactivate} = props;
    const state = useSelector(state => state);


    const onSubmit=()=>{

    }

    return (
        <Modal
            useNativeDriverForBackdrop
            backdropTransitionOutTiming={1000}
            backdropOpacity={0.7}
            isVisible={modalVisible}
            animationIn='fadeIn'
            animationOut='fadeOut'
            animationOutTiming={1000}
            animationInTiming={500}
            onBackButtonPress={() => {
                setModalVisible(false);
            }}
            onBackdropPress={() => {
                setModalVisible(false);
            }}
            style={styles.modal}
        >
            <View style={{backgroundColor:'#fff',padding:20,borderRadius:10}}>
                <Text style={{
                    ...globalStyles.semiBoldLargeText,
                    textAlign:'center',
                    marginTop:20,
                    lineHeight:30
                    }}>{`We are sorry to inform you that ${state?.userData?.partnerData?.partner?.name} has deactivated their account.`}</Text>
                <View style={styles.buttonContainer}>
                    <BorderButton
                        text='Continue'
                        style={{ width: BUTTON_WIDTH-20, marginEnd: 6 }}
                        onPress={onPressContinue}
                    />
                    <AppButton
                        text='Deactivate'
                        style={{ width: BUTTON_WIDTH-20, marginStart: 6 }}
                        onPress={onPressDeactivate}
                    />
                </View>
                <Pressable 
                    hitSlop={20}
                    style={{position:'absolute',top:12,right:14}}
                    onPress={()=>setModalVisible(false)}
                    >
                    <DarkCrossIconSvg/>
                </Pressable>
            </View>
        </Modal>
        
    )
}

const styles = StyleSheet.create({
    modal:{
        margin:0,
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    container: {
        backgroundColor: colors.white,
        margin: 24,
        //   alignItems: 'center',
        borderRadius: 20,
        paddingTop: 20,
        padding: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:scale(30)
        // marginBottom: 20,
        // marginHorizontal: 16
    },

})