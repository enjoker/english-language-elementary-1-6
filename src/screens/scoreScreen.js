import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import styles from '../styles/style';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageModal from 'react-native-image-modal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// import Components
import Loading from '../components/loading';

// import Icon Advert
import AdvertIcon from '../assets/images/icons/Vector.svg';

// import Ads
import BannerAds from '../components/bannerAds';
import { useRewardedAd } from '@react-native-admob/admob';
import { AdmobRewardId, adsWaitingTime } from '../utilities/functions';

// import Actions
import * as scoreActions from '../store/actions/score';
import * as userActions from '../store/actions/user';

dayjs.extend(utc)

const hookOptions = {
  loadOnMounted: false,
  loadOnDismissed: true,
  requestOptions: {
    requestNonPersonalizedAdsOnly: true,
  },
};

const scoreScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const allQuestions = useSelector(state => state.level.showQuestions);
  const privilege = useSelector(state => state.user.userPrivilege)
  const {
    questionCount,
    level,
    timeLeft,
    timeOut,
    choiceSelected,
    gradeName,
    csgId,
    csgName,
    gradeId,
    overTimePlus,
    timeTestEasy,
    timeTestMedium,
    timeTestHard,
  } = route.params;
  const timeUsed = timeOut - timeLeft + overTimePlus;
  const timePlus = timeLeft - overTimePlus;
  const { width } = Dimensions.get('window');
  const [selectedQuestion, setselectedQuestion] = useState(false);
  const [ModalVisible, setmodalVisible] = useState(false);
  const [privilegeVisible, setprivilegeVisible] = useState(false);
  const [privilegeVisible2, setprivilegeVisible2] = useState(false);
  const [sendScoreStatus, setsendScoreStatus] = useState(false);
  const [amountAnsUser, setamountAnsUser] = useState(0);
  const [showLevel, setshowLevel] = useState(true);
  const [showDetailScore, setshowDetailScore] = useState(false);
  const [scoreLevel, setscoreLevel] = useState(0);
  const [sumScore, setsumScore] = useState(0);
  const [usePrivilegeStatus, setUsePrivilegeStatus] = useState(false)
  const { adLoadError, adLoaded, reward, show, load } = useRewardedAd(AdmobRewardId, hookOptions);

  // Ads Time
  const [adsTimeStamp, setadsTimeStamp] = useState()
  const [adsTime, setAdsTime] = useState(0)

  const savePrivilege = async () => {
    const dateNow = dayjs.utc().local().format();
    await AsyncStorage.setItem('adsTime', dateNow.toString());
    dispatch(userActions.addPrivilege());
    setprivilegeVisible2(false)
  };

  const usePrivilege = async () => {
    if (!usePrivilegeStatus) {
      dispatch(userActions.removePrivilege());
      setUsePrivilegeStatus(true)
    }
  };

  const checkAdsTime = async () => {
    try {
      const adsDateTime = await AsyncStorage.getItem('adsTime');
      setadsTimeStamp(adsDateTime)
    } catch (error) {
      console.log('Not have Ads Timestamp')
    }
  }

  const showRewardAds = () => {
    if (!adLoaded) {
      console.log('Ads loading')
      load()
    }
    setprivilegeVisible(true)
  }

  useEffect(() => {
    if (adLoadError) {
      console.error(adLoadError);
      Alert.alert(
        "แจ้งเตือน",
        "ไม่สามารถโหลดโฆษณาได้ในขณะนี้",
        [
          {
            text: "ตกลง",
            onPress: () => setprivilegeVisible(false),
          },
        ]
      )
    }
  }, [adLoadError]);

  useEffect(() => {
    if (reward) {
      console.log(`Reward Earned: ${reward.type}`);
      savePrivilege();
    }
  }, [reward]);

  let correctAnswerCount = 0;
  let wrongAnswerCount = 0;
  let test = sumScore;
  choiceSelected.sort((a, b) => (a.questionId > b.questionId ? 1 : -1));
  allQuestions
    ? allQuestions.map((item, index) => {
      if (item.examAnswer[0].c1 === choiceSelected[index].choiceValue) {
        correctAnswerCount += 1;
      } else if (choiceSelected[index].choiceValue !== 'หมดเวลา') {
        wrongAnswerCount += 1;
      }
    })
    : null;

  const toggleModal = (index, answerResult, status) => {
    if (!adLoaded) {
      console.log('Ads loading')
      load()
    }
    if (status == false) {
      if (privilege != '0') {
        setselectedQuestion({ index, answerResult });
        setmodalVisible(!ModalVisible);
        usePrivilege();
      } else if (usePrivilegeStatus && privilege == 0) {
        setselectedQuestion({ index, answerResult });
        setmodalVisible(!ModalVisible);
      } else {
        setprivilegeVisible2(!privilegeVisible2)
      }
    } else {
      setselectedQuestion({ index, answerResult });
      setmodalVisible(!ModalVisible);
    }
  };

  const sendScore = useCallback(() => {
    dispatch(userActions.getPrivilege());
    let rankingScore = 0;
    const levelBonus =
      level === 1 ? 1 : level === 3 ? 1.1 : level === 4 ? 1.2 : null;
    if (correctAnswerCount >= (questionCount * 80) / 100 && overTimePlus == 0) {
      rankingScore =
        Math.round(
          (Math.round(correctAnswerCount * levelBonus * 1000) / 1000 +
            (timeLeft - overTimePlus) / 100) *
          1000,
        ) / 1000;
    } else {
      rankingScore =
        Math.round(
          (Math.round(correctAnswerCount * levelBonus * 1000) / 1000 -
            overTimePlus / 100) *
          1000,
        ) / 1000;
    }
    if (!sendScoreStatus) {
      dispatch(
        scoreActions.sendScore(
          csgId,
          level,
          questionCount,
          correctAnswerCount,
          rankingScore,
          timeUsed,
        ),
      );
      setsendScoreStatus(true);
    }
  }, []);

  useEffect(() => {
    checkAdsTime();
  }, [privilege]);

  useEffect(() => {
    sendScore();
  }, []);

  useEffect(() => {
    if (adsTimeStamp) {
      const timeNow = dayjs.utc().local().format();
      const findSecond = dayjs(timeNow) - dayjs(adsTimeStamp);
      const timeSec = findSecond / 1000;
      setAdsTime(timeSec)
    }
  }, [adsTimeStamp, privilegeVisible, privilegeVisible2])

  useEffect(() => {
    if (correctAnswerCount != 0 || wrongAnswerCount != 0) {
      setamountAnsUser(timeUsed / (correctAnswerCount + wrongAnswerCount));
    } else {
      setamountAnsUser(0);
    }
  }, [timeUsed]);

  useEffect(() => {
    if (
      timeTestEasy == null &&
      timeTestMedium !== null &&
      timeTestHard == null
    ) {
      setshowLevel(false);
    }
  }, []);
  useEffect(() => {
    if (level == 1) {
      setscoreLevel(1);
    } else if (level == 3) {
      setscoreLevel(1.1);
    } else if (level == 4) {
      setscoreLevel(1.2);
    }
  }, [level]);
  
  useEffect(() => {
    if (correctAnswerCount >= (questionCount * 80) / 100 && overTimePlus == 0) {
      setsumScore(
        Math.round(
          (Math.round(correctAnswerCount * scoreLevel * 1000) / 1000 +
            (timeLeft - overTimePlus) / 100) *
          1000,
        ) / 1000,
      );
    } else {
      setsumScore(
        Math.round(
          (Math.round(correctAnswerCount * scoreLevel * 1000) / 1000 -
            overTimePlus / 100) *
          1000,
        ) / 1000,
      );
    }
  }, [scoreLevel, timeLeft, overTimePlus, questionCount, timeUsed]);

  const AnswerModal = () => {
    const answerResult = selectedQuestion.answerResult;
    const answerIndex = selectedQuestion.index;
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={[styles.boxETC, { borderBottomWidth: 1, backgroundColor: answerResult ? '#63EF71' : '#fbffc0' }]}>
          <Text
            style={[
              styles.textMedium18,
              { marginVertical: 10, fontWeight: 'bold' },
            ]}>
            คำถาม: {allQuestions[selectedQuestion.index].examQuestion}
          </Text>
          {
            allQuestions[selectedQuestion.index].examPicQuestion !== '' ?
              <View style={{ marginVertical: 5 }}>
                <ImageModal
                  modalImageResizeMode='contain'
                  imageBackgroundColor="#ffffff"
                  style={{ width: 100, height: 100 }}
                  source={{
                    uri:
                      'https://api.test.schoolcare.app/getImg/getUploadFile?name=' +
                      allQuestions[selectedQuestion.index].examPicQuestion.substr(8),
                  }}
                />
              </View>
              : null
          }
          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <Text
              style={[
                styles.textMedium18,
                pageStyle.correctAnswer,
                { textDecorationLine: 'underline' },
              ]}>
              นักเรียนตอบ
            </Text>
            <Text
              style={[
                styles.textMedium18,
                pageStyle.correctAnswer,
                { flexWrap: 'wrap', flex: 1 },
              ]}>
              {choiceSelected[answerIndex].choiceValue}
            </Text>
          </View>
          {!answerResult ? (
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <Text
                style={[
                  styles.textMedium18,
                  pageStyle.correctAnswer,
                  { textDecorationLine: 'underline', color: '#079805' },
                ]}>
                คำตอบที่ถูก
              </Text>
              <Text
                style={[
                  styles.textMedium18,
                  pageStyle.correctAnswer,
                  { flexWrap: 'wrap', flex: 1, color: '#079805' },
                ]}>
                {allQuestions[answerIndex].examAnswer[0].c1}
              </Text>
            </View>
          ) : null}

          <View>
            <TouchableOpacity
              style={{ alignItems: 'center', marginVertical: 10 }}
              onPress={() => setmodalVisible(false)}>
              <Text style={[styles.textMedium14, pageStyle.closeModal]}>
                กลับ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const AdvertModal = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          style={[
            styles.boxOvertime,
            { backgroundColor: '#1FA246', borderRadius: 15, borderBottomWidth: 1 },
          ]}>
          <Text style={[styles.textLight22, { marginTop: 10, textAlign: 'center', color: '#FFFFFF' }]}>
            ท่านมีสิทธื์ในการดูเฉลยจำนวน
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text
              style={[
                styles.textRegular30,
                {
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: '#D7B641',
                  marginHorizontal: 5,
                },
              ]}>
              {privilege}
            </Text>
            <Text
              style={[
                styles.textLight22,
                {
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: '#FFFFFF',
                  marginHorizontal: 5,
                },
              ]}>
              สิทธิ์
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: 10,
              marginBottom: 5,
            }}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => {
                setprivilegeVisible(false);
              }}>
              <Text style={[styles.textLight18, pageStyle.overTimeLeft]}>
                ยกเลิก
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={adsTime > adsWaitingTime || !adsTimeStamp ? false : true}
              style={{ alignItems: 'center' }}
              onPress={() => show()}>
              <Text style={[
                styles.textLight18,
                pageStyle.overTimeRight,
                adsTime > adsWaitingTime || !adsTimeStamp ? { backgroundColor: '#D7B641' } : { backgroundColor: '#999999', borderWidth: 0 }
              ]}>
                {
                  adsTime > adsWaitingTime || !adsTimeStamp ?
                    'ดูโฆษณาเพื่อรับสิทธิ์เพิ่ม'
                    : 'ดูโฆษณาได้ใน ' + (adsWaitingTime - adsTime) + ' วิ'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const AdvertModal2 = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          style={[
            styles.boxOvertime,
            { backgroundColor: '#D84315', borderRadius: 15, borderBottomWidth: 1 },
          ]}>
          <Text
            style={[
              styles.textLight22,
              { marginTop: 10, padding: 10, textAlign: 'center', color: '#FFFFFF' },
            ]}>
            สิทธิ์ในการดูเฉลยของท่านเหลือ 0
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: 10,
              marginBottom: 10
            }}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => {
                setprivilegeVisible2(false);
              }}>
              <Text style={[styles.textLight18, pageStyle.overTimeLeft]}>
                ยกเลิก
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={adsTime > adsWaitingTime || !adsTimeStamp ? false : true}
              style={{ alignItems: 'center' }}
              onPress={() => show()}>
              <Text style={[
                styles.textLight18,
                pageStyle.overTimeRight,
                adsTime > adsWaitingTime || !adsTimeStamp ? { backgroundColor: '#D7B641' } : { backgroundColor: '#999999', borderWidth: 0 }
              ]}>
                {
                  adsTime > adsWaitingTime || !adsTimeStamp ?
                    'กดดูโฆษณาเพื่อรับ 2 สิทธิ์'
                    : 'ดูโฆษณาได้ใน ' + (adsWaitingTime - adsTime) + ' วิ'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
            paddingHorizontal: 15,
            paddingBottom: 0,
            flex: 1,
          }}>
          <View style={{ flex: 1 }}>
            <ScrollView>
              <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[styles.textMedium20, { flex: 1, color: '#FFFFFF' }]}>
                    {csgName}
                  </Text>
                  <Text
                    style={[
                      styles.textMedium20,
                      { textAlign: 'center', color: '#FFFFFF' },
                    ]}>
                    {gradeName}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      marginTop: 5,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.textBold16,
                          { textAlignVertical: 'center', color: '#FFFFFF' },
                        ]}>
                        จำนวน
                      </Text>
                      <Text style={[styles.textBold16, pageStyle.yellowBox]}>
                        {questionCount}
                      </Text>
                      <Text
                        style={[
                          styles.textBold16,
                          { textAlignVertical: 'center', color: '#FFFFFF' },
                        ]}>
                        ข้อ
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.textBold16,
                          { textAlignVertical: 'center', color: '#FFFFFF' },
                        ]}>
                        ระดับ
                      </Text>
                      <Text
                        style={[
                          styles.textBold16, pageStyle.textLevel]}>
                        {showLevel
                          ? level === 1
                            ? 'ง่าย'
                            : level === 3
                              ? 'ปานกลาง'
                              : level === 4
                                ? 'ยาก'
                                : null
                          : '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: 5, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.textBold16, { textAlignVertical: 'center', color: '#FFFFFF' }]}>
                        ทำถูก
                      </Text>
                      <Text style={[styles.textBold16, pageStyle.yellowBox]}>
                        {correctAnswerCount}
                      </Text>
                      <Text style={[styles.textBold16, { textAlignVertical: 'center', color: '#FFFFFF' }]}>
                        ข้อ
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.textBold16, { textAlignVertical: 'center', color: '#FFFFFF' }]}>
                        เหลือเวลา
                      </Text>
                      <Text style={[styles.textBold16, pageStyle.yellowBox]}>
                        {new Date(timeLeft * 1000).toISOString().substr(14, 2) +
                          '.' +
                          new Date(timeLeft * 1000).toISOString().substr(17, 2)}
                      </Text>
                      <Text style={[styles.textBold16, { textAlignVertical: 'center', color: '#FFFFFF' }]}>
                        นาที
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginTop: 5,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.textBold16,
                          { textAlignVertical: 'center', color: '#FFFFFF' },
                        ]}>
                        ใช้เวลา
                      </Text>
                      <Text style={[styles.textBold16, pageStyle.yellowBox]}>
                        {new Date(timeUsed * 1000).toISOString().substr(14, 2) +
                          '.' +
                          new Date(timeUsed * 1000).toISOString().substr(17, 2)}
                      </Text>
                      <Text
                        style={[
                          styles.textBold16,
                          { textAlignVertical: 'center', color: '#FFFFFF' },
                        ]}>
                        นาที
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.textBold16,
                          { textAlignVertical: 'center', color: '#FFFFFF' },
                        ]}>
                        เฉลี่ยข้อละ
                      </Text>
                      <Text style={[styles.textBold16, pageStyle.yellowBox]}>
                        {new Date(amountAnsUser * 1000)
                          .toISOString()
                          .substr(14, 2) +
                          '.' +
                          new Date(amountAnsUser * 1000)
                            .toISOString()
                            .substr(17, 2)}
                      </Text>
                      <Text
                        style={[
                          styles.textBold16,
                          { textAlignVertical: 'center', color: '#FFFFFF' },
                        ]}>
                        นาที
                      </Text>
                    </View>
                  </View>
                  {showDetailScore ? (
                    <View
                      style={{
                        padding: 15,
                        marginTop: 10,
                        borderWidth: 2,
                        borderRadius: 10,
                        backgroundColor: '#fff',
                        flex: 1,
                      }}>
                      <Text style={[styles.textBold18, { textAlign: 'center', color: '#01579B' }]}>
                        การคำนวนแต้มที่ได้
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.textMedium16, { flex: 3, color: '#FF834E' }]}>
                          คะแนนที่ทำถูกต้องจำนวน
                        </Text>
                        <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                          {correctAnswerCount}
                        </Text>
                        <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                          ข้อ
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.textMedium16, { flex: 3, color: '#FF834E' }]}>
                          คูณด้วยระดับ ความยาก
                        </Text>
                        <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                          {scoreLevel}
                        </Text>
                        <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                          แต้ม
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.textMedium16, { flex: 3, color: '#FF834E' }]}>
                          รวมได้แต้มเท่ากับ
                        </Text>
                        <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                          {Math.round(correctAnswerCount * scoreLevel * 1000) /
                            1000}
                        </Text>
                        <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                          แต้ม
                        </Text>
                      </View>
                      {(correctAnswerCount >= (questionCount * 80) / 100 &&
                        overTimePlus == 0) ||
                        (correctAnswerCount <= questionCount &&
                          overTimePlus > 0) ? (
                        <View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.textMedium16, { flex: 3, color: '#FF834E' }]}>
                              {overTimePlus == 0
                                ? 'เวลาคงเหลือ'
                                : 'ใช้เวลาเกิน'}
                            </Text>
                            <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                              {overTimePlus == 0
                                ? timeLeft - overTimePlus
                                : overTimePlus}
                            </Text>
                            <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                              วินาที
                            </Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.textMedium16, { flex: 3, color: '#FF834E' }]}>
                              เวลาคงเหลือคูณด้วย 0.01
                            </Text>
                            <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                              {(timeLeft - overTimePlus) / 100}
                            </Text>
                            <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                              แต้ม
                            </Text>
                          </View>
                        </View>
                      ) : null}

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.textMedium16, { flex: 3, color: '#FF834E' }]}>
                          รวมได้แต้มทั้งสิ้น
                        </Text>
                        <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#01579B' }]}>
                          {sumScore}
                        </Text>
                        <Text style={[styles.textMedium16, { flex: 1, textAlign: 'right', color: '#FF834E' }]}>
                          แต้ม
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={pageStyle.bottomPageSection}>
                      <ScrollView
                        style={{ paddingVertical: 15 }}
                        showsVerticalScrollIndicator={false}>
                        {allQuestions
                          ? allQuestions.map((item, index) => {
                            const checkAnswer =
                              item.examAnswer[0].c1 ===
                              choiceSelected[index].choiceValue;
                            const checkAnsTimeOut =
                              choiceSelected[index].choiceValue == 'หมดเวลา'
                                ? 'หมดเวลา'
                                : 'ผิด';
                            const checkColorTimeOut =
                              choiceSelected[index].choiceValue == 'หมดเวลา'
                                ? pageStyle.timeOutColor
                                : pageStyle.falseColor;
                            return (
                              <View
                                key={item.examId}
                                style={{
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  marginBottom: 5,
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                  <Text
                                    style={[
                                      styles.textMedium16,
                                      { marginRight: 5, fontWeight: 'bold' },
                                      checkAnswer
                                        ? pageStyle.trueColor
                                        : checkColorTimeOut,
                                    ]}>
                                    ข้อที่ {index + 1}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.textMedium16,
                                      { marginRight: 5, fontWeight: 'bold' },
                                      checkAnswer
                                        ? pageStyle.trueColor
                                        : checkColorTimeOut,
                                    ]}>
                                    {checkAnswer
                                      ? 'ถูกต้อง'
                                      : checkAnsTimeOut}
                                  </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                  {checkAnswer ? (
                                    <TouchableOpacity
                                      onPress={() =>
                                        toggleModal(index, checkAnswer, true)
                                      }>
                                      {/* <TouchableOpacity onPress={checkAnswer ? toggleCorrectModal : toggleWrongModal}> */}
                                      <Text
                                        style={[
                                          styles.textMedium16,
                                          { fontWeight: 'bold' },
                                          checkAnswer
                                            ? pageStyle.trueColor
                                            : checkColorTimeOut,
                                        ]}>
                                        ดูคำถาม
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() =>
                                        toggleModal(index, checkAnswer, false)
                                      }>
                                      {/* <TouchableOpacity onPress={checkAnswer ? toggleCorrectModal : toggleWrongModal}> */}
                                      <Text
                                        style={[
                                          styles.textMedium16,
                                          { fontWeight: 'bold' },
                                          checkAnswer
                                            ? pageStyle.trueColor
                                            : checkColorTimeOut,
                                        ]}>
                                        ดูเฉลย
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                            );
                          })
                          : null}
                        <View style={{ height: 30 }} />
                      </ScrollView>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', flex: 1, marginTop: 5 }}>
                    <Text style={[styles.textBold16, { textAlignVertical: 'center', color: '#FFFFFF' }]}>
                      จำนวนสิทธิ์ดูเฉลย: {privilege}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={pageStyle.seePrivilegeBtn}
                    onPress={() => showRewardAds()}>
                    <AdvertIcon width={26} height={26} />
                    <Text style={[styles.textLight18, { textAlignVertical: 'center', marginLeft: 10, color: '#ffffff' }]}>
                      ดูโฆษณาเพื่อรับสิทธิ์ดูเฉลย
                    </Text>
                  </TouchableOpacity>
                  {showDetailScore ? (
                    <View style={pageStyle.BtnSection}>
                      <TouchableOpacity
                        style={pageStyle.rankingBtn}
                        onPress={() =>
                          navigation.navigate('ranking', {
                            csgId: csgId,
                            gradeId: gradeId,
                            csgName: csgName,
                            gradeName: gradeName,
                          })
                        }>
                        <Text style={[styles.textBold16, pageStyle.textRankingBtn]}>
                          ดูอันดับ
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={pageStyle.BtnSection}>
                      <TouchableOpacity
                        style={pageStyle.rankingBtn}
                        onPress={() => setshowDetailScore(true)}>
                        <Text style={[styles.textBold16, pageStyle.textRankingBtn]}>
                          ดูอันดับ
                        </Text>
                      </TouchableOpacity>
                      <View style={{ width: 15 }} />
                      <TouchableOpacity
                        style={pageStyle.tryAgain}
                        onPress={() =>
                          navigation.dispatch(
                            CommonActions.reset({
                              index: 1,
                              routes: [
                                { name: 'home' },
                                {
                                  name: 'optionTest',
                                  params: {
                                    subid: csgId,
                                    gradeid: gradeId,
                                    csgName: csgName,
                                  },
                                },
                              ],
                            }),
                          )
                        }>
                        <Text style={[styles.textBold16, pageStyle.textTryAgain]}>
                          ทำอีกครั้ง
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <Modal isVisible={ModalVisible}>
                  <AnswerModal />
                </Modal>
                <Modal isVisible={privilegeVisible && adLoaded}>
                  <AdvertModal />
                </Modal>
                <Modal isVisible={privilegeVisible2 && adLoaded}>
                  <AdvertModal2 />
                </Modal>
                <Loading isModalVisible={privilegeVisible && !adLoaded || privilegeVisible2 && !adLoaded} />
                {/* <Modal isVisible={isWrongModalVisible}>
                <WrongModel />
              </Modal> */}
              </View>
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
      <BannerAds />
    </SafeAreaView>
  );
};

const pageStyle = StyleSheet.create({
  trueColor: {
    color: '#00962A',
  },
  falseColor: {
    color: '#FF4E4E',
  },
  timeOutColor: {
    color: '#888',
  },
  yellowBox: {
    padding: 5,
    marginHorizontal: 5,
    width: wp('17%'),
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#000000',
    backgroundColor: '#FFD84E',
  },
  closeModal: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    backgroundColor: '#fff',
    width: 100,
    textAlign: 'center',
  },
  correctAnswer: {
    marginRight: 10,
    fontWeight: 'bold',
    color: '#0036F3',
  },
  overTimeLeft: {
    backgroundColor: '#fff',
    borderColor: '#D7B641',
    color: '#D7B641',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  overTimeRight: {
    backgroundColor: '#D7B641',
    borderColor: '#FFffff',
    color: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  tryAgain: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4EB8',
    backgroundColor: '#F9FE07BF',
    borderRadius: 15,
    flex: 1
  },
  textTryAgain: {
    textAlignVertical: 'center',
    textAlign: 'center',
    padding: 10,
    color: '#0036F3'
  },
  rankingBtn: {
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF834E',
    backgroundColor: '#FF56BB99',
    flex: 1
  },
  textRankingBtn: {
    textAlignVertical: 'center',
    textAlign: 'center',
    padding: 10,
    color: '#fff'
  },
  BtnSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 10,
    flex: 1,
  },
  seePrivilegeBtn: {
    marginTop: 10,
    padding: 8,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#37565b',
    borderRadius: 10,
  },
  bottomPageSection: {
    paddingHorizontal: 15,
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  textLevel: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#000000',
    backgroundColor: '#FFD84E'
  }
});

export default scoreScreen;