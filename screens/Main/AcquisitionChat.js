// 취득세 대화 페이지

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import {Modalize} from 'react-native-modalize';
import DropShadow from 'react-native-drop-shadow';
import getFontSize from '../../utils/getFontSize';
import {acquisitionTax} from '../../data/chatData';
import {HOUSE_TYPE} from '../../constants/colors';
import {SheetManager} from 'react-native-actions-sheet';

// Icons
import PencilIcon from '../../assets/icons/pencil.svg';
import CloseIcon from '../../assets/icons/close_button.svg';
import QuestionIcon from '../../assets/icons/question.svg';
import CTACard from '../../components/CTACard';
import TaxCard from '../../components/TaxCard';
import TaxInfoCard from '../../components/TaxInfoCard';
import HouseInfo from '../../components/HouseInfo';
import EditIcon from '../../assets/icons/edit.svg';

// Redux
import {useDispatch, useSelector} from 'react-redux';
import {setChatDataList} from '../../redux/chatDataListSlice';
import {setHouseInfo} from '../../redux/houseInfoSlice';

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

const ProgressBar = styled(Animated.View)`
  width: 33.3%;
  height: 5px;
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
  padding: 15px 20px;
`;

const MyChatBubbleText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #fff;
  line-height: 24px;
  text-align: center;
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

const HouseInfoCard = styled.View`
  width: ${props => props.width - 40}px;
  height: auto;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  align-self: center;
  border-radius: 10px;
`;

const HouseInfoCardTitle = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-bottom: 10px;
  margin-top: 20px;
  text-align: center;
`;

const HouseInfoCardSubTitle = styled.Text`
  font-size: ${getFontSize(13)}px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  margin-top: 15px;
  margin-bottom: 6px;
  text-align: center;
`;

const HouseInfoCardListItem = styled.View`
  width: 100%;
  height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 10px;
  border-width: 1px;
  border-color: #e8eaed;
  align-self: center;
  margin-top: 10px;
`;

const HouseInfoListLabel = styled.Text`
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 20px;
  margin-right: 5px;
`;

const HouseInfoListValue = styled.Text`
  font-size: ${getFontSize(15)}px;
  font-family: Pretendard-Bold;
  color: #2f87ff;
  line-height: 20px;
  text-align: right;
