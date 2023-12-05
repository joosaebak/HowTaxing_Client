import {
  View,
  Text,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import SerchIcon from '../../assets/icons/search_map.svg';

import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
  Callout,
} from 'react-native-nmap';
import DropShadow from 'react-native-drop-shadow';
import {Picker, DatePicker} from 'react-native-wheel-pick';
import dayjs from 'dayjs';
import InfoIcon from '../../assets/icons/info_tooltip_ico.svg';
import {TimeDatePicker, Modes} from 'react-native-time-date-picker';
import {numToKorean} from 'num-to-korean';
import Calendar from '../Calendar';
import numberToKorean from '../../utils/numToKorean';
import CheckOnIcon from '../../assets/icons/check_on.svg';
import MinusIcon from '../../assets/icons/minus.svg';
import PlusIcon from '../../assets/icons/plus.svg';

const SheetContainer = styled.View`
  flex: 1;
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: auto;
`;

const ModalTitle = styled.Text`
  font-size: ${getFontSize(17)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
`;

const ModalLabel = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 18px;
  margin-right: 6px;
`;

const ModalDescription = styled.Text`
  font-size: ${getFontSize(15)}px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 26px;
  margin-top: 10px;
  text-align: center;
`;

const ListItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
`;

const CheckCircle = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #fff;
  border: 1px solid #cfd1d5;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const ListItemTitle = styled.Text`
  flex: 1;
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
`;

const ListItemButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))``;

const ListItemButtonText = styled.Text`
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
  text-decoration-line: underline;
  text-decoration-color: #717274;
`;

const CertLogoImage = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 28px;
  height: 20px;
  align-self: center;
  margin-bottom: 10px;
`;

const ModalInputContainer = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  padding: 0 20px;
`;

const ModalInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#C1C3C5',
}))`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: #f0f3f8;
  padding: 0 15px;
  margin-top: 10px;
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
  text-align: left;
`;

const ModalSelectButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 24%;
  height: 48px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border: 1px solid #e8eaed;
`;

const ModalSelectButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #1b1c1f;
  line-height: 20px;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  background-color: #fff;
`;

const ModalButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 48%;
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
`;

const ModalButtonText = styled.Text`
  font-size: ${getFontSize(15)}px;
  font-family: Pretendard-SemiBold;
  color: #fff;
  line-height: 20px;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 36px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
`;

const ButtonShadow = styled(DropShadow)`
  width: 48%;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 10;
  }
  shadow-opacity: 0.25;
  shadow-radius: 4;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
`;

const ButtonText = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const JointSheet = props => {
  const actionSheetRef = useRef(null);
  const scrollViewRef = useRef(null);
  const {width, height} = useWindowDimensions();
  const [hideHeader, setHideHeader] = useState(false);
  const P0 = {latitude: 37.564362, longitude: 126.977011};
  const P1 = {latitude: 37.565051, longitude: 126.978567};
  const P2 = {latitude: 37.565383, longitude: 126.976292};
  const scrollHandlers = useScrollHandlers('FlatList-1', actionSheetRef);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [acAmount, setAcAmount] = useState(550000000);
  const [agreeCert, setAgreeCert] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeKB, setAgreeKB] = useState(false);

  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      CustomHeaderComponent={
        <ModalHeader>
          <Pressable
            onPress={() => {
              actionSheetRef.current?.hide();
            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      gestureEnabled={true}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: currentPageIndex === 0 ? 280 : 520,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle>공동 소유자가 몇 명인가요?</ModalTitle>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: 206,
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <TouchableOpacity
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: '#E8EAED',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MinusIcon />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Pretendard-Bold',
                color: '#1B1C1F',
                lineHeight: 20,
                marginHorizontal: 10,
              }}>
              2명
            </Text>

            <TouchableOpacity
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: '#E8EAED',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PlusIcon />
            </TouchableOpacity>
          </View>
        </ModalInputSection>
        <ButtonSection
          style={{
            justifyContent: 'center',
          }}>
          <DropShadow
            style={{
              shadowColor: 'rgba(0,0,0,0.25)',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              alignSelf: 'center',
            }}>
            <ModalButton
              disabled={!(agreeCert && agreePrivacy && agreeKB)}
              onPress={() => {
                actionSheetRef.current?.hide();
                const chat = {
                  id: 'jointSystem',
                  type: 'system',
                  message: '공동 소유자가 몇 명인가요?',
                  questionId: 'apartment',
                };
                const chat1 = {
                  id: 'joint',
                  type: 'my',
                  message: '2명',
                  questionId: 'apartment',
                };
                const chat2 = {
                  id: 'anotherApartment',
                  type: 'system',
                  message: '취득하실 주택 외 보유 중인 주택이 있나요?',
                  questionId: 'apartment',
                  select: [
                    {
                      id: 'yes',
                      name: '네',
                    },
                    {
                      id: 'no',
                      name: '아니오',
                    },
                  ],
                };
                props.payload.newMessageTrigger([chat, chat1, chat2]);
              }}
              style={{
                width: width - 80,
                alignSelf: 'center',
                marginTop: 20,
                marginBottom: 50,
              }}>
              <ModalButtonText>다음으로</ModalButtonText>
            </ModalButton>
          </DropShadow>
        </ButtonSection>
      </SheetContainer>
    </ActionSheet>
  );
};

export default JointSheet;
