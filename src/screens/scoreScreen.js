import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import styles from '../styles/style';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';

// import Actions
import * as scoreActions from '../store/actions/score';

const scoreScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const allQuestions = useSelector(state => state.level.showQuestions);
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
  } = route.params;
  const timeUsed = timeOut - timeLeft + overTimePlus;
  const timePlus = timeLeft - overTimePlus;
  const {width} = Dimensions.get('window');
  const [selectedQuestion, setselectedQuestion] = useState(false);
  const [ModalVisible, setmodalVisible] = useState(false);
  const [sendScoreStatus, setsendScoreStatus] = useState(false);
  const [amountAnsUser, setamountAnsUser] = useState(0);
  const [showLevel, setshowLevel] = useState(true);
  const [showDetailScore, setshowDetailScore] = useState(false);
  const [scoreLevel, setscoreLevel] = useState(0);
  const [sumScore, setsumScore] = useState(0);
  const [newChoiceSelected, setnewChoiceSelected] = useState(choiceSelected);

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

  const toggleModal = (index, answerResult) => {
    setselectedQuestion({index, answerResult});
    setmodalVisible(!ModalVisible);
  };

  const sendScore = useCallback(() => {
    let rankingScore = 0;
    const levelBonus =
      level === 1 ? 1 : level === 3 ? 1.1 : level === 4 ? 1.2 : null;
    if (
      correctAnswerCount >= (questionCount * 80) / 100 &&
      overTimePlus == 0
    ) {
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
    /*if (timeLeft > 299) {
      rankingScore += 1;
    } else if (timeLeft === 0) {
      if (correctAnswerCount === 0) {
        rankingScore = 0;
      } else {
        rankingScore -= 1;
      }
    }*/
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
    sendScore();
  }, []);

  useEffect(() => {
    if (correctAnswerCount != 0 || wrongAnswerCount != 0) {
      setamountAnsUser(timeUsed / (correctAnswerCount + wrongAnswerCount));
    } else {
      setamountAnsUser(0);
    }
  }, [timeUsed]);

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
    }
  }, [csgName]);
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
    if (
      correctAnswerCount >= (questionCount * 60) / 100 &&
      timeUsed >= (timeOut * 30) / 100 &&
      overTimePlus == 0
    ) {
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
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View
          style={[
            styles.boxETC,
            answerResult
              ? {backgroundColor: '#63EF71'}
              : {backgroundColor: '#FFD84E'},
          ]}>
          <Text
            style={[
              styles.textMedium18,
              {marginVertical: 10, fontWeight: 'bold'},
            ]}>
            คำถาม: {allQuestions[selectedQuestion.index].examQuestion}
          </Text>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <Text
              style={[
                styles.textMedium18,
                pageStyle.correctAnswer,
                {textDecorationLine: 'underline'},
              ]}>
              นักเรียนตอบ
            </Text>
            <Text
              style={[
                styles.textMedium18,
                pageStyle.correctAnswer,
                {flexWrap: 'wrap', flex: 1},
              ]}>
              {choiceSelected[answerIndex].choiceValue}
            </Text>
          </View>
          {!answerResult ? (
            <View style={{flexDirection: 'row', marginVertical: 10}}>
              <Text
                style={[
                  styles.textMedium18,
                  pageStyle.correctAnswer,
                  {textDecorationLine: 'underline'},
                ]}>
                คำตอบที่ถูก
              </Text>
              <Text
                style={[
                  styles.textMedium18,
                  pageStyle.correctAnswer,
                  {flexWrap: 'wrap', flex: 1},
                ]}>
                {allQuestions[answerIndex].examAnswer[0].c1}
              </Text>
            </View>
          ) : null}

          <View>
            <TouchableOpacity
              style={{alignItems: 'center', marginVertical: 10}}
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
            <ScrollView>
              <View style={{flex: 1, justifyContent: 'flex-start'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
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
                <View style={{flex: 1}}>
                  <View
                    style={{
                      marginTop: 5,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.textBold16,
                          {textAlignVertical: 'center', color: '#FFFFFF'},
                        ]}>
                        จำนวน
                      </Text>
                      <Text style={[styles.textBold16, pageStyle.yellowBox]}>
                        {questionCount}
                      </Text>
                      <Text
                        style={[
                          styles.textBold16,
                          {textAlignVertical: 'center', color: '#FFFFFF'},
                        ]}>
                        ข้อ
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.textBold16,
                          {textAlignVertical: 'center', color: '#FFFFFF'},
                        ]}>
                        ระดับ
                      </Text>
                      <Text
                        style={[
                          styles.textBold16,
                          {
                            paddingVertical: 5,
                            paddingHorizontal: 15,
                            marginHorizontal: 5,
                            textAlign: 'center',
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: '#000000',
                            backgroundColor: '#FFD84E',
                          },
                        ]}>
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
                  <View
                    style={{
                      marginTop: 5,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.textBold16,
                          {textAlignVertical: 'center', color: '#FFFFFF'},
                        ]}>
                        ทำถูก
                      </Text>
                      <Text style={[styles.textBold16, pageStyle.yellowBox]}>
                        {correctAnswerCount}
                      </Text>
                      <Text
                        style={[
                          styles.textBold16,
                          {textAlignVertical: 'center', color: '#FFFFFF'},
                        ]}>
                        ข้อ
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.textBold16,
                          {textAlignVertical: 'center', color: '#FFFFFF'},
                        ]}>
                        เหลือเวลา
                      </Text>
                      <Text style={[styles.textBold16, pageStyle.yellowBox]}>
                        {new Date(timeLeft * 1000).toISOString().substr(14, 2) +
                          '.' +
                          new Date(timeLeft * 1000).toISOString().substr(17, 2)}
                      </Text>
                      <Text
                        style={[
                          styles.textBold16,
                          {textAlignVertical: 'center', color: '#FFFFFF'},
                        ]}>
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
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.textBold16,
                          {textAlignVertical: 'center', color: '#FFFFFF'},
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
                          {textAlignVertical: 'center', color: '#FFFFFF'},
                        ]}>
                        นาที
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.textBold16,
                          {textAlignVertical: 'center', color: '#FFFFFF'},
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
                          {textAlignVertical: 'center', color: '#FFFFFF'},
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
                      <Text
                        style={[
                          styles.textBold18,
                          {textAlign: 'center', color: '#01579B'},
                        ]}>
                        การคำนวนแต้มที่ได้
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 3, color: '#FF834E'},
                          ]}>
                          คะแนนที่ทำถูกต้องจำนวน
                        </Text>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 1, textAlign: 'right', color: '#FF834E'},
                          ]}>
                          {correctAnswerCount}
                        </Text>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 1, textAlign: 'right', color: '#FF834E'},
                          ]}>
                          ข้อ
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 3, color: '#FF834E'},
                          ]}>
                          คูณด้วยระดับ ความยาก
                        </Text>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 1, textAlign: 'right', color: '#FF834E'},
                          ]}>
                          {scoreLevel}
                        </Text>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 1, textAlign: 'right', color: '#FF834E'},
                          ]}>
                          แต้ม
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 3, color: '#FF834E'},
                          ]}>
                          รวมได้แต้มเท่ากับ
                        </Text>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 1, textAlign: 'right', color: '#FF834E'},
                          ]}>
                          {Math.round(correctAnswerCount * scoreLevel * 1000) /
                            1000}
                        </Text>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 1, textAlign: 'right', color: '#FF834E'},
                          ]}>
                          แต้ม
                        </Text>
                      </View>
                      {(correctAnswerCount >= (questionCount * 60) / 100 &&
                        timeUsed >= (timeOut * 30) / 100 &&
                        overTimePlus == 0) ||
                      (correctAnswerCount <= questionCount &&
                        timeUsed >= (timeOut * 30) / 100 &&
                        overTimePlus > 0) ? (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={[
                                styles.textMedium16,
                                {flex: 3, color: '#FF834E'},
                              ]}>
                              {overTimePlus == 0
                                ? 'เวลาคงเหลือ'
                                : 'ใช้เวลาเกิน'}
                            </Text>
                            <Text
                              style={[
                                styles.textMedium16,
                                {flex: 1, textAlign: 'right', color: '#FF834E'},
                              ]}>
                              {overTimePlus == 0
                                ? timeLeft - overTimePlus
                                : overTimePlus}
                            </Text>
                            <Text
                              style={[
                                styles.textMedium16,
                                {flex: 1, textAlign: 'right', color: '#FF834E'},
                              ]}>
                              วินาที
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={[
                                styles.textMedium16,
                                {flex: 3, color: '#FF834E'},
                              ]}>
                              เวลาคงเหลือคูณด้วย 0.01
                            </Text>
                            <Text
                              style={[
                                styles.textMedium16,
                                {flex: 1, textAlign: 'right', color: '#FF834E'},
                              ]}>
                              {(timeLeft - overTimePlus) / 100}
                            </Text>
                            <Text
                              style={[
                                styles.textMedium16,
                                {flex: 1, textAlign: 'right', color: '#FF834E'},
                              ]}>
                              แต้ม
                            </Text>
                          </View>
                        </View>
                      ) : null}

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 3, color: '#FF834E'},
                          ]}>
                          รวมได้แต้มทั้งสิ้น
                        </Text>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 1, textAlign: 'right', color: '#01579B'},
                          ]}>
                          {sumScore}
                        </Text>
                        <Text
                          style={[
                            styles.textMedium16,
                            {flex: 1, textAlign: 'right', color: '#FF834E'},
                          ]}>
                          แต้ม
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        paddingHorizontal: 15,
                        marginTop: 10,
                        borderWidth: 2,
                        borderRadius: 10,
                        backgroundColor: '#fff',
                        flex: 1,
                      }}>
                      <ScrollView
                        style={{paddingVertical: 15}}
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
                                  <View style={{flexDirection: 'row'}}>
                                    <Text
                                      style={[
                                        styles.textMedium16,
                                        {marginRight: 5, fontWeight: 'bold'},
                                        checkAnswer
                                          ? pageStyle.trueColor
                                          : checkColorTimeOut,
                                      ]}>
                                      ข้อที่ {index + 1}
                                    </Text>
                                    <Text
                                      style={[
                                        styles.textMedium16,
                                        {marginRight: 5, fontWeight: 'bold'},
                                        checkAnswer
                                          ? pageStyle.trueColor
                                          : checkColorTimeOut,
                                      ]}>
                                      {checkAnswer
                                        ? 'ถูกต้อง'
                                        : checkAnsTimeOut}
                                    </Text>
                                  </View>
                                  <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        toggleModal(index, checkAnswer)
                                      }>
                                      {/* <TouchableOpacity onPress={checkAnswer ? toggleCorrectModal : toggleWrongModal}> */}
                                      <Text
                                        style={[
                                          styles.textMedium16,
                                          {fontWeight: 'bold'},
                                          checkAnswer
                                            ? pageStyle.trueColor
                                            : checkColorTimeOut,
                                        ]}>
                                        {checkAnswer ? 'ดูคำถาม' : 'ดูเฉลย'}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              );
                            })
                          : null}
                        <View style={{height: 30}} />
                      </ScrollView>
                    </View>
                  )}
                  {showDetailScore ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 40,
                        marginTop: 20,
                      }}>
                      <TouchableOpacity
                        style={{alignItems: 'center', marginTop: 10}}
                        onPress={() =>
                          navigation.navigate('ranking', {
                            csgId: csgId,
                            gradeId: gradeId,
                            csgName: csgName,
                            gradeName: gradeName,
                          })
                        }>
                        <Text
                          style={[
                            styles.textBold16,
                            {
                              textAlignVertical: 'center',
                              textAlign: 'center',
                              padding: 10,
                              borderRadius: 15,
                              borderWidth: 1,
                              width: 155,
                              borderColor: '#FF834E',
                              backgroundColor: '#FF56BB99',
                              color: '#fff',
                            },
                          ]}>
                          ดูอันดับ
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 40,
                        marginTop: 20,
                      }}>
                      <TouchableOpacity
                        style={{alignItems: 'center', marginTop: 10}}
                        onPress={() => setshowDetailScore(true)}>
                        <Text
                          style={[
                            styles.textBold16,
                            {
                              textAlignVertical: 'center',
                              textAlign: 'center',
                              padding: 10,
                              borderRadius: 15,
                              borderWidth: 1,
                              width: 155,
                              borderColor: '#FF834E',
                              backgroundColor: '#FF56BB99',
                              color: '#fff',
                            },
                          ]}>
                          ดูอันดับ
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{alignItems: 'center', marginTop: 10}}
                        onPress={() =>
                          navigation.navigate('optionTest', {
                            subid: csgId,
                            gradeid: gradeId,
                            csgName: csgName,
                          })
                        }>
                        <Text
                          style={[
                            styles.textBold16,
                            {
                              textAlignVertical: 'center',
                              textAlign: 'center',
                              padding: 10,
                              borderRadius: 15,
                              borderWidth: 1,
                              width: 155,
                              borderColor: '#FF4EB8',
                              backgroundColor: '#F9FE07BF',
                              color: '#0036F3',
                            },
                          ]}>
                          ทำอีกครั้ง
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <Modal isVisible={ModalVisible}>
                  <AnswerModal />
                </Modal>
                {/* <Modal isVisible={isWrongModalVisible}>
                <WrongModel />
              </Modal> */}
              </View>
            </ScrollView>
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
});

export default scoreScreen;
