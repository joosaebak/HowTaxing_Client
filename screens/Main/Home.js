import {
  View,
  Text,
  useWindowDimensions,
  StatusBar,
  PixelRatio,
} from 'react-native';
import React, {useLayoutEffect, useEffect} from 'react';
import styled from 'styled-components';
import DropShadow from 'react-native-drop-shadow';
import {useNavigation} from '@react-navigation/native';
import HomeIcon from '../../assets/images/home_home.svg';
import SignTagIcon from '../../assets/images/home_signtag.svg';
import getFontSize from '../../utils/getFontSize';
import {registerSheet, SheetManager} from 'react-native-actions-sheet';
import MapViewListSheet from '../../components/bottomSheets/MapViewListSheet';
import AcquisitionSheet from '../../components/bottomSheets/AcquisitionSheet';
import CertSheet from '../../components/bottomSheets/CertSheet';
import MapViewListSheet2 from '../../components/bottomSheets/MapViewListSheet2';
import JointSheet from '../../components/bottomSheets/JointSheet';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const HelloSection = styled.View`
  flex: 0.5;
  padding: 25px;
  justify-content: flex-end;
  align-items: flex-start;
`;

const HelloText = styled.Text`
  font-size: ${getFontSize(20)}px;
  font-family: Pretendard-Bold;
  color: #222;
  letter-spacing: -0.5px;
  line-height: 30px;
`;

const MessageTitle = styled.Text`
  font-size: ${getFontSize(24)}px;
  font-family: Pretendard-Bold;
  color: #222;
  letter-spacing: -0.5px;
  line-height: 34px;
`;

const Card = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
}))`
  width: ${props => props.width - 40}px;
  height: auto;
  background-color: #fff;
  border-radius: 12px;
  margin: 10px;
  padding: 25px;
  justify-content: center;
  align-self: center;
`;

const Tag = styled.View`
  width: 57px;
  height: 22px;
  padding: 0 10px;
  background-color: #2f87ff;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
`;

const TagText = styled.Text`
  font-size: ${getFontSize(10)}px;
  font-family: Pretendard-Medium;
  color: #fff;
  line-height: 12px;
  letter-spacing: -0.5px;
`;

const CardTitle = styled.Text`
  font-size: ${getFontSize(15)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
  margin-bottom: 8px;
  margin-top: 10px;
`;

const HashTagGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
`;

const HashTagText = styled.Text`
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
  margin-right: 9px;
  margin-top: 5px;
`;

const IconView = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 25px;
  right: 25px;
  border: 1px solid #e8eaed;
`;

const ShadowContainer = styled(DropShadow)`
  shadow-color: #ececef;
  shadow-offset: 0px 8px;
  shadow-opacity: 1;
  shadow-radius: 10px;
`;

const Home = () => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();

  useLayoutEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#fff');
    StatusBar.setTranslucent(false);
  }, [navigation]);

  useEffect(() => {
    registerSheet('mapViewList', MapViewListSheet);
    registerSheet('mapViewList2', MapViewListSheet2);
    registerSheet('acquisition', AcquisitionSheet);
    registerSheet('cert', CertSheet);
    registerSheet('joint', JointSheet);
  }, []);

  const AC_HASHTAG_LIST = [
    '취득세 계산',
    '주택 매수',
    '조정 지역',
    '입주권',
    '분양권',
  ];

  const GAIN_HASHTAG_LIST = [
    '양도소득세 계산',
    '일시적 2주택',
    '다주택자',
    '조정지역',
    '장기보유특별공제',
  ];

  const goAcquisigion = () => {
    navigation.push('Acquisition');
  };

  const goGainsTax = () => {
    navigation.push('GainsTax');
  };

  return (
    <Container>
      <HelloSection>
        <HelloText>안녕하세요.</HelloText>
        <MessageTitle>어떤 세금을 계산하시겠어요?</MessageTitle>
      </HelloSection>
      <ShadowContainer>
        <Card width={width} onPress={goAcquisigion}>
          <Tag>
            <TagText>주택 매수</TagText>
          </Tag>
          <CardTitle>취득세 계산하기</CardTitle>
          <HashTagGroup
            style={{
              width: '70%',
            }}>
            {AC_HASHTAG_LIST.map((item, index) => (
              <HashTagText key={index}>#{item}</HashTagText>
            ))}
          </HashTagGroup>
          <IconView>
            <HomeIcon />
          </IconView>
        </Card>
      </ShadowContainer>
      <ShadowContainer>
        <Card width={width} onPress={goGainsTax}>
          <Tag>
            <TagText>주택 매도</TagText>
          </Tag>
          <CardTitle>양도소득세 계산하기</CardTitle>
          <HashTagGroup>
            {GAIN_HASHTAG_LIST.map((item, index) => (
              <HashTagText key={index}>#{item}</HashTagText>
            ))}
          </HashTagGroup>
          <IconView>
            <SignTagIcon />
          </IconView>
        </Card>
      </ShadowContainer>
    </Container>
  );
};

export default Home;
