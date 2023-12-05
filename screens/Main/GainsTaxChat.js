import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import CloseIcon from '../../assets/icons/close_button.svg';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import {Modalize} from 'react-native-modalize';
import DropShadow from 'react-native-drop-shadow';
import {numToKorean} from 'num-to-korean';
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
  width: 75%;
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
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 30px;
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
  font-size: 15px;
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
  font-size: 15px;
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

const Card = styled(Animatable.View).attrs(props => ({
  animation: 'fadeInUp',
}))`
  width: 100%;
  height: auto;
  padding: 20px 25px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #e8eaed;
`;

const ProfileAvatar = styled(FastImage).attrs(props => ({
  resizeMode: 'cover',
}))`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  background-color: '#F0F3F8';
  align-self: center;
  margin: 15px 0;
`;

const ProfileName = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
`;

const ProfileEmail = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
  margin-top: 5px;
  text-align: center;
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

const KakaoButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Regular;
  color: #3b1f1e;
  line-height: 20px;
`;

const SocialButtonIcon = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 22px;
  height: 20px;
  margin-right: 16px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: ${props => props.width - 40}px;
  height: 60px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  align-self: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 17px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  text-align: center;
`;

const ModalSubtitle = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
  margin: 20px 0;
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
  padding: 0 25px;
  margin-top: 10px;
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
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #fff;
  line-height: 20px;
`;

