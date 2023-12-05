import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import FamilyIcon from '../../assets/images/family_users.svg';
import DropShadow from 'react-native-drop-shadow';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ChevronIcon from '../../assets/icons/select_box_arrow_ico.svg';

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: #f5f7fa;
`;

const IntroSection = styled.View`
  padding: 25px;
  height: 220px;
  width: 100%;
  background-color: #fff;
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

const InputSection = styled.View`
  flex: 1;
  background-color: #f7f8fa;
  padding: 20px;
`;

const Paper = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 20px;
  border: 1px solid #e8eaed;
`;

const Label = styled.Text`
  font-size: 13px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 16px;
  margin-bottom: 10px;
`;

const DescText = styled.Text`
  font-size: 10px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
  margin-bottom: 15px;
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

const InputContainer = styled.View`
  flex-direction: row;
  width: 100%;
  height: 45px;
  background-color: #f5f7fa;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const OwnedHouseDetail = () => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const relationInputRef = useRef(null);
  const [selectBoxOpen, setSelectBoxOpen] = useState(false);

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
      title: '가족 주택 등록하기',
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
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: 160,
        }}>
        <>
          <IntroSection>
            <IconView>
              <FamilyIcon />
            </IconView>
            <Title>
              가족이 소유한 주택도 불러올 수 있어요{'\n'}아래 정보들을 입력 후
              요청해주세요
            </Title>
            <SubTitle>
              요청받은 가족의 카카오톡으로 본인인증 메시지가 도착해요!
            </SubTitle>
          </IntroSection>

          <InputSection>
            <Paper>
              <Label>요청자명</Label>
              <DescText>
                가족에게 불러오기 요청을 하기 위해 고객님의 성명을 입력해주세요.
              </DescText>
              <InputContainer>
                <TextInput
                  ref={nameInputRef}
                  placeholder="성명을 입력해주세요"
                  style={{
                    width: '100%',
                    height: '100%',
                    fontFamily: 'Pretendard-Regular',
                    fontSize: 13,
                    color: '#1B1C1F',
                  }}
                  underlineColorAndroid={'transparent'}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="다음"
                  onSubmitEditing={() => {}}
                />
              </InputContainer>
            </Paper>
            <Paper>
              <Label>가족 휴대폰 번호</Label>
              <DescText>
                주택 보유현황을 가져올 가족의 휴대폰번호를 입력해주세요.
              </DescText>
              <InputContainer>
                <TextInput
                  ref={nameInputRef}
                  placeholder="휴대폰 번호를 입력해주세요"
                  style={{
                    width: '100%',
                    height: '100%',
                    fontFamily: 'Pretendard-Regular',
                    fontSize: 13,
                    color: '#1B1C1F',
                  }}
                  underlineColorAndroid={'transparent'}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="다음"
                  onSubmitEditing={() => {
                    nameInputRef.current.focus();
                  }}
                />
              </InputContainer>
            </Paper>
            <Paper>
              <Label>요청자와의 관계</Label>
              <DescText>
                주택 보유현황을 가져올 가족과의 관계를 선택해주세요.
              </DescText>
              <Pressable
                onPress={() => {
                  setSelectBoxOpen(!selectBoxOpen);
                }}>
                <InputContainer>
                  <Text
                    style={{
                      width: '70%',
                      fontFamily: 'Pretendard-Regular',
                      fontSize: 13,
                      color: '#1B1C1F',
                    }}>
                    배우자
                  </Text>
                  <ChevronIcon
                    style={{
                      transform: [{rotate: selectBoxOpen ? '180deg' : '0deg'}],
                    }}
                  />
                </InputContainer>
              </Pressable>
            </Paper>
          </InputSection>
        </>
      </KeyboardAwareScrollView>

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
            navigation.push('DoneResisterFamilyHouse');
          }}>
          <ButtonText>요청하기</ButtonText>
        </Button>
      </DropShadow>
    </Container>
  );
};

export default OwnedHouseDetail;
