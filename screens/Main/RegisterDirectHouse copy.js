import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_button.svg';
import styled from 'styled-components';
import DropShadow from 'react-native-drop-shadow';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Icons
import BuildingIcon1 from '../../assets/icons/house/building_type1_ico.svg';
import BuildingIcon2 from '../../assets/icons/house/building_type2_ico.svg';
import HouseIcon from '../../assets/icons/house/house.svg';
import VillaIcon from '../../assets/icons/house/villa.svg';
import SearchIcon from '../../assets/icons/search_ico.svg';
import KeyIcon from '../../assets/images/family_key.svg';

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

const SelectButton = styled.Pressable`
  width: 140px;
  height: 70px;
  border-radius: 10px;
  background-color: #fff;
  border: ${props =>
    props.active ? '1px solid #2f87ff' : '1px solid #e8eaed'};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const SelectButtonText = styled.Text`
  font-size: 15px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 16px;
  margin-top: 8px;
`;

const RegisterDirectHouse = () => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const addressInputRef = useRef(null);
  const addressDetailInputRef = useRef(null);
  const [selectBoxOpen, setSelectBoxOpen] = useState(false);
  const [selectedHouseType, setSelectedHouseType] = useState(null);

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
      title: '직접 등록하기',
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

  const HOUSE_TYPE = [
    {
      id: 'apartment',
      name: '아파트',
      icon: <BuildingIcon1 />,
    },
    {
      id: 'house',
      name: '단독주택 · 다가구',
      icon: <HouseIcon />,
    },
    {
      id: 'villa',
      name: '연립 · 다세대',
      icon: <VillaIcon />,
    },
    {
      id: 'ticket',
      name: '입주권',
      icon: <BuildingIcon2 />,
    },
  ];

  return (
    <Container>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: 160,
        }}>
        <>
          <IntroSection>
            <IconView>
              <KeyIcon />
            </IconView>
            <Title>
              일부 주택은 불러오지 못할 수도 있어요{'\n'}빠진 주택이 있으시다면
              직접 등록해주세요
            </Title>
            <SubTitle>
              요청받은 가족의 휴대폰에 주세박이 설치되어있지 않다면{'\n'}
              카카오톡으로 설치 안내 메시지가 동시에 전달됩니다
            </SubTitle>
          </IntroSection>

          <InputSection>
            <Paper>
              <Label>주택 형태</Label>
              <DescText>
                등록하실 주택이 아파트인지, 그 외 주택 형태인지 선택해주세요.
              </DescText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {HOUSE_TYPE.map((item, index) => (
                  <SelectButton
                    key={item.id}
                    active={selectedHouseType === item.id}
                    onPress={() => {
                      setSelectedHouseType(item.id);
                    }}>
                    {item.icon}
                    <SelectButtonText>{item.name}</SelectButtonText>
                  </SelectButton>
                ))}
              </ScrollView>
            </Paper>
            <Paper>
              <Label>주소 정보</Label>
              <DescText>
                등록하려는 주택의 주소를 검색하여 선택해주세요.
              </DescText>
              <InputContainer>
                <TextInput
                  ref={addressInputRef}
                  placeholder="주소를 검색해주세요"
                  style={{
                    width: '90%',
                    height: '100%',
                    fontFamily: 'Pretendard-Regular',
                    fontSize: 13,
                    color: '#1B1C1F',
                  }}
                  underlineColorAndroid={'transparent'}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    addressDetailInputRef.current.focus();
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  hitSlop={{
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20,
                  }}
                  onPress={() => {
                    navigation.push('SearchAddress');
                  }}>
                  <SearchIcon />
                </TouchableOpacity>
              </InputContainer>
              <InputContainer
                style={{
                  marginTop: 10,
                }}>
                <TextInput
                  ref={addressDetailInputRef}
                  placeholder="상세주소"
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
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    addressInputRef.current.focus();
                  }}
                />
              </InputContainer>
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

export default RegisterDirectHouse;
