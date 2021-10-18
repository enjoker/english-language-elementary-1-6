import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import styles from '../styles/style';
import {Image, Icon, Avatar, normalize, Card} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';

import * as levelTestActions from '../store/actions/levelTest';

const optionTestScreen = ({navigation, route}) => {
  const {subid, gradeid, csgName} = route.params;
  const [questionSelected, setquestionSelected] = useState(0);
  const [levelSelected, setlevelSelected] = useState(0);
  const [timeOut, settimeOut] = useState('-');
  const [gradeName, setgradeName] = useState('');
  const [showLevel, setshowLevel] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {}, []);

  const ContainerContent = () => {
    const optionTestHandler = async () => {
      let action;
      if (questionSelected == 0) {
        Alert.alert('แจ้งเตือน', 'กรุณาเลือกจำนวนข้อ', [{text: 'ยืนยัน'}]);
      } else if (levelSelected == 0 && showLevel == true) {
        Alert.alert('แจ้งเตือน', 'กรุณาเลือกระดับความยาก', [{text: 'ยืนยัน'}]);
      } else {
        action = levelTestActions.getLevel(
          '1',
          subid,
          levelSelected,
          questionSelected,
        );
        try {
          await dispatch(action);
          navigation.navigate('test', {
            timeOut: timeOut,
            level: levelSelected,
            gradeName: gradeName,
            csgId: subid,
            csgName: csgName,
            gradeId: gradeid,
          });
        } catch (e) {
          Alert.alert('แจ้งเตือน', e.message);
        }
      }
    };
    const changeNameGrade = () => {
      if (gradeid == 1) {
        setgradeName('ชั้นป.1');
      } else if (gradeid == 35) {
        setgradeName('ชั้นป.2');
      } else if (gradeid == 36) {
        setgradeName('ชั้นป.3');
      } else if (gradeid == 37) {
        setgradeName('ชั้นป.4');
      } else if (gradeid == 38) {
        setgradeName('ชั้นป.5');
      } else if (gradeid == 39) {
        setgradeName('ชั้นป.6');
      }
    };
    useEffect(() => changeNameGrade(), [gradeid]);
    const timeTest = () => {
      if (gradeid == 1 || gradeid == 35) {
        if (questionSelected == 10 && levelSelected == 1) {
          settimeOut(15);
        } else if (questionSelected == 10 && levelSelected == 3) {
          settimeOut(17);
        } else if (questionSelected == 10 && levelSelected == 4) {
          settimeOut(20);
        } else if (questionSelected == 15 && levelSelected == 1) {
          settimeOut(23);
        } else if (questionSelected == 15 && levelSelected == 3) {
          settimeOut(26);
        } else if (questionSelected == 15 && levelSelected == 4) {
          settimeOut(30);
        } else if (questionSelected == 20 && levelSelected == 1) {
          settimeOut(30);
        } else if (questionSelected == 20 && levelSelected == 3) {
          settimeOut(34);
        } else if (questionSelected == 20 && levelSelected == 4) {
          settimeOut(40);
        }
      } else {
        if (questionSelected == 10 && levelSelected == 1) {
          settimeOut(12);
        } else if (questionSelected == 10 && levelSelected == 3) {
          settimeOut(15);
        } else if (questionSelected == 10 && levelSelected == 4) {
          settimeOut(18);
        } else if (questionSelected == 15 && levelSelected == 1) {
          settimeOut(18);
        } else if (questionSelected == 15 && levelSelected == 3) {
          settimeOut(23);
        } else if (questionSelected == 15 && levelSelected == 4) {
          settimeOut(27);
        } else if (questionSelected == 20 && levelSelected == 1) {
          settimeOut(24);
        } else if (questionSelected == 20 && levelSelected == 3) {
          settimeOut(30);
        } else if (questionSelected == 20 && levelSelected == 4) {
          settimeOut(36);
        }
      }
    };
    useEffect(() => timeTest(), [levelSelected, questionSelected]);

    useEffect(() => {
      if (
        csgName == 'สอบปลายภาคเรียน' ||
        csgName == 'สอบปลายภาคเรียนที่ 1' ||
        csgName == 'สอบปลายภาคเรียนที่ 2' ||
        csgName == 'ภาษาไทย-สอบปลายภาคเรียน' ||
        csgName == 'ภาษาไทย-สอบปลายภาคเรียนที่ 1' ||
        csgName == 'ภาษาไทย-สอบปลายภาคเรียนที่ 2'
      ) {
        setshowLevel(false);
        setlevelSelected(3);
      }
    }, [csgName]);
    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            numberOfLines={1}
            style={[styles.textMedium20, {flex: 1, color: '#FFFFFF'}]}>
            {csgName}            
          </Text>
          <Text
            style={[
              styles.textMedium20,
              {textAlign: 'center', color: '#FFFFFF'},
            ]}>
            {gradeName}
          </Text>
        </View>
        <View style={pageStyle.optionHeading}>
          <Text style={[styles.textMedium20, {textAlign: 'center'}]}>
            เลือกจำนวนข้อ
          </Text>
          <View style={pageStyle.optionSection}>
            <TouchableOpacity onPress={() => setquestionSelected(10)}>
              <Text
                style={[
                  styles.textMedium26,
                  pageStyle.optionBtn,
                  questionSelected === 10
                    ? pageStyle.activeBg
                    : pageStyle.whiteBg,
                ]}>
                10
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setquestionSelected(15)}>
              <Text
                style={[
                  styles.textMedium26,
                  pageStyle.optionBtn,
                  questionSelected === 15
                    ? pageStyle.activeBg
                    : pageStyle.whiteBg,
                ]}>
                15
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setquestionSelected(20)}>
              <Text
                style={[
                  styles.textMedium26,
                  pageStyle.optionBtn,
                  questionSelected === 20
                    ? pageStyle.activeBg
                    : pageStyle.whiteBg,
                ]}>
                20
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {showLevel ? (
          <View style={pageStyle.optionHeading}>
            <Text style={[styles.textMedium20, {textAlign: 'center'}]}>
              เลือกระดับ
            </Text>
            <View style={pageStyle.optionSection}>
              <TouchableOpacity onPress={() => setlevelSelected(1)}>
                <Text
                  style={[
                    styles.textMedium26,
                    pageStyle.optionBtn,
                    pageStyle.whiteBg,
                    levelSelected === 1
                      ? pageStyle.activeBg
                      : pageStyle.whiteBg,
                  ]}>
                  ง่าย
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setlevelSelected(3)}>
                <Text
                  style={[
                    styles.textMedium14,
                    pageStyle.optionBtn,
                    pageStyle.whiteBg,
                    levelSelected === 3
                      ? pageStyle.activeBg
                      : pageStyle.whiteBg,
                  ]}>
                  ปานกลาง
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setlevelSelected(4)}>
                <Text
                  style={[
                    styles.textMedium26,
                    pageStyle.optionBtn,
                    pageStyle.whiteBg,
                    levelSelected === 4
                      ? pageStyle.activeBg
                      : pageStyle.whiteBg,
                  ]}>
                  ยาก
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
          }}>
          <Text
            style={[
              styles.textRegular16,
              {textAlignVertical: 'center', marginHorizontal: 5, color: '#fff'},
            ]}>
            มีเวลาทำโดยประมาณ
          </Text>
          <Text
            style={[
              styles.textRegular16,
              {
                textAlignVertical: 'center',
                textAlign: 'center',
                color: '#0036F3',
                paddingHorizontal: 5,
                width: 50,
                marginHorizontal: 5,
                backgroundColor: '#FFD84E',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#0036F3',
              },
            ]}>
            {timeOut}
          </Text>
          <Text
            style={[
              styles.textRegular16,
              {textAlignVertical: 'center', marginHorizontal: 5, color: '#fff'},
            ]}>
            นาที
          </Text>
        </View>
        <TouchableOpacity
          style={{alignItems: 'center', marginTop: 10}}
          onPress={optionTestHandler}>
          <View
            style={{
              padding: 8,
              borderRadius: 15,
              width: wp('95%'),
              borderWidth: 1,
              borderColor: '#0036F3',
              backgroundColor: '#FFD84E',
            }}>
            <Text
              style={[
                styles.textBold16,
                {
                  textAlignVertical: 'center',
                  textAlign: 'center',
                },
              ]}>
              เริ่มทำแบบฝึกหัด/ข้อสอบ
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{alignItems: 'flex-start', marginTop: 10}}
          onPress={() => navigation.navigate('type')}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#0036F3',
              backgroundColor: '#FFF',
            }}>
            <Image
              source={require('../assets/images/icons/previous.png')}
              style={{width: 15, height: 15}}
            />
            <Text style={[styles.textMedium16, {marginHorizontal: 5}]}>
              ย้อนกลับ
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../assets/images/bg.jpg')}>
        <View
          style={{
            padding: 15,
            paddingBottom: 0,
            marginBottom: 10,
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <ContainerContent />
          </View>
        </View>
      </ImageBackground>
      <View
        style={{
          backgroundColor: '#EEEEEE',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Ads Area</Text>
      </View>
    </SafeAreaView>
  );
};

const pageStyle = StyleSheet.create({
  optionHeading: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    borderColor: '#0036F3',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  optionSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  optionBtn: {
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    borderColor: '#FF834E',
    backgroundColor: '#fff',
    width: wp('25%'),
    height: hp('12%'),
  },
  whiteBg: {
    backgroundColor: '#fff',
  },
  activeBg: {
    backgroundColor: '#4EEAFF',
  },
});

export default optionTestScreen;
