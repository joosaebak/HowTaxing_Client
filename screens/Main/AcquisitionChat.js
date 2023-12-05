import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import {Modalize} from 'react-native-modalize';
import {numToKorean} from 'num-to-korean';
import {TimeDatePicker, Modes} from 'react-native-time-date-picker';
import DropShadow from 'react-native-drop-shadow';
import dayjs from 'dayjs';
import getFontSize from '../../utils/getFontSize';

// Icons
import BuildingIcon1 from '../../assets/icons/house/building_type1_ico.svg';
import BuildingIcon2 from '../../assets/icons/house/building_type2_ico.svg';
import HouseIcon from '../../assets/icons/house/house.svg';
import VillaIcon from '../../assets/icons/house/villa.svg';
import PencilIcon from '../../assets/icons/pencil.svg';
import KBICon from '../../assets/icons/cert/kb_bank.svg';
import NaverIcon from '../../assets/icons/cert/naver_ico.svg';
import TossIcon from '../../assets/icons/cert/toss_ico.svg';
import InfoIcon from '../../assets/icons/info_tooltip_ico.svg';
import ArrowIcon from '../../assets/icons/previous_arrow_ico.svg';
import MyLocationIcon from '../../assets/icons/my_location_ico.svg';
import CloseIcon from '../../assets/icons/close_button.svg';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import QuestionIcon from '../../assets/icons/question.svg';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const ProgressSection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 5px;
  background-color: #e8eaed;
`;

const ProgreeBar = styled.View`
  width: 33.3%;
  height: 5px;
  background-color: #2f87ff;
  border-top-right-radius: 2.5px;
  border-bottom-right-radius: 2.5px;
`;

const ChatItem = styled(Animatable.View)`
  width: 100%;
  height: auto;
  padding: 10px 20px;
  margin-bottom: ${props => (props.isLast ? 80 : 0)}px;
`;

const Avatar = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 35px;
  height: 35px;
  border-radius: 17.5px;
  background-color: '#F0F3F8';
`;

const ChatBubble = styled.View`
  width: 80%;
  height: auto;
  border-radius: 10px;
  background-color: #f0f3f8;
  align-items: flex-start;
  justify-content: center;
  padding: 15px 25px;
  margin-bottom: 10px;
  margin-top: 8px;
`;

const ChatBubbleText = styled.Text`
  font-size: ${getFontSize(15)}px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 30px;
  letter-spacing: -0.5px;
`;

const SelectButtonGroup = styled.View`
  width: 100%;
  margin-top: 15px;
`;

const SelectButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  flex-direction: row;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const SelectButtonText = styled.Text`
  font-size: ${getFontSize(15)}px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 20px;
  margin-left: 8px;
`;

const MyChatItem = styled.View`
  flex-direction: row;
  width: 100%;
  height: auto;
  padding: 0 25px;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const MyChatBubble = styled.View`
  width: auto;
  height: auto;
  border-radius: 10px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  padding: 15px 25px;
`;

const MyChatBubbleText = styled.Text`
  font-size: ${getFontSize(15)}px;
  font-family: Pretendard-SemiBold;
  color: #fff;
  line-height: 30px;
`;

const EditButton = styled.Pressable.attrs(props => ({
  hitSlop: {top: 20, bottom: 20, left: 20, right: 20},
}))`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #f0f3f8;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: -10px;
`;

const KakaoButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex-direction: row;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #fbe54d;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;

const ModalTitle = styled.Text`
  font-size: ${getFontSize(17)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
`;

const ModalSubtitle = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
  margin: 20px 0;
`;

const ModalAddressInputContainer = styled.View`
  width: 100%;
  height: 57px;
  background-color: #f5f7fa;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-top: 10px;
`;

const ModalAddressInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#A3A5A8',
  placeholder: '주택명 혹은 지역명을 입력해주세요',
}))`
  flex: 1;
  font-size: ${getFontSize(13)}px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
`;

const ModalInputButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
  hitSlop: {top: 20, bottom: 20, left: 20, right: 20},
}))`
  align-items: center;
  justify-content: center;
`;

const ModalLabel = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 18px;
  margin-right: 6px;
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

const MyLocationButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const MapMarkerShadow = styled(DropShadow)`
  shadow-color: #2f87ff;
  shadow-offset: {
    width: 0;
    height: 6;
  }
  shadow-opacity: 0.6;
  shadow-radius: 4;
`;

const MapSearchResultSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  position: absolute;
  height: 270px;
  bottom: 0;
`;

const MapSearchResultHeader = styled.View`
  width: 100%;
  height: 46px;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  border-bottom-width: 1px;
  border-bottom-color: #e8eaed;
  background-color: #fff;
`;

const MapSearchResultHeaderTitle = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 24px;
  margin-left: 10px;
  letter-spacing: -0.3px;
`;

const MapSearchResultItem = styled.View`
  width: 100%;
  height: auto;
  min-height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #e8eaed;
`;

const MapSearchResultItemTitle = styled.Text`
  font-size: ${getFontSize(13)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
`;

const MapSearchResultItemAddress = styled.Text`
  width: 90%;
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
  margin-left: 4px;
`;

const AddressNumberBadge = styled.View`
  width: 37px;
  height: 22px;
  border-radius: 11px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #e8eaed;
`;

const AddressNumberText = styled.Text`
  font-size: ${getFontSize(10)}px;
  font-family: Pretendard-Medium;
  color: #a3a5a8;
  line-height: 16px;
`;

const MepSearchResultButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
}))`
  width: 65px;
  height: 36px;
  border-radius: 18px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
`;

const MapSearchResultButtonText = styled.Text`
  font-size: ${getFontSize(13)}px;
  font-family: Pretendard-Medium;
  color: #2f87ff;
  line-height: 16px;
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

const AcquisitionChat = () => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const modalizeRef = useRef(null);
  const flatlistRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [acAmount, setAcAmount] = useState(0);
  const [koranNum, setKoranNum] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chatDataList, setChatDataList] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => {
            navigation.goBack();
          }}>
          <CloseIcon />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: '취득세 계산하기',
      headerShadowVisible: false,
      contentStyle: {
        borderTopColor: '#F7F7F7',
        borderTopWidth: 1,
      },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#333',
        letterSpacing: -0.8,
      },
    });
  }, []);

  useEffect(() => {
    // SheetManager.show('mapViewList2');
    // SheetManager.show('cert');
    // SheetManager.show('joint');
  }, []);

  useEffect(() => {
    setChatDataList([dummyData[0]]);
  }, []);

  // useEffect(() => {
  //   if (currentIndex !== 0) {
  //     setChatDataList([...chatDataList, dummyData[currentIndex - 1]]);
  //   }
  // }, [currentIndex]);

  useEffect(() => {
    setKoranNum(numToKorean(acAmount));
  }, [acAmount]);

  const dummyData = [
    {
      id: 'type',
      type: 'system',
      message: '취득하실 주택 종류는 무엇인가요?',
      nextQuestionId: 'apartment',
      select: [
        {
          id: 'apartment',
          name: '아파트',
          icon: <BuildingIcon1 />,
        },
        {
          id: 'house',
          name: '단독주택 · 다가구',
          icon: <HouseIcon />,
        },
        {
          id: 'villa',
          name: '연립 · 다세대',
          icon: <VillaIcon />,
        },
        {
          id: 'ticket',
          name: '입주권',
          icon: <BuildingIcon2 />,
        },
      ],
    },
    {
      id: 'apartment',
      type: 'system',
      message:
        '분양권 상태에서 최초 취득하신 아파트는 세금 계산 방식이 달라요.\n혹시 아파트를 분양권 상태에서 취득하실 예정인가요?',
      nextQuestionId: 'map',
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
    },
    {
      id: 2,
      type: 'system',
      message: '혹시 임대사업자이신가요?',
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
    },
    {
      id: 3,
      type: 'my',
      message: '주택',
    },
    {
      id: 4,
      type: 'system',
      message:
        '임대사업자에 해당되시면 전문 세무사에게 상담을 문의해보세요.\n어떤 복잡한 상황에도 최선의 결과를 알려주실 거에요.',
    },
    {
      id: 'cert',
      type: 'system',
      message: '본인인증을 진행하시겠어요?',
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
    },

    {
      id: 'certType',
      type: 'system',
      message:
        '공공기관에서 여러 인증방식을 제공해요. 인증방식을 선택해주세요.',
      select: [
        {
          id: 'kb',
          name: 'KB 간편인증',
          icon: <KBICon />,
        },
        {
          id: 'naver',
          name: '네이버 간편인증',
          icon: <NaverIcon />,
        },
        {
          id: 'toss',
          name: '토스 인증',
          icon: <TossIcon />,
        },
      ],
    },
  ];

  const newMessageTrigger = chatList => {
    console.log('chat', chatList);
    setChatDataList([...chatDataList, ...chatList]);
    setTimeout(() => {
      flatlistRef.current.scrollToEnd({
        animated: true,
        duration: 600,
      });
    }, 500);
  };

  return (
    <Container>
      <ProgressSection>
        <ProgreeBar />
      </ProgressSection>
      <FlatList
        ref={flatlistRef}
        data={chatDataList}
        keyExtractor={(item, index) => {
          `chat-${index}`;
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        renderItem={({item, index}) =>
          item?.type === 'my' ? (
            <MyChatItem>
              <MyChatBubble>
                <MyChatBubbleText>{item?.message}</MyChatBubbleText>
                <EditButton
                  onPress={() => {
                    console.log(item);
                    // const newQuestion = dummyData.find(
                    //   el => el.id === item.questionId,
                    // );
                    // setChatDataList([...chatDataList, newQuestion]);
                  }}>
                  <PencilIcon />
                </EditButton>
              </MyChatBubble>
            </MyChatItem>
          ) : (
            <>
              <ChatItem
                animation="fadeInUp"
                isLast={chatDataList.length - 1 === index}>
                <Avatar source={{uri: 'https://picsum.photos/200/300'}} />
                <ChatBubble>
                  <ChatBubbleText>{item?.message}</ChatBubbleText>
                  {item?.select && (
                    <SelectButtonGroup>
                      {item?.select.map((item2, index2) => (
                        <SelectButton
                          key={index2}
                          onPress={() => {
                            if (item.id === 'type') {
                              if (item2.id === 'apartment') {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                setChatDataList([
                                  ...chatDataList,
                                  chat,
                                  dummyData[1],
                                ]);
                                // setCurrentIndex(chatDataList.length + 1);

                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                              } else if (item2.id === 'ticket') {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };

                                const systemChat = {
                                  id: 'already',
                                  type: 'system',
                                  message:
                                    '취득하실 주택이 멸실되었는지에 따라 입주권의 세금 계산 방식이 달라져요. 혹시 이미 멸실된 입주권을 취득하실 예정인가요?',
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

                                setChatDataList([
                                  ...chatDataList,
                                  chat,
                                  systemChat,
                                ]);
                                // setCurrentIndex(chatDataList.length + 1);

                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                              } else {
                                SheetManager.show('mapViewList2', {
                                  payload: {
                                    newMessageTrigger: newMessageTrigger,

                                    questionId: item2.id,
                                  },
                                });
                              }
                            }

                            if (item.id === 'apartment') {
                              if (item2.id === 'yes') {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                const chat2 = {
                                  id: chatDataList.length + 2,
                                  type: 'system',
                                  message:
                                    '취득하실 아파트 단지를 선택해주세요.',
                                  questionId: item2.id,
                                };
                                setChatDataList([...chatDataList, chat, chat2]);

                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                                SheetManager.show('mapViewList', {
                                  payload: {
                                    newMessageTrigger: newMessageTrigger,
                                    questionId: item2.id,
                                  },
                                });
                              } else {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                const chat2 = {
                                  id: chatDataList.length + 2,
                                  type: 'system',
                                  message:
                                    '취득하실 아파트 단지를 선택해주세요.',
                                  questionId: item2.id,
                                };
                                setChatDataList([...chatDataList, chat, chat2]);

                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                                SheetManager.show('mapViewList', {
                                  payload: {
                                    newMessageTrigger: newMessageTrigger,
                                    questionId: item2.id,
                                  },
                                });
                              }
                            }

                            if (item.id === 'already') {
                              if (item2.id === 'yes') {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                setChatDataList([
                                  ...chatDataList,
                                  chat,
                                  dummyData[1],
                                ]);
                                // setCurrentIndex(chatDataList.length + 1);

                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                              } else {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                setChatDataList([
                                  ...chatDataList,
                                  chat,
                                  dummyData[2],
                                ]);
                                // setCurrentIndex(chatDataList.length + 1);

                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                                SheetManager.show('mapViewList2', {
                                  payload: {
                                    newMessageTrigger: newMessageTrigger,
                                    questionId: item2.id,
                                  },
                                });
                              }
                            }
                            if (item.id === 'joint') {
                              console.log('joint');
                              if (item2.id === 'only') {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                setChatDataList([
                                  ...chatDataList,
                                  chat,
                                  dummyData[5],
                                ]);
                                // setCurrentIndex(chatDataList.length + 1);

                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                              } else {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                setChatDataList([...chatDataList, chat]);

                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                                SheetManager.show('joint', {
                                  payload: {
                                    newMessageTrigger: newMessageTrigger,
                                    questionId: item2.id,
                                  },
                                });
                              }
                            }
                            if (item.id === 'anotherApartment') {
                              if (item2.id === 'yes') {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: '취득하실 주택의 취득세를 계산하기 위해 보유 중인 주택 정보를 불러오려고 해요.\n공공기관에서 스크랩핑할 예정이에요. 따라서 정보를 가져오려면 본인인증이 필수에요.',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                setChatDataList([
                                  ...chatDataList,
                                  chat,
                                  dummyData[5],
                                ]);
                                // setCurrentIndex(chatDataList.length + 1);

                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                              } else {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                setChatDataList([
                                  ...chatDataList,
                                  chat,
                                  dummyData[2],
                                ]);
                                // setCurrentIndex(chatDataList.length + 1);

                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                                SheetManager.show('mapViewList2', {
                                  payload: {
                                    newMessageTrigger: newMessageTrigger,
                                    questionId: item2.id,
                                  },
                                });
                              }
                            }

                            if (item.id === 'cert') {
                              if (item2.id === 'yes') {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                setChatDataList([
                                  ...chatDataList,
                                  chat,
                                  dummyData[6],
                                ]);
                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                              } else {
                                const chat = {
                                  id: chatDataList.length + 1,
                                  type: 'my',
                                  message: item2.name,
                                  questionId: item2.id,
                                };
                                setChatDataList([...chatDataList, chat]);
                                setTimeout(() => {
                                  flatlistRef.current.scrollToEnd({
                                    animated: true,
                                    duration: 600,
                                  });
                                }, 500);
                              }
                            }

                            if (item.id === 'certType') {
                              if (item2.id === 'kb') {
                                SheetManager.show('cert', {
                                  payload: {
                                    newMessageTrigger: newMessageTrigger,
                                    questionId: item2.id,
                                  },
                                });
                              }
                            }
                          }}>
                          {item2?.icon ? item2.icon : null}
                          <SelectButtonText>{item2?.name}</SelectButtonText>
                        </SelectButton>
                      ))}
                    </SelectButtonGroup>
                  )}
                </ChatBubble>
                {item.id === 'apartmentAddressInfoSystem' && (
                  <DropShadow
                    style={{
                      shadowColor: 'rgba(0,0,0,0.25)',
                      shadowOffset: {
                        width: 0,
                        height: 10,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      width: '100%',
                    }}>
                    <View
                      style={{
                        width: width - 40,
                        borderRadius: 10,
                        height: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                        backgroundColor: '#fff',
                        padding: 20,
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Pretendard-Bold',
                          fontSize: getFontSize(16),
                          color: '#1B1C1F',
                          lineHeight: 20,
                          textAlign: 'center',
                        }}>
                        주택 정보
                      </Text>

                      <Text
                        style={{
                          fontFamily: 'Pretendard-SemiBold',
                          fontSize: getFontSize(13),
                          color: '#1B1C1F',
                          lineHeight: 20,
                          textAlign: 'center',
                          marginTop: 15,
                        }}>
                        반포래미안원베일리 118동 1403호
                      </Text>

                      <View
                        style={{
                          width: '100%',
                          height: 48,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 20,
                          backgroundColor: '#fff',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: '#E8EAED',
                          alignSelf: 'center',
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Pretendard-Regular',
                              fontSize: getFontSize(12),
                              color: '#A3A5A8',
                              lineHeight: 20,
                              marginRight: 5,
                            }}>
                            KB시세
                          </Text>
                          <QuestionIcon />
                        </View>
                        <Text
                          style={{
                            fontFamily: 'Pretendard-Bold',
                            fontSize: getFontSize(15),
                            color: '#2F87FF',
                            lineHeight: 20,
                          }}>
                          5.2억원 - 5.6억원
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          height: 48,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 20,
                          backgroundColor: '#fff',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: '#E8EAED',
                          alignSelf: 'center',
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Pretendard-Regular',
                              fontSize: getFontSize(12),
                              color: '#A3A5A8',
                              lineHeight: 20,
                              marginRight: 5,
                            }}>
                            공시지가
                          </Text>
                          <QuestionIcon />
                        </View>
                        <Text
                          style={{
                            fontFamily: 'Pretendard-Bold',
                            fontSize: getFontSize(15),
                            color: '#2F87FF',
                            lineHeight: 20,
                          }}>
                          4.5억원
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          height: 48,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 20,
                          backgroundColor: '#fff',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: '#E8EAED',
                          alignSelf: 'center',
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Pretendard-Regular',
                              fontSize: getFontSize(12),
                              color: '#A3A5A8',
                              lineHeight: 20,
                              marginRight: 5,
                            }}>
                            전용면적
                          </Text>
                          <QuestionIcon />
                        </View>
                        <Text
                          style={{
                            fontFamily: 'Pretendard-Bold',
                            fontSize: getFontSize(15),
                            color: '#2F87FF',
                            lineHeight: 20,
                          }}>
                          84.893m2 (33평)
                        </Text>
                      </View>
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
                            console.log('next');
                            SheetManager.show('acquisition', {
                              payload: {
                                newMessageTrigger: newMessageTrigger,
                                questionId: item.id,
                              },
                            });
                          }}
                          style={{
                            width: width - 80,
                            alignSelf: 'center',
                            marginTop: 20,
                          }}>
                          <ModalButtonText>다음으로</ModalButtonText>
                        </ModalButton>
                      </DropShadow>
                    </View>
                  </DropShadow>
                )}
              </ChatItem>
            </>
          )
        }
      />
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        modalStyle={{
          width: width - 40,
          alignSelf: 'center',
        }}
        withReactModal
        withHandle={false}>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => {
            modalizeRef.current?.close();
          }}
          style={{
            alignSelf: 'flex-end',
            marginTop: 17,
            marginRight: 17,
          }}>
          <CloseIcon width={12} height={12} />
        </TouchableOpacity>
      </Modalize>
    </Container>
  );
};

export default AcquisitionChat;

// <ModalInputSection>
// <ModalTitle>취득가액을 입력해주세요.</ModalTitle>
// <ModalSubtitle>{koranNum}</ModalSubtitle>
// <View
//   style={{
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//   }}>
//   <ModalLabel>취득가액</ModalLabel>
//   <TouchableOpacity
//     activeOpacity={0.8}
//     hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
//     <InfoIcon />
//   </TouchableOpacity>
// </View>
// <ModalInput
//   placeholder="취득가액을 입력해주세요."
//   keyboardType="number-pad"
//   value={acAmount.toLocaleString()}
//   onChangeText={setAcAmount}
// />
// <View
//   style={{
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   }}>
//   {AC_AMOUNT_LIST.map((item, index) => (
//     <ModalSelectButton
//       onPress={() => {
//         setAcAmount(Number(acAmount) + item.amount);
//       }}>
//       <ModalSelectButtonText>{item.label}</ModalSelectButtonText>
//     </ModalSelectButton>
//   ))}
// </View>
// <View
//   style={{
//     flexDirection: 'row',
//     width: '98%',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     alignSelf: 'center',
//     marginBottom: 50,
//   }}>
//   <ModalButton
//     style={{
//       backgroundColor: '#fff',
//       borderWidth: 1,
//       borderColor: '#E8EAED',
//       marginRight: 8,
//     }}>
//     <ModalButtonText
//       style={{
//         color: '#717274',
//       }}>
//       이전으로
//     </ModalButtonText>
//   </ModalButton>
//   <DropShadow
//     style={{
//       shadowColor: 'rgba(0,0,0,0.25)',
//       shadowOffset: {
//         width: 0,
//         height: 4,
//       },
//       shadowOpacity: 1,
//       shadowRadius: 4,
//       width: '100%',
//     }}>
//     <ModalButton>
//       <ModalButtonText>다음으로</ModalButtonText>
//     </ModalButton>
//   </DropShadow>
// </View>
// </ModalInputSection>
