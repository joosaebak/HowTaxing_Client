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

const CertSheet = props => {
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
        height: currentPageIndex === 0 ? 480 : 520,
        width: width - 40,
      }}>
      {currentPageIndex === 0 && (
        <SheetContainer width={width}>
          <ModalInputSection>
            <ModalTitle>본인인증을 진행해주세요</ModalTitle>
            <ModalDescription>
              전자증명서 이용을 위해{'\n'}서비스 약관에 동의해주세요
            </ModalDescription>
            <ListItem style={{marginTop: 20}}>
              <CheckCircle
                onPress={() => {
                  if (agreeCert && agreePrivacy && agreeKB) {
                    setAgreeCert(false);
                    setAgreePrivacy(false);
                    setAgreeKB(false);
                  } else {
                    setAgreeCert(true);
                    setAgreePrivacy(true);
                    setAgreeKB(true);
                  }
                }}>
                {agreeCert && agreePrivacy && agreeKB && <CheckOnIcon />}
              </CheckCircle>
              <ListItemTitle
                style={{
                  fontSize: getFontSize(15),
                  fontFamily: 'Pretendard-Medium',
                }}>
                전체 동의하기
              </ListItemTitle>
            </ListItem>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#E8EAED',
                marginTop: 20,
              }}
            />
            <ListItem style={{marginTop: 20}}>
              <CheckCircle
                onPress={() => {
                  setAgreeCert(!agreeCert);
                }}>
                {agreeCert && <CheckOnIcon />}
              </CheckCircle>
              <ListItemTitle>[필수] 전자증명서 서비스 이용 약관</ListItemTitle>
              <ListItemButton>
                <ListItemButtonText>보기</ListItemButtonText>
              </ListItemButton>
            </ListItem>
            <ListItem style={{marginTop: 20}}>
              <CheckCircle
                onPress={() => {
                  setAgreePrivacy(!agreePrivacy);
                }}>
                {agreePrivacy && <CheckOnIcon />}
              </CheckCircle>
              <ListItemTitle>[필수] 개인정보 수집 및 이용 동의</ListItemTitle>
              <ListItemButton>
                <ListItemButtonText>보기</ListItemButtonText>
              </ListItemButton>
            </ListItem>
            <ListItem style={{marginTop: 20}}>
              <CheckCircle
                onPress={() => {
                  setAgreeKB(!agreeKB);
                }}>
                {agreeKB && <CheckOnIcon />}
              </CheckCircle>
              <ListItemTitle>[필수] KB 개인정보 제3자 제공 동의</ListItemTitle>
              <ListItemButton>
                <ListItemButtonText>보기</ListItemButtonText>
              </ListItemButton>
            </ListItem>
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
                  setCurrentPageIndex(1);
                }}
                style={{
                  width: width - 80,
                  alignSelf: 'center',
                  marginTop: 20,
                  marginBottom: 50,
                  backgroundColor:
                    agreeCert && agreePrivacy && agreeKB
                      ? '#2F87FF'
                      : '#E8EAED',
                }}>
                <ModalButtonText
                  style={{
                    color:
                      agreeCert && agreePrivacy && agreeKB ? '#fff' : '#717274',
                  }}>
                  동의 후 인증하기
                </ModalButtonText>
              </ModalButton>
            </DropShadow>
          </ButtonSection>
        </SheetContainer>
      )}
      {currentPageIndex === 1 && (
        <SheetContainer width={width}>
          <ModalInputSection>
            <CertLogoImage
              source={require('../../assets/images/certLogo/kb_logo.png')}
            />
            <ModalTitle>KB 간편 인증 정보 입력</ModalTitle>
            <ModalDescription
              style={{
                lineHeight: 20,
              }}>
              인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
              입력해주세요
            </ModalDescription>
            <ModalInputContainer>
              <ModalLabel>이름</ModalLabel>
              <ModalInput placeholder="이름" />
            </ModalInputContainer>
            <ModalInputContainer>
              <ModalLabel>휴대폰 번호</ModalLabel>
              <ModalInput placeholder="휴대폰 번호를 입력해주세요" />
            </ModalInputContainer>
            <ModalInputContainer>
              <ModalLabel>주민등록번호</ModalLabel>
              <ModalInput placeholder="주민등록번호를 입력해주세요" />
            </ModalInputContainer>
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
                  const chat = {
                    id: 'moment',
                    type: 'system',
                    message:
                      '잠깐!\n불러온 주택 중 입주권이 있다면 입주권이라고 반드시 알려주셔야 해요.',
                    questionId: 'moment',
                  };

                  props.payload.newNewMessageTirgger([chat]);
                }}>
                <ButtonText>다음으로</ButtonText>
              </Button>
            </ButtonShadow>
          </ButtonSection>
        </SheetContainer>
      )}
      {currentPageIndex === 2 && (
        <SheetContainer width={width}>
          <ModalInputSection>
            <CertLogoImage
              source={require('../../assets/images/certLogo/naver_logo.png')}
            />
            <ModalTitle>네이버 간편 인증 정보 입력</ModalTitle>
            <ModalDescription
              style={{
                lineHeight: 20,
              }}>
              인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
              입력해주세요
            </ModalDescription>
            <ModalInputContainer>
              <ModalLabel>아이디</ModalLabel>
              <ModalInput placeholder="아이디" />
            </ModalInputContainer>
            <ModalInputContainer>
              <ModalLabel>비밀번호</ModalLabel>
              <ModalInput placeholder="비밀번호를 입력해주세요" />
            </ModalInputContainer>
            <ModalInputContainer>
              <ModalLabel>주민등록번호</ModalLabel>
              <ModalInput placeholder="주민등록번호를 입력해주세요" />
            </ModalInputContainer>
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
                  const chat = {
                    id: 'moment',
                    type: 'system',
                    message:
                      '잠깐!\n불러온 주택 중 입주권이 있다면 입주권이라고 반드시 알려주셔야 해요.',
                    questionId: 'moment',
                  };

                  props.payload.newNewMessageTirgger([chat]);
                }}>
                <ButtonText>다음으로</ButtonText>
              </Button>
            </ButtonShadow>
          </ButtonSection>
        </SheetContainer>
      )}
      {currentPageIndex === 3 && (
        <SheetContainer width={width}>
          <ModalInputSection>
            <CertLogoImage
              source={require('../../assets/images/certLogo/toss_logo.png')}
            />
            <ModalTitle>토스 간편 인증 정보 입력</ModalTitle>
            <ModalDescription
              style={{
                lineHeight: 20,
              }}>
              인증사별 고객 정보가 필요해요{'\n'}아래 표시된 정보들을
              입력해주세요
            </ModalDescription>
            <ModalInputContainer>
              <ModalLabel>이름</ModalLabel>
              <ModalInput placeholder="이름" />
            </ModalInputContainer>
            <ModalInputContainer>
              <ModalLabel>휴대폰 번호</ModalLabel>
              <ModalInput placeholder="휴대폰 번호를 입력해주세요" />
            </ModalInputContainer>
            <ModalInputContainer>
              <ModalLabel>주민등록번호</ModalLabel>
              <ModalInput placeholder="주민등록번호를 입력해주세요" />
            </ModalInputContainer>
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
                  const chat = {
                    id: 'moment',
                    type: 'system',
                    message:
                      '잠깐!\n불러온 주택 중 입주권이 있다면 입주권이라고 반드시 알려주셔야 해요.',
                    questionId: 'moment',
                  };

                  props.payload.newNewMessageTirgger([chat]);
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

export default CertSheet;
