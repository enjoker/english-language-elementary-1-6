import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import styles from '../styles/style';
import { Input } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';

// import รูปบ้าน
import HomeIcon from '../assets/images/icons/HomeIcon.svg';

import * as subGradeActions from '../store/actions/subGrade';

const homeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const ContainerContent = () => {
    const [items, setItems] = useState([
      {
        name: 'ป.1',
        code: '#028c6a',
        grade: 1,
      },
      {
        name: 'ป.2',
        code: '#ec6161',
        grade: 35,
      },
      {
        name: 'ป.3',
        code: '#FFA73F',
        grade: 36,
      },
      {
        name: 'ป.4',
        code: '#2E59F1',
        grade: 37,
      },
      {
        name: 'ป.5',
        code: '#28b786',
        grade: 38,
      },
      {
        name: 'ป.6',
        code: '#B13AFA',
        grade: 39,
      },
    ]);
    const gradeHandler = async classSelected => {
      let action;
      if (classSelected !== 0) {
        action = subGradeActions.getSub('3', classSelected);
        try {
          await dispatch(action);
          navigation.navigate('type', {});
        } catch (e) {
          Alert.alert('แจ้งเตือน', e.message);
        }
      } else {
        console.log(classSelected);
      }
    };
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        <Text style={[styles.textMedium34, { textAlign: 'center', color: '#FFFFFF' }]}>
          ภาษาอังกฤษ
        </Text>
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
          <FlatGrid
            itemDimension={120}
            staticDimension={340}
            data={items}
            style={{ marginTop: 5, flex: 1 }}
            spacing={10}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => gradeHandler(item.grade)}>
                <Text
                  style={[
                    styles.textBold26,
                    {
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      color: '#fff',
                      fontWeight: '600',
                      borderRadius: 8,
                      padding: 10,
                      height: 120,
                      backgroundColor: item.code,
                    },
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <Text style={[styles.textBold18, { flex: 0.4, textAlign: 'center', color: '#FFFFFF' }]}>
          กลับมาหน้าหลักนี้โดยการกดรูปบ้าน {'\n'}
          <HomeIcon width={26} height={26} />
          {' '}ด้านบนขวาของแต่ละหน้า
        </Text>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Text
            style={[
              styles.textLight20,
              { padding: 10, borderRadius: 8, backgroundColor: '#FAFE2F', color: '#6E7015' },
            ]}>
            ดาวน์โหลดวิชาอื่น ๆ กดตรงนี้
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../assets/images/bg.jpg')}>
        <View
          style={{
            padding: 15,
            paddingBottom: 0,
            marginBottom: 10,
            flex: 1,
          }}>
          <View style={{ flex: 1 }}>
            <ContainerContent />
          </View>
        </View>
      </ImageBackground>
      <View style={{ backgroundColor: '#EEEEEE', height: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ads Area</Text>
      </View>
    </SafeAreaView>
  );
};

export default homeScreen;
