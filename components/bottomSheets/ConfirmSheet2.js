// 양도세 정보 확인하기 시트

import {View, useWindowDimensions, Pressable} from 'react-native';
import React, {useRef} from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import DropShadow from 'react-native-drop-shadow';
import dayjs from 'dayjs';
import {useDispatch, useSelector} from 'react-redux';
import {setChatDataList} from '../../redux/chatDataListSlice';
import axios from 'axios';
import {setHouseInfo} from '../../redux/houseInfoSlice';
import {HOUSE_TYPE} from '../../constants/colors';

const SheetContainer = styled.View`
  flex: 1;
  background-color: #fff;
  width: ${props => props.width - 40}px;
  height: auto;
`;

const ModalTitle = styled.Text`
  font-size: ${getFontSize(14)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 26px;
  text-align: center;
`;

const SubTitle = styled.Text`
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #97989a;
  line-height: 20px;
  text-align: center;
  margin-top: 10px;
`;

const HoustInfoSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: #e8eaed;
  margin-top: 20px;
`;

const HoustInfoTitle = styled.Text`
  width: 100%;
  font-size: ${getFontSize(14)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-bottom: 7px;
  margin-top: 4px;
`;

const HoustInfoText = styled.Text`
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
`;

const HoustInfoBadge = styled.View`
  width: auto;
  margin-right: auto;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
`;

const HoustInfoBadgeText = styled.Text`
  font-size: ${getFontSize(10)}px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 12px;
  letter-spacing: -0.5px;
`;

const HoustInfoButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100px;
  height: 32px;
  border-radius: 16px;
  background-color: #fff;
  border-width: 1px;
  border-color: #e8eaed;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const HoustInfoButtonText = styled.Text`
  font-size: ${getFontSize(10)}px;
  font-family: Pretendard-Regular;
  color: #717274;
  line-height: 20px;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
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
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const InfoContentSection = styled.ScrollView.attrs(props => ({
  showsVerticalScrollIndicator: false,
}))`
  width: 100%;
  height: auto;
  background-color: #f7f8fa;
  padding: 10px 20px;
`;
const InfoContentItem = styled.View`
  width: 100%;
  height: 56px;
  background-color: #fff;
  border-radius: 6px;
  padding: 0 18px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: #e8eaed;
`;

const InfoContentLabel = styled.Text`
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #97989a;
  line-height: 20px;
  letter-spacing: -0.3px;
`;

const InfoContentText = styled.Text`
  font-size: ${getFontSize(14)}px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  margin-left: auto;
`;

const ConfirmSheet2 = props => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const {width, height} = useWindowDimensions();
  const ownHouseList = useSelector(state => state.ownHouseList.value);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const chatDataList = useSelector(state => state.chatDataList.value);

  {
    console.log(houseInfo);
  }

  const calculateTax = () => {
    const data = {
      houseId: houseInfo.houseId || '1',
      contractDate: dayjs(houseInfo.contractDate).format('YYYY-MM-DD'),
      sellDate: dayjs(houseInfo.saleDate).format('YYYY-MM-DD'),
      sellPrice: houseInfo.saleAmount || '100000000',
    };

    axios
      .post('http://13.125.194.154:8080/calculate/sellTax', data)
      .then(response => {
        // 성공적인 응답 처리
        const data2 = response.data.data;

        dispatch(setHouseInfo({...houseInfo, ...data2}));
      })
      .catch(error => {
        // 오류 처리
        console.error(error);
      });
  };

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
        height: 700,
        width: width - 40,
      }}>
      <SheetContainer width={width}>
        <ModalInputSection>
          <ModalTitle>수집된 정보를 모두 확인해주세요.</ModalTitle>
          <SubTitle>
            누락되거나 잘못 입력된 정보가 있다면{'\n'}양도소득세가 정확하지 않게
            계산될 수 있어요.
          </SubTitle>
        </ModalInputSection>
        <HoustInfoSection>
          <View
            style={{
              width: '60%',
            }}>
            <HoustInfoBadge
              style={{
                backgroundColor: HOUSE_TYPE.find(
                  el => el.id === houseInfo?.houseType,
                )?.color,
              }}>
              <HoustInfoBadgeText>
                {HOUSE_TYPE.find(el => el.id === houseInfo?.houseType)?.name}
              </HoustInfoBadgeText>
            </HoustInfoBadge>
            <HoustInfoTitle>{houseInfo?.houseName}</HoustInfoTitle>
            <HoustInfoText>{houseInfo?.houseDetailName}</HoustInfoText>
          </View>
          <HoustInfoButton
            onPress={() => {
              actionSheetRef.current?.hide();
              props.payload.navigation.navigate('HouseDetail', {
                item: ownHouseList.find(el => el.houseId === houseInfo.houseId),
              });
            }}>
            <HoustInfoButtonText>자세히 보기</HoustInfoButtonText>
          </HoustInfoButton>
        </HoustInfoSection>
        <InfoContentSection>
          <InfoContentItem>
            <InfoContentLabel>계약일자</InfoContentLabel>
            <InfoContentText>
              {dayjs(houseInfo?.contractDate).format('YYYY년 MM월 DD일')}
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel>양도일자</InfoContentLabel>
            <InfoContentText>
              {dayjs(houseInfo?.saleDate).format('YYYY년 MM월 DD일')}
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel>양도가액</InfoContentLabel>
            <InfoContentText>
              {Number(houseInfo?.saleAmount).toLocaleString()} 원
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel>실거주기간</InfoContentLabel>
            <InfoContentText>
              {Math.floor(houseInfo?.livePeriod / 12) > 0 &&
                `${Math.floor(houseInfo?.livePeriod / 12)}년`}{' '}
              {houseInfo?.livePeriod % 12 > 0 &&
                `${houseInfo?.livePeriod % 12}개월`}
              {houseInfo?.livePeriod === 0 && '0개월'}
            </InfoContentText>
          </InfoContentItem>
          <InfoContentItem>
            <InfoContentLabel>주택 보유 수</InfoContentLabel>
            <InfoContentText>{ownHouseList.length}채</InfoContentText>
          </InfoContentItem>
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
                calculateTax();

                actionSheetRef.current?.hide();
                const chat1 = {
                  id: 'getInfoConfirmOK',
                  type: 'my',
                  message: '확인 완료',
                };
                dispatch(setChatDataList([...chatDataList, chat1]));
              }}
              style={{
                width: width - 80,
                alignSelf: 'center',
                marginTop: 10,
                marginBottom: 20,
              }}>
              <ModalButtonText>확인하기</ModalButtonText>
            </ModalButton>
          </DropShadow>
        </InfoContentSection>
      </SheetContainer>
    </ActionSheet>
  );
};

export default ConfirmSheet2;
