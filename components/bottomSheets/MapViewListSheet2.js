import {
  View,
  Text,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import styled from 'styled-components';
import getFontSize from '../../utils/getFontSize';
import CloseIcon from '../../assets/icons/close_button.svg';
import SerchIcon from '../../assets/icons/search_map.svg';

import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
  Callout,
} from 'react-native-nmap';
import DropShadow from 'react-native-drop-shadow';
import {Picker, DatePicker} from 'react-native-wheel-pick';

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

const ModalAddressInputContainer = styled.View`
  width: 100%;
  height: 57px;
  background-color: #f5f7fa;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-top: 10px;
`;

const ModalAddressInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: '#A3A5A8',
  placeholder: '주택명 혹은 지역명을 입력해주세요',
}))`
  flex: 1;
  font-size: ${getFontSize(13)}px;
  font-family: Pretendard-Regular;
  color: #1b1c1f;
  line-height: 20px;
`;

const ModalInputButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.6,
  hitSlop: {top: 20, bottom: 20, left: 20, right: 20},
}))`
  align-items: center;
  justify-content: center;
`;

const ModalLabel = styled.Text`
  font-size: 15px;
  font-family: Pretendard-SemiBold;
  color: #000;
  line-height: 18px;
  margin-right: 6px;
`;

const ModalInputSection = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  background-color: #fff;
`;

const ModalHeader = styled.View`
  width: 100%;
  height: 36px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
`;

const MapMarkerShadow = styled(DropShadow)`
  shadow-color: #2f87ff;
  shadow-offset: {
    width: 0;
    height: 6;
  }
  shadow-opacity: 0.6;
  shadow-radius: 4;
`;

const MapSearchResultHeader = styled.View`
  width: 100%;
  height: 46px;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  border-bottom-width: 1px;
  border-bottom-color: #e8eaed;
  background-color: #fff;
`;

const MapSearchResultHeaderTitle = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 24px;
  margin-left: 10px;
  letter-spacing: -0.3px;
`;

const MapSearchResultItem = styled.View`
  width: 100%;
  height: auto;
  min-height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #e8eaed;
`;

const MapSearchResultItemTitle = styled.Text`
  font-size: ${getFontSize(13)}px;
  font-family: Pretendard-Bold;
  color: #1b1c1f;
  line-height: 20px;
`;

const MapSearchResultItemAddress = styled.Text`
  width: 90%;
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Regular;
  color: #a3a5a8;
  line-height: 16px;
  margin-left: 4px;
`;

const AddressNumberBadge = styled.View`
  width: 37px;
  height: 22px;
  border-radius: 11px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #e8eaed;
`;

const AddressNumberText = styled.Text`
  font-size: ${getFontSize(10)}px;
  font-family: Pretendard-Medium;
  color: #a3a5a8;
  line-height: 16px;
`;

const MepSearchResultButton = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.9,
}))`
  width: 65px;
  height: 36px;
  border-radius: 18px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
`;

const MapSearchResultButtonText = styled.Text`
  font-size: ${getFontSize(13)}px;
  font-family: Pretendard-Medium;
  color: #2f87ff;
  line-height: 16px;
`;

const ApartmentInfoGroup = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const ApartmentInfoTitle = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
`;

const SelectGroup = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 10px;
`;

const SelectLabel = styled.Text`
  font-size: ${getFontSize(12)}px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
`;

const PickerContainer = styled.View`
  width: 100%;
  height: 187px;
  background-color: #f5f7fa;
  border-radius: 10px;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
`;

const ButtonSection = styled.View`
  width: 100%;
  height: auto;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
`;

const ButtonShadow = styled(DropShadow)`
  width: 48%;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 10;
  }
  shadow-opacity: 0.25;
  shadow-radius: 4px;
`;

const Button = styled.TouchableOpacity.attrs(props => ({
  activeOpacity: 0.8,
}))`
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #2f87ff;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #2f87ff;
`;

const ButtonText = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Bold;
  color: #fff;
  line-height: 20px;
