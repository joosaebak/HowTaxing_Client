import {
  View,
  Text,
  StatusBar,
  useWindowDimensions,
  Image,
  Platform,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import styled from 'styled-components';
import {useNavigation} from '@react-navigation/native';
import Logo from '../../assets/images/logo.svg';
import LogoTitle from '../../assets/images/logo_title.svg';
import LoginIntro from '../../assets/images/login_intro.svg';
import getFontSize from '../../utils/getFontSize';
import {
  login,
  logout,
  getProfile,
  shippingAddresses,
  unlink,
} from '@react-native-seoul/kakao-login';
import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import {useDispatch} from 'react-redux';
import {setCurrentUser} from '../../redux/currentUserSlice';

GoogleSignin.configure();

const Container = styled.ImageBackground.attrs(props => ({
  source: require('../../assets/images/loginBG.png'),
  resizeMode: 'cover',
}))`
  flex: 1;
  background-color: #fff;
`;

const IntroSection = styled.View`
  flex: 1;
  width: 100%;
  padding: 25px;
  justify-content: flex-end;
`;

const SocialButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
}))`
  width: ${props => props.width - 40}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 60px;
  border-radius: 30px;
  padding: 10px;
  margin: 5px;
  margin-top: 8px;
`;

const SocialButtonText = styled.Text`
  font-size: ${getFontSize(15)}px;
  font-family: Pretendard-Regular;
  line-height: 20px;
  letter-spacing: -0.3px;
`;

const SocialButtonIcon = styled.Image.attrs(props => ({
  resizeMode: 'contain',
}))`
  width: 22px;
  height: 20px;
  margin-right: 16px;
`;

const ButtonSection = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 50px;
`;

const LogoGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Overlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(27, 28, 31, 0.73);
`;

const Login = () => {
  const {width, height} = useWindowDimensions();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  const onGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
    } catch (error) {
      console.log('error', error);
    }
    dispatch(
      setCurrentUser({
        name: '김하우',
        email: '',
      }),
    );
  };

  const onKakaoLogin = async () => {
    const {idToken} = await login();

    if (idToken) {
      console.log('idToken', idToken);

      const profile = await getProfile();

      console.log('profile.id', profile);
    }
    dispatch(
      setCurrentUser({
        name: '김하우',
        email: '',
      }),
    );
  };

  const onNaverLogin = async () => {
    await NaverLogin.login({
      appName: '하우택싱',
      consumerKey: 'orG8AAE8iHfRSoiySAbv',
      consumerSecret: 'DEn_pJGqup',
      serviceUrlScheme: 'howtaxing',
    }).then(async res => {
      console.log('res', res);
      try {
        const profileRes = await NaverLogin.getProfile(
          res?.successResponse.accessToken,
        );
        const user = profileRes.response;
        console.log(JSON.stringify(profileRes.response));
      } catch (err) {
        console.log(err);
      }
    });
    dispatch(
      setCurrentUser({
        name: '김하우',
        email: '',
      }),
    );
  };

  const onAppleLogin = async () => {
    // if (appleAuthAndroid.isSupported) {
    //   const appleAuthRequestResponse = await appleAuth.performRequest({
    //     requestedOperation: appleAuth.Operation.LOGIN,
    //     // Note: it appears putting FULL_NAME first is important, see issue #293
    //     requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    //   });
    //   // Ensure Apple returned a user identityToken
    //   if (!appleAuthRequestResponse.identityToken) {
    //     throw 'Apple Sign-In failed - no identify token returned';
    //   }
    //   // get current authentication state for user
    //   // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    //   const credentialState = await appleAuth.getCredentialStateForUser(
    //     appleAuthRequestResponse.user,
    //   );
    //   // Create a Firebase credential from the response
    //   const {identityToken, nonce} = appleAuthRequestResponse;

    //   // use credentialState response to ensure the user is authenticated
    //   if (credentialState === appleAuth.State.AUTHORIZED) {
    //     // user is authenticated
    //     console.log('user is authenticated', credentialState);
    //   }
    // } else {
    //   console.log('ios only');
    // }
    dispatch(
      setCurrentUser({
        name: '김하우',
        email: '',
      }),
    );
  };

  return (
    <Container>
      <Overlay />
      <ButtonSection>
        <IntroSection>
          <LogoGroup>
            <Logo />
            <LogoTitle />
          </LogoGroup>
          <LoginIntro
            style={{
              alignSelf: 'flex-end',
              marginTop: 20,
            }}
          />
        </IntroSection>
        <SocialButton
          onPress={onKakaoLogin}
          width={width}
          style={{
            backgroundColor: '#FBE54D',
          }}>
          <SocialButtonIcon
            source={require('../../assets/images/socialIcon/kakao_ico.png')}
          />
          <SocialButtonText
            style={{
              color: '#3B1F1E',
            }}>
            카카오톡으로 로그인
          </SocialButtonText>
        </SocialButton>
        <SocialButton
          onPress={onNaverLogin}
          width={width}
          style={{
            backgroundColor: '#3BAC37',
          }}>
          <SocialButtonIcon
            source={require('../../assets/images/socialIcon/naver_ico.png')}
          />
          <SocialButtonText
            style={{
              color: '#fff',
            }}>
            네이버로 로그인
          </SocialButtonText>
        </SocialButton>
        <SocialButton
          onPress={onGoogleLogin}
          width={width}
          style={{
            backgroundColor: '#fff',
          }}>
          <SocialButtonIcon
            source={require('../../assets/images/socialIcon/google_ico_color.png')}
          />
          <SocialButtonText
            style={{
              color: '#3B1F1E',
            }}>
            구글로 로그인
          </SocialButtonText>
        </SocialButton>
        <SocialButton
          onPress={onAppleLogin}
          width={width}
          style={{
            backgroundColor: '#161617',
          }}>
          <SocialButtonIcon
            style={{
              width: 16,
              height: 20,
            }}
            source={require('../../assets/images/socialIcon/apple_ico.png')}
          />
          <SocialButtonText
            style={{
              color: '#fff',
            }}>
            애플로 로그인
          </SocialButtonText>
        </SocialButton>
      </ButtonSection>
    </Container>
  );
};

export default Login;
