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

const ModalSubtitle = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
  margin: 20px 0;
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
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  text-align: right;
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
  padding: 10px;
  border-top-width: 1px;
  border-top-color: #e8eaed;
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

const AcquisitionSheet = props => {
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
        height: currentPageIndex === 2 ? 400 : 600,
        width: width - 40,
      }}>
      {currentPageIndex === 0 && (
        <SheetContainer width={width}>
          <ModalInputSection>
            <ModalTitle>계약일자를 선택해주세요.</ModalTitle>
            <View
              style={{
                width: '100%',
                height: 410,
              }}>
              <Calendar />
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
                onPress={() => {
                  setCurrentPageIndex(1);
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
      )}
      {currentPageIndex === 1 && (
        <SheetContainer width={width}>
          <ModalInputSection>
            <ModalTitle>취득일자를 선택해주세요.</ModalTitle>
            <View
              style={{
                width: '100%',
                height: 410,
              }}>
              <Calendar />
            </View>
          </ModalInputSection>

          <ButtonSection>
            <ButtonShadow
              style={{
                shadowColor: '#fff',
              }}>
              <Button
                onPress={() => {
                  setCurrentPageIndex(0);
                }}
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#E8EAED',
                }}>
                <ButtonText
                  style={{
                    color: '#717274',
                  }}>
                  이전으로
                </ButtonText>
              </Button>
            </ButtonShadow>
            <ButtonShadow>
              <Button
                onPress={() => {
                  setCurrentPageIndex(2);
                }}>
                <ButtonText>다음으로</ButtonText>
              </Button>
            </ButtonShadow>
          </ButtonSection>
        </SheetContainer>
      )}
      {currentPageIndex === 2 && (
        <SheetContainer>
          <ModalInputSection>
            <ModalTitle>취득가액을 입력해주세요.</ModalTitle>
            <ModalSubtitle>{numberToKorean(acAmount)}</ModalSubtitle>
            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <ModalLabel>취득가액</ModalLabel>
                <TouchableOpacity
                  activeOpacity={0.8}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <InfoIcon />
                </TouchableOpacity>
              </View>
              <ModalInput
                placeholder="취득가액을 입력해주세요."
                keyboardType="number-pad"
                value={acAmount.toLocaleString()}
                onChangeText={setAcAmount}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                {[500000000, 100000000, 10000000, 1000000].map(
                  (item, index) => (
                    <ModalSelectButton
                      onPress={() => {
                        setAcAmount(item.amount);
                      }}>
                      <ModalSelectButtonText>
                        {numberToKorean(item)}
                      </ModalSelectButtonText>
                    </ModalSelectButton>
                  ),
                )}
              </View>
            </View>
          </ModalInputSection>
          <ButtonSection
            style={{
              borderTopWidth: 0,
            }}>
            <ButtonShadow
              style={{
                shadowColor: '#fff',
              }}>
              <Button
                onPress={() => {
                  setCurrentPageIndex(1);
                }}
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#E8EAED',
                }}>
                <ButtonText
                  style={{
                    color: '#717274',
                  }}>
                  이전으로
                </ButtonText>
              </Button>
            </ButtonShadow>
            <ButtonShadow>
              <Button
                onPress={() => {
                  actionSheetRef.current?.hide();
                  const chat1 = {
                    id: 'auiAmontSystem',
                    type: 'system',
                    message: '취득가액을 입력해주세요.',
                    questionId: 'apartment',
                  };
                  const chat2 = {
                    id: 'auiAmont',
                    type: 'my',
                    message: '43억원 (4,300,000,000원)',
                    questionId: 'apartment',
                  };
                  const chat3 = {
                    id: 'joint',
                    type: 'system',
                    message: '혹시 공동 소유 예정인가요?',
                    questionId: 'apartment',
                    select: [
                      {
                        id: 'only',
                        name: '단독 소유',
                      },
                      {
                        id: 'joint',
                        name: '공동 소유',
                      },
                    ],
                  };

                  props.payload.newMessageTrigger([chat1, chat2, chat3]);
                }}>
                <ButtonText>다음으로</ButtonText>
              </Button>
            </ButtonShadow>
          </ButtonSection>
        </SheetContainer>
      )}
    </ActionSheet>
  );
};

export default AcquisitionSheet;