`;

const MapViewListSheet2 = () => {
  const actionSheetRef = useRef(null);
  const scrollViewRef = useRef(null);
  const {width, height} = useWindowDimensions();
  const [hideHeader, setHideHeader] = useState(false);
  const P0 = {latitude: 37.564362, longitude: 126.977011};
  const P1 = {latitude: 37.565051, longitude: 126.978567};
  const P2 = {latitude: 37.565383, longitude: 126.976292};
  const scrollHandlers = useScrollHandlers('FlatList-1', actionSheetRef);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  return (
    <ActionSheet
      ref={actionSheetRef}
      headerAlwaysVisible
      CustomHeaderComponent={
        <ModalHeader>
          <Pressable
            onPress={() => {
              actionSheetRef.current?.hide();
            }}>
            <CloseIcon width={16} height={16} />
          </Pressable>
        </ModalHeader>
      }
      overlayColor="#111"
      defaultOverlayOpacity={0.7}
      gestureEnabled={true}
      statusBarTranslucent
      containerStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height,
        width: width - 40,
      }}>
      {currentPageIndex === 0 && (
        <SheetContainer width={width}>
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            ref={scrollViewRef}
            style={{
              zIndex: 1,
            }}
            id="FlatList-1"
            {...scrollHandlers}
            scrollEnabled
            //   onScroll={e => {
            //     if (e.nativeEvent.contentOffset.y > 0) {
            //       setHideHeader(true);
            //     } else {
            //       setHideHeader(false);
            //     }
            //   }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            //   stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <>
                {!hideHeader && (
                  <ModalInputSection>
                    <ModalTitle>취득하실 주택을 선택해주세요.</ModalTitle>

                    <ModalAddressInputContainer>
                      <ModalAddressInput placeholder="'주택명 혹은 지역명을 입력해주세요'" />
                      <ModalInputButton>
                        <SerchIcon />
                      </ModalInputButton>
                    </ModalAddressInputContainer>

                    <NaverMapView
                      style={{flex: 1, width: width - 40, height: 350}}
                      showsMyLocationButton={true}
                      center={{...P0, zoom: 16}}
                      isHideCollidedSymbols
                      isForceShowIcon
                      isHideCollidedCaptions
                      // onTouch={e =>
                      //   console.warn('onTouch', JSON.stringify(e.nativeEvent))
                      // }
                      // onCameraChange={e =>
                      //   console.warn('onCameraChange', JSON.stringify(e))
                      // }
                      // onMapClick={e =>
                      //   console.warn('onMapClick', JSON.stringify(e))
                      // }
                    >
                      <Marker
                        coordinate={P0}
                        width={100}
                        height={80}
                        onCalloutPress={() => console.log('Callout pressed!')}>
                        <View>
                          <MapMarkerShadow>
                            <View
                              style={{
                                width: 'auto',
                                height: 45,
                                backgroundColor: '#2F87FF',
                                paddingHorizontal: 10,
                                margin: 10,
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'Pretendard-Bold',
                                  fontSize: getFontSize(10),
                                  color: '#fff',
                                }}>
                                동하라 일락
                              </Text>
                              <Text
                                style={{
                                  fontFamily: 'Pretendard-Bold',
                                  fontSize: getFontSize(8),
                                  color: '#fff',
                                }}>
                                110세대
                              </Text>
                              <View
                                style={{
                                  position: 'absolute',
                                  left: 0, // 삼각형 꼬리의 위치를 조절
                                  bottom: -10,
                                  width: 0,
                                  height: 0,
                                  borderTopWidth: 10,
                                  borderTopColor: 'transparent',
                                  borderLeftWidth: 10,
                                  borderLeftColor: '#2F87FF', // 내 메시지와 상대방 메시지의 배경색에 따라 설정
                                  borderBottomWidth: 10,
                                  borderBottomColor: 'transparent',
                                }}
                              />
                            </View>
                          </MapMarkerShadow>
                        </View>
                      </Marker>

                      <Marker
                        coordinate={P1}
                        width={100}
                        height={80}
                        onClick={() => console.warn('onClick! p1')}>
                        <View>
                          <MapMarkerShadow>
                            <View
                              style={{
                                width: 'auto',
                                height: 45,
                                backgroundColor: '#2F87FF',
                                paddingHorizontal: 10,
                                margin: 10,
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'Pretendard-Bold',
                                  fontSize: getFontSize(10),
                                  color: '#fff',
                                }}>
                                동하라 일락
                              </Text>
                              <Text
                                style={{
                                  fontFamily: 'Pretendard-Bold',
                                  fontSize: getFontSize(8),
                                  color: '#fff',
                                }}>
                                110세대
                              </Text>
                              <View
                                style={{
                                  position: 'absolute',
                                  left: 0, // 삼각형 꼬리의 위치를 조절
                                  bottom: -10,
                                  width: 0,
                                  height: 0,
                                  borderTopWidth: 10,
                                  borderTopColor: 'transparent',
                                  borderLeftWidth: 10,
                                  borderLeftColor: '#2F87FF', // 내 메시지와 상대방 메시지의 배경색에 따라 설정
                                  borderBottomWidth: 10,
                                  borderBottomColor: 'transparent',
                                }}
                              />
                            </View>
                          </MapMarkerShadow>
                        </View>
                      </Marker>
                      <Marker
                        coordinate={P2}
                        width={100}
                        height={80}
                        onClick={() => console.warn('onClick! p2')}>
                        <View>
                          <MapMarkerShadow>
                            <View
                              style={{
                                width: 'auto',
                                height: 45,
                                backgroundColor: '#2F87FF',
                                paddingHorizontal: 10,
                                margin: 10,
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'Pretendard-Bold',
                                  fontSize: getFontSize(10),
                                  color: '#fff',
                                }}>
                                동하라 일락
                              </Text>
                              <Text
                                style={{
                                  fontFamily: 'Pretendard-Bold',
                                  fontSize: getFontSize(8),
                                  color: '#fff',
                                }}>
                                110세대
                              </Text>
                              <View
                                style={{
                                  position: 'absolute',
                                  left: 0,
                                  bottom: -10,
                                  width: 0,
                                  height: 0,
                                  borderTopWidth: 10,
                                  borderTopColor: 'transparent',
                                  borderLeftWidth: 10,
                                  borderLeftColor: '#2F87FF',
                                  borderBottomWidth: 10,
                                  borderBottomColor: 'transparent',
                                }}
                              />
                            </View>
                          </MapMarkerShadow>
                        </View>
                      </Marker>
                    </NaverMapView>
                  </ModalInputSection>
                )}
                <MapSearchResultHeader>
                  <MapSearchResultHeaderTitle>
                    검색 결과
                  </MapSearchResultHeaderTitle>
                </MapSearchResultHeader>
              </>
            }
            renderItem={({item, index}) => (
              <MapSearchResultItem>
                <View
                  style={{
                    width: '72%',
                  }}>
                  <MapSearchResultItemTitle>
                    경기도 안양시 동안구 경수대로884번길 12 (신우희가로베스트
                    아파트)
                  </MapSearchResultItemTitle>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 6,
                    }}>
                    <AddressNumberBadge>
                      <AddressNumberText>지번</AddressNumberText>
                    </AddressNumberBadge>
                    <MapSearchResultItemAddress>
                      서울특별시 강남구 도곡동 123-456 도곡동 123-456
                    </MapSearchResultItemAddress>
                  </View>
                </View>
                <MepSearchResultButton
                  onPress={() => {
                    console.log('선택');
                    setCurrentPageIndex(1);
                  }}>
                  <MapSearchResultButtonText>선택</MapSearchResultButtonText>
                </MepSearchResultButton>
              </MapSearchResultItem>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </SheetContainer>
      )}

      {currentPageIndex === 1 && (
        <SheetContainer>
          <ModalTitle>취득하실 주택 동과 호를 선택해주세요</ModalTitle>

          <ApartmentInfoGroup>
            <ApartmentInfoTitle>
              평촌 래미안 푸르지오{'\n'}104동 1602호
            </ApartmentInfoTitle>
          </ApartmentInfoGroup>
          <SelectGroup>
            <View style={{width: '48%'}}>
              <SelectLabel>동 선택</SelectLabel>
              <PickerContainer>
                <Picker
                  textSize={getFontSize(18)}
                  selectTextColor="#1B1C1F"
                  isShowSelectBackground={false}
                  isShowSelectLine={false}
                  style={{
                    backgroundColor: '#F5F7FA',
                    width: 120,
                    height: 160,
                    borderRadius: 10,
                  }}
                  selectedValue="104"
                  pickerData={['101', '102', '103', '104', '105', '106', '107']}
                  onValueChange={value => {
                    console.log(value);
                  }}
                />
              </PickerContainer>
            </View>
            <View style={{width: '48%'}}>
              <SelectLabel>호 선택</SelectLabel>
              <PickerContainer>
                <Picker
                  textSize={getFontSize(18)}
                  selectTextColor="#1B1C1F"
                  isShowSelectBackground={false}
                  isShowSelectLine={false}
                  style={{
                    backgroundColor: '#F5F7FA',
                    width: 120,
                    height: 160,
                    borderRadius: 10,
                  }}
                  selectedValue="1602"
                  pickerData={[
                    '1600',
                    '1601',
                    '1602',
                    '1603',
                    '1604',
                    '1605',
                    '1606',
                  ]}
                  onValueChange={value => {
                    console.log(value);
                  }}
                />
              </PickerContainer>
            </View>
          </SelectGroup>
          <ButtonSection>
            <ButtonShadow
              style={{
                shadowColor: '#fff',
              }}>
              <Button
                onPress={() => {
                  setCurrentPageIndex(0);
                }}
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#E8EAED',
                }}>
                <ButtonText
                  style={{
                    color: '#717274',
                  }}>
                  이전으로
                </ButtonText>
              </Button>
            </ButtonShadow>
            <ButtonShadow>
              <Button
                onPress={() => {
                  actionSheetRef.current?.hide();
                }}>
                <ButtonText>다음으로</ButtonText>
              </Button>
            </ButtonShadow>
          </ButtonSection>
        </SheetContainer>
      )}
    </ActionSheet>
  );
};

export default MapViewListSheet2;
