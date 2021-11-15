import React from "react";
import { Text, TouchableOpacity } from 'react-native';
import styles from '../styles/style';
import { useNavigation } from '@react-navigation/native';

const AllDownload = () => {
    const navigation: any = useNavigation();
    return (
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('AllApp')}>
            <Text style={[styles.textLight20, {
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#FAFE2F',
                color: '#6E7015',
            }]}>
                ดาวน์โหลดวิชาอื่น ๆ กดตรงนี้
            </Text>
        </TouchableOpacity>
    );
}

export default AllDownload