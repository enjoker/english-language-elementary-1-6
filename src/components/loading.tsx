import React from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native';
import { View, Text } from 'react-native'
import Modal from 'react-native-modal';
import colors from '../styles/colors';
import styles from '../styles/style';
interface modalProps {
    title: string | null
    isModalVisible: boolean
}

const Loading = ({ title = 'กำลังโหลด', isModalVisible }: modalProps) => {
    const newContaienrStyle = StyleSheet.flatten([modalStyles.containerModalStyle])
    return (
        <Modal
            isVisible={isModalVisible}
            backdropOpacity={0}
            animationIn='fadeIn'
            animationOut='fadeOut'
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0,
                backgroundColor: 'rgba(0,0,0,0.7)'
            }}
        >
            <View style={newContaienrStyle}>
                <ActivityIndicator color='#F13781' size='large' />
                <Text style={[styles.textRegular18, { marginTop: 20 }]}>
                    {title}
                </Text>
            </View>
        </Modal>
    )
}
const modalStyles = StyleSheet.create({
    containerModalStyle: {
        backgroundColor: colors.white,
        padding: 25,
        borderRadius: 10,
        alignItems: 'center'
    }
})
export default Loading