const GainsTaxChat = () => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const modalizeRef = useRef(null);
  const flatlistRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [acAmount, setAcAmount] = useState(0);
  const [koranNum, setKoranNum] = useState('');
  const [chatDataList, setChatDataList] = useState([
    {
      id: 1,
      user: 'system',
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
      id: 8,
      user: 'system',
      type: 'card',
      message:
        '임대사업자에 해당되시면\n전문 세무사에게 상담을 문의해보세요.\n어떤 복잡한 상황에도 최선의 결과를 알려주실 거에요.',
      data: {
        message: '계산 결과를 전문 세무사에게 바로 상담해보세요.',
        profileImage: 'https://picsum.photos/200/300',
        name: '김세무사',
        email: 'joosebak@joosaebak.co.kr',
        kakaoLink: 'https://open.kakao.com/o/sd8sdf8sdf',
      },
    },
  ]);

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
      title: '양도소득세 계산하기',
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
    if (currentIndex !== 0) {
      setChatDataList([...chatDataList, dummyData[currentIndex - 1]]);
    }
  }, [currentIndex]);

  useEffect(() => {
    modalizeRef.current?.open();
  }, []);

  const AC_AMOUNT_LIST = [
    {
      id: '5b',
      label: '5억',
      amount: 500000000,
    },
    {
      id: '1b',
      label: '1억',
      amount: 100000000,
    },
    {
      id: '1t',
      label: '1천만',
      amount: 10000000,
    },
    {
      id: '1m',
      label: '1백만',
      amount: 1000000,
    },
  ];
  const dummyData = [
    {
      id: 1,
      user: 'system',
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
      id: 6,
      user: 'system',
      message:
        '분양권 상태에서 최초 취득하신 아파트는 세금 계산 방식이 달라요.\n혹시 아파트를 분양권 상태에서 취득하실 예정인가요?',
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
      user: 'system',
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
      user: 'my',
      message: '주택',
    },
    {
      id: 4,
      user: 'system',
      message:
        '임대사업자에 해당되시면 전문 세무사에게 상담을 문의해보세요.\n어떤 복잡한 상황에도 최선의 결과를 알려주실 거에요.',
    },
    {
      id: 5,
      user: 'system',
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
      id: 7,
      user: 'system',
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

  const openKakaoLink = url => {
    Linking.openURL(url);
  };

  useEffect(() => {
    setKoranNum(numToKorean(acAmount));
  }, [acAmount]);

  return (
    <Container>
      <ProgressSection>
        <ProgreeBar />
      </ProgressSection>
      <FlatList
        ref={flatlistRef}
        data={chatDataList}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 50,
        }}
        renderItem={({item, index}) =>
          item?.type === 'my' ? (
            <MyChatItem>
              <MyChatBubble>
                <MyChatBubbleText>{item?.message}</MyChatBubbleText>
                <EditButton>
                  <PencilIcon />
                </EditButton>
              </MyChatBubble>
            </MyChatItem>
          ) : (
            <ChatItem animation="fadeInUp">
              <Avatar source={{uri: 'https://picsum.photos/200/300'}} />
              <ChatBubble>
                <ChatBubbleText>{item?.message}</ChatBubbleText>
                {item?.select && (
                  <SelectButtonGroup>
                    {item?.select.map((item, index) => (
                      <SelectButton
                        key={index}
                        onPress={() => {
                          const chat = {
                            id: chatDataList.length + 1,
                            user: 'my',
                            message: item.name,
                          };
                          setChatDataList([...chatDataList, chat]);
                          setCurrentIndex(chatDataList.length + 1);
                          setTimeout(() => {
                            flatlistRef.current.scrollToEnd({animated: true});
                          }, 500);
                        }}>
                        {item?.icon ? item.icon : null}
                        <SelectButtonText>{item?.name}</SelectButtonText>
                      </SelectButton>
                    ))}
                  </SelectButtonGroup>
                )}
              </ChatBubble>
              {item.data && (
                <>
                  <Card>
                    <ChatBubbleText
                      style={{
                        textAlign: 'center',
                      }}>
                      {item.data?.message}
                    </ChatBubbleText>
                    <ProfileAvatar source={{uri: item.data?.profileImage}} />
                    <ProfileName>{item.data?.name}</ProfileName>
                    <ProfileEmail>{item.data?.email}</ProfileEmail>
                    <KakaoButton
                      onPress={() => openKakaoLink(item?.data?.kakaoLink)}>
                      <SocialButtonIcon
                        source={require('../../assets/images/socialIcon/kakao_ico.png')}
                      />
                      <KakaoButtonText>카카오톡으로 상담하기</KakaoButtonText>
                    </KakaoButton>
                  </Card>
                  <DropShadow
                    style={{
                      shadowColor: 'rgba(0,0,0,0.25)',
                      shadowOffset: {
                        width: 0,
                        height: 4,
                      },
                      shadowOpacity: 1,
                      shadowRadius: 4,
                    }}>
                    <Button
                      width={width}
                      onPress={() => {
                        navigation.goBack();
                      }}>
                      <ButtonText>돌아가기</ButtonText>
                    </Button>
                  </DropShadow>
                </>
              )}
            </ChatItem>
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
            marginTop: 20,
            marginRight: 20,
          }}>
          <CloseIcon />
        </TouchableOpacity>
        <ModalInputSection>
          <ModalTitle>취득가액을 입력해주세요.</ModalTitle>
          <ModalSubtitle>{koranNum}</ModalSubtitle>
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
            {AC_AMOUNT_LIST.map((item, index) => (
              <ModalSelectButton
                onPress={() => {
                  setAcAmount(Number(acAmount) + item.amount);
                }}>
                <ModalSelectButtonText>{item.label}</ModalSelectButtonText>
              </ModalSelectButton>
            ))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '98%',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
              alignSelf: 'center',
              marginBottom: 50,
            }}>
            <ModalButton
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#E8EAED',
                marginRight: 8,
              }}>
              <ModalButtonText
                style={{
                  color: '#717274',
                }}>
                이전으로
              </ModalButtonText>
            </ModalButton>
            <DropShadow
              style={{
                shadowColor: 'rgba(0,0,0,0.25)',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 1,
                shadowRadius: 4,
                width: '100%',
              }}>
              <ModalButton>
                <ModalButtonText>다음으로</ModalButtonText>
              </ModalButton>
            </DropShadow>
          </View>
        </ModalInputSection>
      </Modalize>
    </Container>
  );
};

export default GainsTaxChat;
