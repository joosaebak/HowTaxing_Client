import {View, Text, TouchableOpacity, useWindowDimensions} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import HomeIcon from '../../assets/images/home_home_lg.svg';
import FastImage from 'react-native-fast-image';
import DropShadow from 'react-native-drop-shadow';
import getFontSize from '../../utils/getFontSize';
import {registerSheet, SheetManager} from 'react-native-actions-sheet';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const IntroSection = styled.View`
  flex: 0.6;
  width: 100%;
  padding: 25px;
  justify-content: flex-end;
`;

const Tag = styled.View`
  width: 68px;
  height: 26px;
  background-color: #fff;
  border-radius: ${getFontSize(16)}px;
  align-items: center;
  justify-content: center;
  border: 1px solid #2f87ff;
`;

const TagText = styled.Text`
  font-size: ${getFontSize(13)}px;
  font-family: Pretendard-Medium;
  color: #2f87ff;
  line-height: 16px;
  letter-spacing: -0.5px;
`;

const Title = styled.Text`
  font-size: ${getFontSize(25)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  margin-bottom: 8px;
  margin-top: 20px;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.Text`
  font-size: ${getFontSize(13)}px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
  margin-top: 10px;
`;

const HashTagGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`;

const HashTag = styled.View`
  width: auto;
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border: 1px solid #e8eaed;
  padding: 0 10px;
`;

const HashTagText = styled.Text`
  font-size: ${getFontSize(10)}px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
`;

const IconView = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 25px;
  border: 1px solid #e8eaed;
`;

const ChatSection = styled.View`
  flex: 1;
`;

const ChatItem = styled.View`
  width: 100%;
  height: auto;
  padding: 25px;
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

const ButtonSection = styled.View`
  flex: 0.3;
  padding: 0 20px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
}))`
  width: 100%;
  height: 60px;
  border-radius: 30px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  align-self: center;
  overflow: visible;
`;

const ButtonText = styled.Text`
  font-size: ${getFontSize(18)}px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const ShadowContainer = styled(DropShadow)`
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 2px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
`;

const Acquisition = () => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();

  const AC_HASHTAG_LIST = ['취득세 계산', '조정 지역', '주택 매수'];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => {
            navigation.goBack();
          }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      title: '',
      headerShadowVisible: false,
      contentStyle: {
        borderTopWidth: 0,
      },
      headerTitleStyle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 17,
        color: '#333',
        letterSpacing: -0.8,
      },
    });
  }, []);

  return (
    <Container>
      <IconView>
        <HomeIcon />
      </IconView>
      <IntroSection>
        <Tag>
          <TagText>주택 매수</TagText>
        </Tag>
        <Title>취득세 계산하기</Title>

        <SubTitle>주택을 매수할 예정인데, 취득세가 얼마나 나올까요?</SubTitle>
        <HashTagGroup>
          {AC_HASHTAG_LIST.map((item, index) => (
            <HashTag key={index}>
              <HashTagText>#{item}</HashTagText>
            </HashTag>
          ))}
        </HashTagGroup>
      </IntroSection>
      <ChatSection>
        <ChatItem>
          <Avatar
            source={{
              uri: 'https://www.handmk.com/news/photo/202306/16714_40371_5250.jpg',
            }}
          />
          <ChatBubble>
            <ChatBubbleText>
              안녕하세요!{'\n'}지금부터 취득세를{'\n'}쉽고 정확하게 계산해드릴
              거에요.{'\n'}저만 믿고 끝까지 잘 따라와 주세요!
            </ChatBubbleText>
          </ChatBubble>
        </ChatItem>
      </ChatSection>
      <ButtonSection>
        <ShadowContainer>
          <Button
            width={width}
            onPress={() => {
              navigation.replace('AcquisitionChat');
            }}>
            <ButtonText>시작하기</ButtonText>
          </Button>
        </ShadowContainer>
      </ButtonSection>
    </Container>
  );
};

export default Acquisition;
