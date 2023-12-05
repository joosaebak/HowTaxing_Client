import {View, Text, FlatList, TouchableOpacity, Pressable} from 'react-native';
import React, {useState} from 'react';
import styled from 'styled-components';
import getFontSize from '../utils/getFontSize';
import dayjs from 'dayjs';
import ArrowIcon from '../assets/icons/previous_arrow_ico.svg';

const CalendarSection = styled.View`
  width: 100%;
  padding: 0 10px;
  border-bottom-width: 1px;
  border-bottom-color: #f2f3f5;
  padding-bottom: 20px;
`;

const CalendarWeekday = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-family: 'Pretendard-Medium';
  color: #97989a;
`;

const ModalSubtitle = styled.Text`
  font-size: ${getFontSize(16)}px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
  margin: 20px 0;
`;

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateItem, setSelectedDateItem] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const CalendarHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 32,
          paddingHorizontal: 10,
          marginTop: 30,
        }}>
        <CalendarWeekday>일</CalendarWeekday>
        <CalendarWeekday>월</CalendarWeekday>
        <CalendarWeekday>화</CalendarWeekday>
        <CalendarWeekday>수</CalendarWeekday>
        <CalendarWeekday>목</CalendarWeekday>
        <CalendarWeekday>금</CalendarWeekday>
        <CalendarWeekday>토</CalendarWeekday>
      </View>
    );
  };

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  // 주의 첫 번째 일요일 찾기
  const firstSunday = new Date(firstDayOfMonth);
  firstSunday.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  const lastSaturday = new Date(lastDayOfMonth);
  lastSaturday.setDate(
    lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()),
  );

  const renderDay = ({item}) => {
    const isToday = item.toDateString() === new Date().toDateString();
    const isPast = item < new Date();
    const isSunday = item.getDay() === 0;
    const isSaturday = item.getDay() === 6;
    const isSelected = item.toDateString() === selectedDateItem.toDateString();

    return (
      <Pressable
        onPress={() => {
          setSelectedDateItem(item);
        }}
        style={{
          flex: 1,
          backgroundColor: '#fff',
          height: 42,
        }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: isSelected ? '#1B1C1F' : '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={[
              {
                fontSize: 16,
                fontFamily: 'Pretendard-Regular',
                color: isSelected ? '#fff' : '#CFD1D5',
                textAlign: 'center',
              },
              !isPast
                ? {
                    color: isSelected
                      ? '#fff'
                      : isSaturday
                      ? '#4E63FF'
                      : isSunday
                      ? '#FF2C65'
                      : '#545463',
                  }
                : null,
            ]}>
            {item.getDate()}
          </Text>
        </View>
      </Pressable>
    );
  };
  const generateDatesInRange = () => {
    const dates = [];
    for (
      let date = new Date(firstSunday);
      date <= lastSaturday;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }
    return dates;
  };

  const data = generateDatesInRange();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <ModalSubtitle>
        {dayjs(selectedDate).format('YYYY년 MM월 DD일')}
      </ModalSubtitle>
      <View
        style={{
          width: '100%',
          borderTopWidth: 1,
          borderTopColor: '#E8EAED',
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            width: 200,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            }}
            onPress={() => {
              setSelectedDate(dayjs(selectedDate).subtract(-1, 'M').toDate());
            }}>
            <ArrowIcon />
          </TouchableOpacity>
          <ModalSubtitle>{dayjs(selectedDate).format('YYYY.MM')}</ModalSubtitle>
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            }}
            onPress={() => {
              setSelectedDate(dayjs(selectedDate).subtract(1, 'M').toDate());
            }}>
            <ArrowIcon
              style={{
                transform: [{rotate: '180deg'}],
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <CalendarHeader />
      <CalendarSection>
        <FlatList
          scrollEnabled={false}
          data={data}
          numColumns={7}
          keyExtractor={item => item.toISOString()}
          renderItem={renderDay}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
        />
      </CalendarSection>
    </View>
  );
};

export default Calendar;
