// 취득세 결과애에서 CTA 섹션

import {Linking} from 'react-native';
import React from 'react';
import styled from 'styled-components';
import getFontSize from '../utils/getFontSize';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';

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

const CardTitle = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-bottom: 10px;
`;

const CardSubTitle = styled.Text`
  font-size: 14px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
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

const openKakaoLink = () => {
  Linking.openURL('http://pf.kakao.com/_bwWXG');
};

const CTACard = () => {
  return (
    <Card>
      <CardTitle
        style={{
          textAlign: 'center',
        }}>
        아래의 세금 계산 결과를 주택 전문 세무사에{'\n'}바로 상담해보세요!
      </CardTitle>
      <CardSubTitle
        style={{
          fontSize: getFontSize(14),
          textAlign: 'center',
          fontFamily: 'Pretendard-Regular',
          color: '#A3A5A8',
        }}>
        여러분의 세금 절감에 많은 도움이 될거에요.
      </CardSubTitle>
      <ProfileAvatar
        source={{
          uri: 'https://cdn.imweb.me/thumbnail/20230328/c3c5b950321c7.jpg',
        }}
      />
      <ProfileName>홍길동 세무사</ProfileName>
      <KakaoButton onPress={() => openKakaoLink()}>
        <SocialButtonIcon
          source={require('../assets/images/socialIcon/kakao_ico.png')}
        />
        <KakaoButtonText>카카오톡으로 상담하기</KakaoButtonText>
      </KakaoButton>
    </Card>
  );
};

export default CTACard;
