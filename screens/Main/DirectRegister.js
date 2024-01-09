// 직접 등록 안내 페이지

import {TouchableOpacity, useWindowDimensions} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import KeyIcon from '../../assets/images/family_key.svg';
import DropShadow from 'react-native-drop-shadow';

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: #fff;
  padding: 25px;
`;

const IntroSection = styled.View`
  flex: 1;
`;

const IconView = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  border: 1px solid #e8eaed;
`;

const Title = styled.Text`
  font-size: 20px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 30px;
  margin-bottom: 8px;
  margin-top: 20px;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 25px;
  margin-top: 10px;
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
  margin-top: 20px;
  align-self: center;
  position: absolute;
  bottom: 50px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const DirectRegister = props => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();

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
      title: '직접 등록이란',
      headerTitleAlign: 'center',
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

  return (
    <Container>
      <IntroSection>
        <IconView>
          <KeyIcon />
        </IconView>
        <Title>
          일부 주택은 불러오지 못할 수도 있어요{'\n'}빠진 주택이 있으시다면 직접
          등록해주세요
        </Title>
        <SubTitle>
          오피스텔을 보유하신 경우, 정확한 세금 계산을 위해{'\n'}반드시 직접
          등록을 해주셔야 해요.
        </SubTitle>
      </IntroSection>
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
            navigation.push('RegisterDirectHouse', {
              prevChat: props.route.params?.prevChat,
              prevSheet: props.route.params?.prevSheet,
            });
          }}>
          <ButtonText>등록하기</ButtonText>
        </Button>
      </DropShadow>
    </Container>
  );
};

export default DirectRegister;
