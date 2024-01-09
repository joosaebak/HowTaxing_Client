// 취득세 보유 주택 목록 시트

import {
  View,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import AddCircleIcon from '../../assets/icons/add_circle.svg';
import FamilyIcon from '../../assets/images/family.svg';
import CheckIcon from '../../assets/icons/check.svg';
import {useDispatch, useSelector} from 'react-redux';
import {HOUSE_TYPE} from '../../constants/colors';
import {setChatDataList} from '../../redux/chatDataListSlice';

const SheetContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
})`
  flex: 1;
  background-color: #fff;
  width: ${props => props.width}px;
  height: auto;
`;

const TitleSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 10px 20px;
`;

const SubTitle = styled.Text`
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Medium;
  color: #97989a;
  line-height: 20px;
  margin-top: 10px;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: ${props => props.width - 40}px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => (props.active ? '#2F87FF' : '#E8EAED')};
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${props => (props.active ? '#2F87FF' : '#E8EAED')};
  align-self: center;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Bold;
  color: ${props => (props.active ? '#fff' : '#717274')};
  line-height: 20px;
`;

const Title = styled.Text`
  font-size: ${getFontSize(20)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 32px;
  margin-bottom: 7px;
  margin-top: 4px;
`;

const InfoMessage = styled.Text`
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #ff7401;
  line-height: 20px;
  margin-top: 10px;
`;

const HouseSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #f7f8fa;
`;

const Card = styled.View`
  width: 180px;
  height: 180px;
  border-radius: 10px;
  background-color: #fff;
  justify-content: space-between;
  margin-right: 22px;
  border-width: 1px;
  border-color: ${props => (props.active ? '#2F87FF' : '#fff')};
  padding: 15px;
`;

const Tag = styled.View`
  flex-direction: row;
  margin-right: auto;
  width: auto;
  height: 22px;
  background-color: #1fc9a8;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  padding: 0 10px;
  margin-bottom: 10px;
  align-self: flex-start;
`;

const TagText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 20px;
`;

const CardTitle = styled.Text.attrs({
  numberOfLines: 2,
})`
  width: 100%;
  font-size: 15px;
  color: #1b1c1f;
  font-family: Pretendard-Bold;
  word-break: keep-all;
  line-height: 20px;
`;

const CardSubTitle = styled.Text`
  font-size: 13px;
  color: #717274;
  font-family: Pretendard-Regular;
  line-height: 20px;
`;

const CardButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: 35px;
  border-radius: 17.5px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  border: 1px solid #e8eaed;
  margin-top: 10px;
`;

const CardButtonText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Medium;
  color: #717274;
  line-height: 20px;
  text-align: center;
`;

const AddButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  flex-direction: row;
  width: 140px;
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  border: 1px solid #e8eaed;
  align-self: center;
  margin: 0 5px 20px 5px;
`;

const AddButtonText = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Bold;
  color: #717274;
  line-height: 20px;
  text-align: center;
  margin-left: 4px;
`;

const CheckCircleButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
  hitSlop: {top: 20, bottom: 20, left: 20, right: 20},
}))`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid #e8eaed;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const OwnHouseSheet = props => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const {width, height} = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedList, setSelectedList] = useState([]);
  const ownHouseList = useSelector(state => state.ownHouseList.value);
  const chatDataList = useSelector(state => state.chatDataList.value);

  const CARD_WIDTH = 180 + 22;

  useEffect(() => {
    if (ownHouseList.length > 0) {
      setSelectedList(ownHouseList);
    }
  }, []);

  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      CustomHeaderComponent={
        <ModalHeader>
          <Pressable
            hitSlop={20}
            onPress={() => {
              actionSheetRef.current?.hide();
            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      gestureEnabled={false}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 760,
        width: width,
      }}>
      <SheetContainer width={width}>
        <TitleSection>
          <Title>
            보유하신 주택을 모두 불러왔어요.{'\n'}불러온 주택들을 확인해주세요.
          </Title>

          <InfoMessage>
            주택 매도와 매수를 동시에 거래하신다면,{'\n'}매도 예정되어 있는
            주택은 반드시 체크 해제해주세요.
          </InfoMessage>
        </TitleSection>
        <HouseSection>
          <ScrollView
            onScroll={e => {
              const contentOffset = e.nativeEvent.contentOffset;
              const pageNum = Math.floor((contentOffset.x / CARD_WIDTH) * 2);
              setCurrentIndex(pageNum);
            }}
            horizontal
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 30,
              paddingHorizontal: 20,
              marginTop: 20,
            }}>
            {ownHouseList.map((item, index) => (
              <DropShadow
                key={'own' + index}
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                }}>
                <Card active={selectedList.indexOf(item) > -1}>
                  <CheckCircleButton
                    onPress={() => {
                      if (selectedList.indexOf(item) > -1) {
                        setSelectedList(
                          selectedList.filter(
                            selectedItem => selectedItem !== item,
                          ),
                        );
                      } else {
                        setSelectedList([...selectedList, item]);
                      }
                    }}>
                    {selectedList.indexOf(item) > -1 && <CheckIcon />}
                  </CheckCircleButton>
                  <Tag
                    style={{
                      backgroundColor: HOUSE_TYPE.find(
                        color => color.id === item.houseType,
                      ).color,
                    }}>
                    <TagText>
                      {
                        HOUSE_TYPE.find(color => color.id === item.houseType)
                          .name
                      }
                    </TagText>
                  </Tag>
                  <CardTitle>{item.houseName}</CardTitle>
                  <CardSubTitle>{item.houseDetailName}</CardSubTitle>
                  <CardButton
                    onPress={() => {
                      actionSheetRef.current?.hide();
                      props.payload.navigation.push(
                        'OwnedHouseDetail',
                        {item: item, prevSheet: 'own'},
                        'OwnedHouseDetail',
                      );
                    }}>
                    <CardButtonText>자세히 보기</CardButtonText>
                  </CardButton>
                </Card>
              </DropShadow>
            ))}
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: 20,
              zIndex: 2,
            }}>
            {ownHouseList.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setCurrentIndex(index - 1);
                }}
                activeOpacity={0.6}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    currentIndex === index ? '#E8EAED' : 'transparent',
                  borderWidth: 1,
                  borderColor: '#E8EAED',
                  marginRight: 10,
                }}
              />
            ))}
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <AddButton
              width={width}
              onPress={() => {
                actionSheetRef.current?.hide();

                props.payload.navigation.push('DirectRegister', {
                  prevChat: 'AcquisitionChat',
                  prevSheet: 'own',
                });
              }}>
              <AddCircleIcon />
              <AddButtonText>직접 등록하기</AddButtonText>
            </AddButton>
            <AddButton
              width={width}
              onPress={() => {
                actionSheetRef.current?.hide();
                props.payload.navigation.push('FamilyHouse'),
                  {
                    prevChat: 'AcquisitionChat',
                    prevSheet: 'own',
                  };
              }}>
              <FamilyIcon />
              <AddButtonText>가족주택 등록하기</AddButtonText>
            </AddButton>
          </View>
          <SubTitle
            style={{
              color: '#2F87FF',
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}>
            이미 오피스텔을 소유하고 계실 경우, 반드시 직접 등록해주세요.{'\n'}
            불러오지 못한 주택이 있을 경우, 정확한 세금계산이 어려워요.
          </SubTitle>
        </HouseSection>

        <DropShadow
          style={{
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.15,
            shadowRadius: 10,
          }}>
          <Button
            disabled={selectedList.length === 0}
            width={width}
            active={selectedList.length > 0}
            onPress={() => {
              actionSheetRef.current?.hide();

              const chat2 = {
                id: 'palnSale',
                type: 'system',
                progress: 6,
                message:
                  '종전주택 매도 계획에 따라취득세가 다르게 산출될 수 있어요.\n종전주택 매도 계획이 있나요?',
                select: [
                  {
                    id: 'planSaleYes',
                    name: '3년 이내 매도 계획',
                    select: ['getInfoDone', 'getInfoConfirm'],
                  },
                  {
                    id: 'planSaleNo',
                    name: '매도 계획 없음',
                    select: ['getInfoDone', 'getInfoConfirm'],
                  },
                ],
              };

              dispatch(setChatDataList([...chatDataList, chat2]));
            }}>
            <ButtonText active={selectedList.length > 0}>확인하기</ButtonText>
          </Button>
        </DropShadow>
      </SheetContainer>
    </ActionSheet>
  );
};

export default OwnHouseSheet;
