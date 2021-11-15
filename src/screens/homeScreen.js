import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/style';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// import Components
import AllDownload from '../components/allDownload';
import Loading from '../components/loading';

// import Icon
import HomeIcon from '../assets/images/icons/HomeIcon.svg';
import AdvertIcon from '../assets/images/icons/Vector.svg';

// import Ads
import { useRewardedAd } from '@react-native-admob/admob';
import BannerAds from '../components/bannerAds';
import * as subGradeActions from '../store/actions/subGrade';
import * as userActions from '../store/actions/user';
import { AdmobRewardId, adsWaitingTime } from '../utilities/functions';

dayjs.extend(utc)
const hookOptions = {
  loadOnMounted: false,
  loadOnDismissed: true,
  requestOptions: {
    requestNonPersonalizedAdsOnly: true,
  },
};

const homeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const privilege = useSelector(state => state.user.userPrivilege);
  const [privilegeVisible, setprivilegeVisible] = useState(false);
  const { adLoadError, adLoaded, reward, show, load } = useRewardedAd(AdmobRewardId, hookOptions);
  const [adsTimeStamp, setadsTimeStamp] = useState();
  const [adsTime, setAdsTime] = useState(0);

  const getPrivilege = useCallback(() => {
    dispatch(userActions.getPrivilege());
  })

  const savePrivilege = async () => {
    const dateNow = dayjs.utc().local().format();
    await AsyncStorage.setItem('adsTime', dateNow.toString());
    dispatch(userActions.addPrivilege());
  };

  const checkOldAdsTime = async () => {
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
    }
  }, [adLoadError]);

  useEffect(() => {
    if (reward) {
      console.log(`Reward Earned: ${reward.type}`);
      savePrivilege();
    }
  }, [reward]);

  useEffect(() => {
    checkOldAdsTime();
    getPrivilege();
  }, [privilege]);

  useEffect(() => {
    if (adsTimeStamp) {
      const timeNow = dayjs.utc().local().format();
      const findSecond = dayjs(timeNow) - dayjs(adsTimeStamp);
      const timeSec = findSecond / 1000;
      setAdsTime(timeSec)
    }
  }, [adsTimeStamp, privilegeVisible])

  const AdvertModal = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={[styles.boxOvertime, { backgroundColor: '#1FA246', borderRadius: 15 }]}>
          <Text style={[styles.textLight22, { marginTop: 10, textAlign: 'center', color: '#FFFFFF' }]}>
            ท่านมีสิทธื์ในการดูเฉลยจำนวน
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={[styles.textRegular30, pageStyle.privilegePoint]}>
              {privilege}
            </Text>
            <Text style={[styles.textLight22, pageStyle.privilegeText]}>
              สิทธิ์
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, marginBottom: 5 }}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => setprivilegeVisible(false)}>
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
            <View style={{ flex: 1 }}>
              <Text style={[styles.textMedium34, { textAlign: 'center', color: '#FFFFFF' }]}>
                ภาษาอังกฤษ
              </Text>
              <View style={{ margin: 10, flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => gradeHandler(1)}
                    style={[pageStyle.classBox, { backgroundColor: '#028c6a' }]}>
                    <Text style={[styles.textBold26, pageStyle.classText]}>ป.1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => gradeHandler(35)}
                    style={[pageStyle.classBox, { backgroundColor: '#28b786' }]}>
                    <Text style={[styles.textBold26, pageStyle.classText]}>ป.2</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => gradeHandler(36)}
                    style={[pageStyle.classBox, { backgroundColor: '#FFA73F' }]}>
                    <Text style={[styles.textBold26, pageStyle.classText]}>ป.3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => gradeHandler(37)}
                    style={[pageStyle.classBox, { backgroundColor: '#2E59F1' }]}>
                    <Text style={[styles.textBold26, pageStyle.classText]}>ป.4</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => gradeHandler(38)}
                    style={[pageStyle.classBox, { backgroundColor: '#ec6161' }]}>
                    <Text style={[styles.textBold26, pageStyle.classText]}>ป.5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => gradeHandler(39)}
                    style={[pageStyle.classBox, { backgroundColor: '#B13AFA' }]}>
                    <Text style={[styles.textBold26, pageStyle.classText]}>ป.6</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text style={[styles.textBold18, { textAlign: 'center', color: '#FFFFFF' }]}>
                  กลับมาหน้าหลักนี้โดยการกดรูปบ้าน {'\n'}
                  <HomeIcon width={26} height={26} /> ด้านบนขวาของแต่ละหน้า
                </Text>
                <TouchableOpacity
                  style={pageStyle.privilegeModal}
                  onPress={() => showRewardAds()}>
                  <AdvertIcon width={26} height={26} />
                  <Text style={[styles.textLight18, { textAlignVertical: 'center', marginLeft: 10, color: '#ffffff' }]}>
                    ดูโฆษณาเพื่อรับสิทธิ์ดูเฉลย
                  </Text>
                </TouchableOpacity>
                <AllDownload />
              </View>
              <Modal isVisible={privilegeVisible && adLoaded}>
                <AdvertModal />
              </Modal>
              <Loading isModalVisible={privilegeVisible && !adLoaded} />
            </View>
          </View>
        </View>
      </ImageBackground>
      <BannerAds />
    </SafeAreaView>
  );
};

const pageStyle = StyleSheet.create({
  classBox: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    margin: 5,
    justifyContent: 'center',
  },
  classText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontWeight: '600'
  },
  privilegeModal: {
    backgroundColor: '#37565b',
    margin: 10,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
  },
  overTimeLeft: {
    backgroundColor: '#fff',
    borderColor: '#D7B641',
    color: '#D7B641',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    width: 100,
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
  privilegePoint: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#D7B641',
    marginHorizontal: 5
  },
  privilegeText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#FFFFFF',
    marginHorizontal: 5
  }
});

export default homeScreen;
