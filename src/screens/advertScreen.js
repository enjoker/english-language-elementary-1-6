import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/style';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// import Components
import Loading from '../components/loading';

// import Actions
import * as userActions from '../store/actions/user';

// import Icon
import AdvertIcon from '../assets/images/icons/Vector.svg';
import Advert2Icon from '../assets/images/icons/Vector2.svg';

// import Ads
import { useRewardedAd } from '@react-native-admob/admob';
import BannerAds from '../components/bannerAds';
import { AdmobRewardId, adsWaitingTime } from '../utilities/functions';

const hookOptions = {
  loadOnMounted: false,
  loadOnDismissed: true,
  requestOptions: {
    requestNonPersonalizedAdsOnly: true,
  },
};

dayjs.extend(utc)

const advertScreen = ({ route }) => {
  const dispatch = useDispatch();
  const privilege = useSelector(state => state.user.userPrivilege)
  const { username } = route.params;
  const [privilegeVisible, setprivilegeVisible] = useState(false);
  const { adLoadError, adLoaded, reward, show, load } = useRewardedAd(AdmobRewardId, hookOptions);
  const [adsTimeStamp, setadsTimeStamp] = useState();
  const [adsTime, setAdsTime] = useState(0);

  const register = async () => {
    try {
      dispatch(userActions.addUser(username));
    } catch (error) {
      console.log(error);
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

  const savePrivilege = async () => {
    const dateNow = dayjs.utc().local().format();
    try {
      await AsyncStorage.setItem('adsTime', dateNow.toString());
      dispatch(userActions.addPrivilege());
    } catch (error) {
      console.log(error)
    }
  };

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
    checkAdsTime()
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
        <View
          style={[
            styles.boxOvertime,
            { backgroundColor: '#1FA246', borderRadius: 15 },
          ]}>
          <Text style={[styles.textLight22, {
            marginTop: 10,
            textAlign: 'center',
            color: '#FFFFFF',
          }]}>
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ padding: 15, paddingBottom: 0, marginBottom: 10, flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={[styles.textMedium20, { textAlign: 'center', color: '#333333' }]}>
              ท่านได้รับสิทธิ์ดูเฉลยคำตอบจำนวน
            </Text>
            <View style={{ margin: 5 }}>
              <Text style={[styles.textMedium40, { textAlign: 'center', color: '#333333' }]}>{privilege}</Text>
            </View>
            <TouchableOpacity
              onPress={() => showRewardAds()}
              style={[
                {
                  alignItems: 'center',
                  padding: 10,
                  margin: 5,
                  borderRadius: 8,
                  backgroundColor: '#FF4EB8',
                }
              ]}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Advert2Icon width={26} height={26} style={{ marginHorizontal: 5 }} />
                <Text style={[styles.textLight20, { marginHorizontal: 5, color: '#ffffff' }]}>
                  ดูโฆษณาเพื่อรับสิทธิ์เพิ่ม
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => register()}
              style={{
                alignItems: 'center',
                padding: 10,
                margin: 5,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#C4C4C4',
              }}>
              <Text style={[styles.textLight20, { marginHorizontal: 5, color: '#0036F3' }]}>
                ไปหน้าหลัก
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={[styles.textLight20, { marginHorizontal: 5, color: '#333333' }]}>
                ท่านสามารถกดรับสิทธิ์เพิ่มได้เมื่อ
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={[styles.textLight20, { marginHorizontal: 5, color: '#333333' }]}>
                สัญลักษณ์นี้{ }
              </Text>
              <AdvertIcon width={26} height={26} style={{ marginHorizontal: 5 }} />
              <Text style={[styles.textLight20, { marginHorizontal: 5, color: '#333333' }]}>
                ปรากฎด้านบน
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <BannerAds />
      <Modal isVisible={privilegeVisible && adLoaded}>
        <AdvertModal />
      </Modal>
      <Loading isModalVisible={privilegeVisible && !adLoaded} />
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
});

export default advertScreen;