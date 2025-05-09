import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppView from '../../../components/AppView'
import CenteredHeader from '../../../components/centeredHeader'
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg'
import { globalStyles } from '../../../styles/globalStyles'
import { APP_STRING } from '../../../utils/constants'
import { colors } from '../../../styles/colors'
import AppButton from '../../../components/appButton'

export default function Deactivation(props) {

    const AppHeader = () => {
        return (
            <CenteredHeader
                leftIcon={<ArrowLeftIconSvg />}
                leftPress={() => props.navigation.goBack()}
                title={'Deactivation'}
                // rightIcon={<NotificationIconSvg />}
                // rightPress={() => props.navigation.navigate('notification')}
                titleStyle={globalStyles.titleLabel}
            />
        )
    }

    return (
        <>
            <AppView scrollContainerRequired={true} isScrollEnabled={true} isLoading={false} header={AppHeader} >
                <View style={styles.container}>
                    <Text style={styles.title}>To continue, you have to agree with the terms and conditions</Text>
                    <View style={styles.termsContainer}>
                        <Text style={{ ...globalStyles.regularMediumText,lineHeight:24 }}>{APP_STRING.dummyDeactivation}</Text>
                    </View>
                </View>
            </AppView>
            <AppButton
                text='I agree'
                onPress={() => props.navigation.navigate('backup')}
                style={{ marginHorizontal: 16, marginBottom: 20 }}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        paddingBottom: 16,
        marginTop:10
    },
    title: {
        ...globalStyles.boldMediumText,
        textAlign: 'center'
    },
    termsContainer: {
        backgroundColor: colors.white,
        paddingVertical: 20,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 20
    }
})