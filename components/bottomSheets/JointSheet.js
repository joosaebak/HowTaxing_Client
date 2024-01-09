// 공동 소유자가 몇 명인가요? 질문에 대한 답변을 선택하는 bottom sheet

import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useRef, useState} from 'react';
import ActionSheet from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';

import DropShadow from 'react-native-drop-shadow';
import MinusIcon from '../../assets/icons/minus.svg';
import PlusIcon from '../../assets/icons/plus.svg';
import {useDispatch, useSelector} from 'react-redux';
import {setHouseInfo} from '../../redux/houseInfoSlice';
import {setChatDataList} from '../../redux/chatDataListSlice';
import {acquisitionTax} from '../../data/chatData';

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
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px;
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

const JointSheet = props => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const {width, height} = useWindowDimensions();
  const [personCount, setPersonCount] = useState(2);
  const houseInfo = useSelector(state => state.houseInfo.value);
  const chatDataList = useSelector(state => state.chatDataList.value);

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
        height: 280,
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
              onPress={() => {
                if (personCount > 2) {
                  setPersonCount(personCount - 1);
                }
              }}
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
              {personCount}명
            </Text>

            <TouchableOpacity
              onPress={() => {
                setPersonCount(personCount + 1);
              }}
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
              onPress={() => {
                dispatch(
                  setHouseInfo({...houseInfo, personCount: personCount}),
                );
                actionSheetRef.current?.hide();
                const chat = {
                  id: 'jointSystem',
                  type: 'system',
                  message: '공동 소유자가 몇 명인가요?',
                  questionId: 'apartment',
                  progress: 5,
                };
                const chat1 = {
                  id: 'joint',
                  type: 'my',
                  message: `${personCount}명`,
                  questionId: 'apartment',
                };
                const chat2 = acquisitionTax.find(el => el.id === 'moreHouse');
                dispatch(
                  setChatDataList([...chatDataList, chat, chat1, chat2]),
                );
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
