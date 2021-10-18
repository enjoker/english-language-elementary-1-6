import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import styles from '../styles/style';
import { useSelector, useDispatch } from 'react-redux';
import { DataTable } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as scoreActions from '../store/actions/score';

const rankingScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { csgId, gradeId, csgName, gradeName } = route.params;
  const { width } = Dimensions.get('window');
  const user = useSelector(state => state.score.user);
  const reportData = useSelector(state => state.score.showRanking);

  const findRank = reportData ?
    reportData
      .sort((a, b) => {
        return b.exreUsedTime - a.exreUsedTime;
      })
      .sort((a, b) => {
        return b.exreRankingScore - a.exreRankingScore;
      })
    : false

  const myRanking = findRank ?
    findRank.findIndex(item => item.exreUser === user)
    : false

  const getReportData = useCallback(() => {
    dispatch(scoreActions.getRanking(csgId))
  }, [])

  useEffect(() => {
    getReportData()
  }, [])

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
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.textMedium20, { textAlign: 'center', color: '#FFFFFF' }]}>
                  อันดับ
                </Text>
                <Text numberOfLines={1} style={[styles.textMedium20, { textAlign: 'center', color: '#FFFFFF', flex: 1 }]}>
                  {csgName}
                </Text>
                <Text style={[styles.textMedium20, { textAlign: 'center', color: '#FFFFFF' }]}>
                  {gradeName}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={{ flex: 1.5, justifyContent: 'flex-start' }}>
                      <Text style={[styles.textRegular14, { color: '#FFFFFF' }]}>อันดับ</Text>
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 3, justifyContent: 'center' }}>
                      <Text style={[styles.textRegular14, { color: '#FFFFFF' }]}>ชื่อ</Text>
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 2, justifyContent: 'center' }}>
                      <Text style={[styles.textRegular14, { color: '#FFFFFF' }]}>ระดับ</Text>
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 1.5, justifyContent: 'flex-end' }}>
                      <Text style={[styles.textRegular14, { color: '#FFFFFF' }]}>คะแนน</Text>
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 1.5, justifyContent: 'flex-end' }}>
                      <Text style={[styles.textRegular14, { color: '#FFFFFF' }]}>เวลา</Text>
                    </DataTable.Title>
                  </DataTable.Header>
                  <ScrollView>
                    {
                      findRank ?
                        findRank.slice(0, 10).map((item, index) => {
                          return (
                            <DataTable.Row
                              key={item.exreId}
                              style={{
                                backgroundColor: '#fff',
                                borderColor: '#2654f5',
                                borderWidth: 1,
                                borderBottomWidth: 1,
                                borderBottomColor: '#2654f5',
                                borderRadius: 8,
                                marginBottom: 5,
                              }}>
                              <DataTable.Cell style={{ flex: 1.5, justifyContent: 'flex-start' }}>
                                <Text style={[styles.textRegular14, { color: '#EF5DA8' }]}>{index + 1}</Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={{ flex: 3, justifyContent: 'flex-start' }}>
                                <Text style={[styles.textRegular14, { color: '#EF5DA8' }]}>{item.exreUser}</Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }}>
                                <Text style={[styles.textRegular14, { color: '#EF5DA8' }]}>
                                  {
                                    item.clvId === 1 ?
                                      'ง่าย'
                                      : item.clvId === 3 ?
                                        'ปานกลาง'
                                        : item.clvId === 4 ?
                                          'ยาก'
                                          : '-'
                                  }
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={{ flex: 1.5, justifyContent: 'flex-end' }}>
                                <Text style={[styles.textRegular14, { color: '#EF5DA8' }]}>{item.exreRankingScore.toFixed(2)}</Text>
                              </DataTable.Cell>
                              <DataTable.Cell style={{ flex: 1.5, justifyContent: 'flex-end' }}>
                                <Text style={[styles.textRegular14, { color: '#EF5DA8' }]}>{
                                  item.exreUsedTime < 600 ?
                                    new Date(item.exreUsedTime * 1000).toISOString().substr(15, 1) + '.' + new Date(item.exreUsedTime * 1000).toISOString().substr(17, 2)
                                    : new Date(item.exreUsedTime * 1000).toISOString().substr(14, 2) + '.' + new Date(item.exreUsedTime * 1000).toISOString().substr(17, 2)
                                }</Text>
                              </DataTable.Cell>
                            </DataTable.Row>
                          )
                        })
                        : null
                    }
                  </ScrollView>
                </DataTable>
              </View>
              <View
                style={{
                  flex: 0.5,
                  marginTop: 50,
                }}>
                <Text style={[styles.textMedium20, { textAlign: 'center', color: '#FFFFFF' }]}>
                  อันดับสูงสุดของคุณ
                </Text>
                <DataTable>
                  <DataTable.Row
                    style={{
                      backgroundColor: '#fff',
                      borderColor: '#2654f5',
                      borderWidth: 1,
                      borderBottomWidth: 1,
                      borderBottomColor: '#2654f5',
                      borderRadius: 10,
                      marginBottom: 5,
                    }}>
                    <DataTable.Cell style={{ flex: 1.5, justifyContent: 'flex-start' }}>
                      <Text style={[styles.textRegular14, { color: '#EF5DA8' }]}>{myRanking + 1}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 3, justifyContent: 'flex-start' }}>
                      <Text style={[styles.textRegular14, { color: '#EF5DA8' }]}>
                        {findRank && myRanking !== false ? findRank[myRanking].exreUser : null}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }}>
                      <Text style={[styles.textRegular14, { color: '#EF5DA8' }]}>
                        {
                          findRank && myRanking !== false ?
                            findRank[myRanking].clvId === 1 ?
                              'ง่าย'
                              : findRank[myRanking].clvId === 3 ?
                                'ปานกลาง'
                                : findRank[myRanking].clvId === 4 ?
                                  'ยาก'
                                  : '-'
                            : null
                        }
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1.5, justifyContent: 'flex-end' }}>
                      <Text style={[styles.textRegular14, { color: '#EF5DA8' }]}>
                        {
                          findRank && myRanking !== false ?
                            findRank[myRanking].exreRankingScore.toFixed(2)
                            : null
                        }
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1.5, justifyContent: 'flex-end' }}>
                      <Text style={[styles.textRegular14, { color: '#EF5DA8' }]}>
                        {
                          findRank && myRanking !== false ?
                            findRank[myRanking].exreUsedTime < 600 ?
                              new Date(findRank[myRanking].exreUsedTime * 1000).toISOString().substr(15, 1) + '.' + new Date(findRank[myRanking].exreUsedTime * 1000).toISOString().substr(17, 2)
                              : new Date(findRank[myRanking].exreUsedTime * 1000).toISOString().substr(14, 2) + '.' + new Date(findRank[myRanking].exreUsedTime * 1000).toISOString().substr(17, 2)
                            : null
                        }
                      </Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                </DataTable>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    style={{ alignItems: 'center', marginTop: 10 }}
                    onPress={() => navigation.navigate('home')}>
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
                          backgroundColor: '#fff',
                          color: '#FF834E',
                        },
                      ]}>
                      กลับหน้าหลัก
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ alignItems: 'center', marginTop: 10 }}
                    onPress={() => navigation.navigate('optionTest', {
                      subid: csgId,
                      gradeid: gradeId,
                      csgName: csgName
                    })}>
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
                          color: '#0036F3D9',
                        },
                      ]}>
                      ทำอีกครั้ง
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={{ backgroundColor: '#EEEEEE', height: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ads Area</Text>
      </View>
    </SafeAreaView>
  );
};

export default rankingScreen;
