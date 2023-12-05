import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import styled from 'styled-components';
import {useNavigation} from '@react-navigation/native';
import Postcode from '@actbase/react-daum-postcode';
import BackIcon from '../../assets/icons/back_button.svg';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const SearchAddress = props => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '주소검색',
      headerShadowVisible: false,
      contentStyle: {},
      headerTitleStyle: {
        fontSize: 18,
        fontFamily: 'SpoqaHanSansNeo-Medium',
        color: '#222',
        letterSpacing: -0.3,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          hitSlop={{left: 15, right: 15, top: 15, bottom: 15}}>
          <BackIcon />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <Container>
      <Postcode
        style={{flex: 1}}
        jsOptions={{animation: true}}
        startInLoadingState={true}
        onSelected={data => {
          navigation.navigate(
            'SignUpName',
            {
              address: {
                postcode: data.zonecode,
                address: data.address,
              },
            },
            'SignUpName',
          );
        }}
      />
    </Container>
  );
};

export default SearchAddress;