`;

const AcquisitionChat = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {width, height} = useWindowDimensions();
  const modalizeRef = useRef(null);
  const flatlistRef = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;
  const chatDataList = useSelector(state => state.chatDataList.value);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const [isEditing, setIsEditing] = useState(false);

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
    const helloChatItem = acquisitionTax.find(el => el.id === 'type');
    dispatch(setChatDataList([helloChatItem]));
  }, []);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        setIsEditing(false);
      }, 200);
      return;
    }

    if (chatDataList?.length > 0) {
      if (chatDataList[chatDataList.length - 1]?.type === 'system') {
        const progressValue = chatDataList[chatDataList.length - 1]?.progress;
        Animated.timing(progress, {
          toValue: progressValue,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    }
    if (chatDataList[chatDataList.length - 1]?.id !== 'cta') {
      setTimeout(() => {
        flatlistRef.current.scrollToEnd({
          animated: true,
          duration: 600,
        });
      }, 500);
    }
  }, [chatDataList]);

  // 나의 챗 버블 렌더링
  const renderMyChatItem = ({item, index}) => {
    return (
      <>
        <MyChatItem>
          <MyChatBubble>
            <MyChatBubbleText>
              {item?.message === '확인하기' ||
              item?.message === '보유 주택 확인하기'
                ? '확인 완료'
                : item?.message}
            </MyChatBubbleText>
            {item?.id !== 'confirmDone' && (
              <EditButton
                onPress={() => {
                  setIsEditing(true);
                  const newChatDataList = chatDataList.slice(0, index);
                  dispatch(setChatDataList(newChatDataList));
                }}>
                <PencilIcon />
              </EditButton>
            )}
          </MyChatBubble>
        </MyChatItem>
        {item?.id === 'getInfoConfirmOK' && (
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
              disabled={index < chatDataList.length - 1}
              onPress={async () => {
                const chat1 = {
                  id: 'calculating',
                  type: 'system',
                  progress: 10,
                  message:
                    '계산하는 중이에요.\n서비스를 종료하지 마시고, 조금만 기다려주세요.',
                };
                dispatch(setChatDataList([chat1]));
                setTimeout(() => {
                  const chatItem = {
                    id: 'cta',
                    type: 'system',
                    progress: 10,
                  };
                  dispatch(setChatDataList([chatItem]));
                  flatlistRef.current?.scrollToOffset({
                    offset: 0,
                  });
                }, 3000);
              }}
              style={{
                width: width - 40,
                alignSelf: 'center',
                marginTop: 20,
                marginBottom: 40,
              }}>
              <ModalButtonText>계산하기</ModalButtonText>
            </ModalButton>
          </DropShadow>
        )}
        {item?.id === 'ownConfirmOK' && (
          <View
            style={{
              width: width - 40,
              height: 'auto',
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 20,
              borderWidth: 1,
              borderColor: '#2F87FF',
              borderRadius: 10,
              alignSelf: 'center',
              marginBottom: 20,
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                }}>
                <View
                  style={{
                    width: 'auto',
                    height: 22,
                    backgroundColor: HOUSE_TYPE.find(
                      el => el.id === houseInfo?.houseType,
                    )?.color,
                    borderRadius: 11,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                    paddingHorizontal: 15,
                  }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'Pretendard-Medium',
                      color: '#fff',
                      lineHeight: 13,
                      letterSpacing: -0.5,
                    }}>
                    {
                      HOUSE_TYPE.find(el => el.id === houseInfo?.houseType)
                        ?.name
                    }
                  </Text>
                </View>
                <View
                  style={{
                    width: 'auto',
                    height: 22,
                    backgroundColor: '#2F87FF',
                    borderRadius: 11,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                    paddingHorizontal: 15,
                  }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'Pretendard-Medium',
                      color: '#fff',
                      lineHeight: 13,
                      letterSpacing: -0.5,
                    }}>
                    매도예정
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: getFontSize(15),
                  fontFamily: 'Pretendard-Bold',
                  color: '#1B1C1F',
                  lineHeight: 20,
                  letterSpacing: -0.5,
                  marginTop: 10,
                }}>
                {houseInfo?.houseName}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Pretendard-Regular',
                  marginTop: 4,
                }}>
                {houseInfo?.houseDetailName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.push(
                  'OwnHouseDetail',
                  {
                    item: houseInfo,
                  },
                  'OwnHouseDetail',
                );
              }}
              activeOpacity={0.8}
              style={{
                width: 100,
                height: 32,
                borderRadius: 20,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#E8EAED',
              }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Pretendard-Regular',
                  color: '#717274',
                  lineHeight: 20,
                  letterSpacing: -0.5,
                }}>
                자세히 보기
              </Text>
              <View
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: '#F0F3F8',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bottom: -6,
                  right: -6,
                }}>
                <EditIcon />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  // 시스템 챗 버블 렌더링
  const renderSystemChatItem = ({item, index}) => {
    if (item?.id === 'goodbye') {
      setTimeout(() => {
        SheetManager.show('review', {
          payload: {
            questionId: 'goodbye',
            navigation: navigation,
          },
        });
      }, 1000);
    }

    // CTA
    if (item?.id === 'cta') {
      return (
        <View
          style={{
            padding: 20,
          }}>
          <CTACard />
          <HouseInfo item={houseInfo} navigation={navigation} />
          <TaxCard />
          <TaxInfoCard />
          <DropShadow
            style={{
              shadowColor: '#2F87FF',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              alignSelf: 'center',
            }}>
            <ModalButton
              disabled={index < chatDataList.length - 1}
              onPress={() => {
                const googByeItem = acquisitionTax.find(
                  el => el.id === 'goodbye',
                );
                dispatch(setChatDataList([googByeItem]));
              }}
              style={{
                width: width - 40,
                alignSelf: 'center',
                marginTop: 20,
              }}>
              <ModalButtonText>확인하기</ModalButtonText>
            </ModalButton>
          </DropShadow>
        </View>
      );
    } else {
      return (
        <>
          <ChatItem
            animation="fadeInUp"
            isLast={chatDataList.length - 1 === index}>
            <Avatar
              source={{
                uri: 'https://dnvefa72aowie.cloudfront.net/business-profile/bizPlatform/profile/40388181/1674021254765/MWJlMWNjOGNiMDMzMzE0ZTUwM2ZiZTllZjJkOTZiMGViYTgzNDQxNTE0YWY4ZDU0ZWI3MWQ1N2MzMWU5ZTdmYS5qcGc=.jpeg?q=95&s=1440x1440&t=inside',
              }}
            />
            <ChatBubble>
              <ChatBubbleText>{item?.message}</ChatBubbleText>
              {item?.id === 'confirm' && (
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
                    disabled={index < chatDataList.length - 1}
                    onPress={() => {
                      SheetManager.show('acquisition', {
                        payload: {
                          questionId: item?.id,
                        },
                      });
                    }}
                    style={{
                      width: width - 80,
                      alignSelf: 'center',
                      marginTop: 20,
                    }}>
                    <ModalButtonText>확인하기</ModalButtonText>
                  </ModalButton>
                </DropShadow>
              )}
              {item?.select && (
                <SelectButtonGroup>
                  {item?.select.map((item2, index2) => (
                    <SelectButton
                      disabled={index < chatDataList.length - 1}
                      key={index2}
                      onPress={async () => {
                        const myChatItem = {
                          id: item?.id + item2.id,
                          type: 'my',
                          message: item2.name,
                        };

                        const chatList = [];
                        if (item2?.select) {
                          await item2?.select.forEach((item3, index3) => {
                            acquisitionTax.find(el => {
                              if (el.id === item3) {
                                chatList.push(el);
                              }
                            });
                          });
                        }

                        if (
                          item.id === 'contractDateSystem' ||
                          item.id === 'acquisitionDateSystem' ||
                          item.id === 'aquiAmountSystem'
                        ) {
                          console.log('contractDateSystem');
                        } else {
                          dispatch(
                            setChatDataList([
                              ...chatDataList,
                              myChatItem,
                              ...chatList,
                            ]),
                          );
                        }

                        if (item.id === 'cert' && item2.id === 'no') {
                          const moreHouseIndex = chatDataList.findIndex(
                            el => el.id === 'moreHouse',
                          );
                          const newChatDataList = chatDataList.slice(
                            0,
                            moreHouseIndex + 1,
                          );

                          dispatch(setChatDataList(newChatDataList));
                        }

                        if (item.id === 'type') {
                          console.log('type', item2.name);
                          dispatch(
                            setHouseInfo({
                              ...houseInfo,
                              houseType:
                                item2.name === '아파트'
                                  ? '1'
                                  : item2.name === '단독주택 · 다가구'
                                  ? '4'
                                  : item2.name === '연립 · 다세대'
                                  ? '2'
                                  : '5',
                            }),
                          );
                        }

                        if (item2?.openSheet) {
                          console.log('openSheet');
                          SheetManager.show(item2.openSheet, {
                            payload: {
                              navigation: navigation,
                              data: item2.id,
                              currentPageIndex: item2?.currentPageIndex,
                            },
                          });
                        }

                        // 매도 계획 여부
                        if (item2.id === 'planSaleYes') {
                          dispatch(
                            setHouseInfo({
                              ...houseInfo,
                              planSale: true,
                            }),
                          );
                        } else if (item2.id === 'planSaleNo') {
                          dispatch(
                            setHouseInfo({
                              ...houseInfo,
                              planSale: false,
                            }),
                          );
                        }
                      }}>
                      {item2?.icon ? item2.icon : null}
                      <SelectButtonText>{item2?.name}</SelectButtonText>
                    </SelectButton>
                  ))}
                </SelectButtonGroup>
              )}
              {item?.id === 'getInfoConfirm' && (
                <SelectButton
                  disabled={index < chatDataList.length - 1}
                  onPress={() => {
                    SheetManager.show('confirm', {
                      payload: {
                        questionId: item?.id,
                        navigation: navigation,
                      },
                    });
                  }}
                  style={{
                    marginTop: 20,
                  }}>
                  <SelectButtonText>확인하기</SelectButtonText>
                </SelectButton>
              )}
            </ChatBubble>
          </ChatItem>
          {item?.id === 'calculating' && (
            <View
              style={{
                height: height - 320,

                alignItems: 'center',
              }}>
              <ActivityIndicator
                size={80}
                color="#A2C62B"
                animating
                style={{
                  marginTop: '30%',
                }}
              />
            </View>
          )}

          {item?.id === 'apartmentAddressInfoSystem' && (
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
              <HouseInfoCard width={width}>
                <HouseInfoCardTitle>주택 정보</HouseInfoCardTitle>
                <HouseInfoCardSubTitle>
                  {houseInfo?.houseName} {houseInfo?.houseDetailName}
                </HouseInfoCardSubTitle>
                <HouseInfoCardListItem>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <HouseInfoListLabel>KB시세</HouseInfoListLabel>
                    <QuestionIcon />
                  </View>
                  <HouseInfoListValue>
                    {Number(houseInfo?.kbMktPrice).toLocaleString()}원
                  </HouseInfoListValue>
                </HouseInfoCardListItem>
                <HouseInfoCardListItem>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <HouseInfoListLabel>공시지가</HouseInfoListLabel>
                    <QuestionIcon />
                  </View>
                  <HouseInfoListValue>
                    {Number(houseInfo?.pubLandPrice).toLocaleString()}원
                  </HouseInfoListValue>
                </HouseInfoCardListItem>
                <HouseInfoCardListItem>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <HouseInfoListLabel>전용면적</HouseInfoListLabel>
                    <QuestionIcon />
                  </View>
                  <HouseInfoListValue>
                    {houseInfo?.areaMeter}㎡ ({houseInfo?.areaPyung}평)
                  </HouseInfoListValue>
                </HouseInfoCardListItem>
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
                    disabled={index < chatDataList.length - 1}
                    onPress={() => {
                      SheetManager.show('acquisition', {
                        payload: {
                          questionId: item?.id,
                          navigation,
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
              </HouseInfoCard>
            </DropShadow>
          )}
        </>
      );
    }
  };

  return (
    <Container>
      <ProgressSection>
        <ProgressBar
          style={{
            backgroundColor:
              chatDataList[chatDataList.length - 1]?.id === 'cta' ||
              chatDataList[chatDataList.length - 1]?.id === 'calculating' ||
              chatDataList[chatDataList.length - 1]?.id === 'goodbye'
                ? '#A2C62B'
                : '#2F87FF',
            width: progress.interpolate({
              inputRange: [0, 10],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
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
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) =>
          item?.type === 'my'
            ? renderMyChatItem({item, index})
            : renderSystemChatItem({item, index})
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
