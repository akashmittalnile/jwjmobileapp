/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect} from 'react';
import {Calendar} from 'react-native-calendars';
import CalendarCustomHeader from '../Header/CalendarCustomHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import moment from 'moment';
import {GetApiWithToken, endPoint} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import {moodColorHandler} from '../../utils/Method';

interface MoodCalendarProps {
  containerStyle?: ViewStyle;
  dateHandler?: (date: string) => void;
  value?: string;
}

let counter: any = null;

const MoodCalendar: React.FC<MoodCalendarProps> = ({
  containerStyle,
  dateHandler,
  value,
}) => {
  const navigation = useNavigation();
  const token = useAppSelector(state => state.auth.token);
  const [date, setDate] = React.useState<string>(moment().format('YYYY-MM-DD'));
  const [data, setData] = React.useState<any>({});
  const [disableArrowRight, setDisableArrowRight] =
    React.useState<boolean>(false);
  const reload = useAppSelector(state => state.reload.MoodCalendar);
  const [currentMonth, setCurrentMonth] = React.useState<number>(
    parseInt(moment().format('YYYY-MM-DD').split('-')[1]),
  );
  const [currentYear, setCurrentYear] = React.useState<string>(
    moment().format('YYYY-MM-DD').split('-')[0],
  );
  const [showModal, setShowModal] = React.useState<boolean>(false);

  useEffect(() => {
    value && setDate(value);
    getMoodData(currentMonth, currentYear);

    return () => {
      counter = null;
    };
  }, [currentMonth, reload]);

  const getMoodData = async (month: number, year: string) => {
    const tempObj: any = {};
    try {
      const response = await GetApiWithToken(
        `${endPoint.moodCalender}?month=${month}&year=${year}`,
        token,
      );
      if (response?.data?.status) {
        response?.data?.data?.forEach(
          (item: any) =>
            (tempObj[
              `${currentYear}-${
                currentMonth < 10 ? `0${currentMonth}` : currentMonth
              }-${item?.date < 10 ? `0${item?.date}` : item?.date}`
            ] = item?.mood_name?.toLowerCase()),
        );
        setData(tempObj);
      }
    } catch (err: any) {
      console.log('err in moodData calendar', err.message);
    }
  };

  const _dateHandler = (date: any, bool: boolean) => {
    if (dateHandler) {
      setDate(date);
      dateHandler(date);
      navigation.navigate(ScreenNames.Calendar, {date});
    }
    // if (bool) {
    //   navigation.navigate(ScreenNames.Calendar, {date: data?.date?.dateString});
    // }
  };

  // const colorHandler = (value: string) => {
  //   if (value == 'happy') {
  //     return '#FFD800';
  //   } else if (value == 'sad') {
  //     return '#6CB4EE';
  //   } else if (value == 'anger') {
  //     return 'red';
  //   }
  //   return 'gray';
  // };

  const showModalHandler = () => {
    counter = setTimeout(() => {
      counter = null;
      setShowModal(true);
    }, 300);
  };

  const disableModal = (a: any, b: any) => {
    if (!counter) {
      setShowModal(false);
      return;
    } else {
      clearTimeout(counter);
      _dateHandler(a, b);
    }
  };

  const DateComponent = ({_data}: {_data: any}) => {
    const disable =
      _data?.date.month > currentMonth ||
      _data?.date.month < currentMonth ||
      (_data?.date.year >= new Date().getFullYear() &&
        _data?.date.month >= new Date().getMonth() + 1 &&
        _data?.date.day > new Date().getDate());
    return (
      <TouchableOpacity
        disabled={disable}
        onPressIn={showModalHandler}
        onPressOut={() => {
          disableModal(
            _data?.date?.dateString,
            data[_data?.date?.dateString] ? true : false,
          );
        }}
        style={[
          styles.date,
          {
            // borderColor:
            // value === data?.date?.dateString
            //   ? globalStyles.themeBlue
            //   : 'transparent',
            borderColor: 'transparent',
            borderWidth:
              value === _data?.date?.dateString ? responsiveWidth(0.3) : 0,
            overflow: value === _data?.date?.dateString ? 'hidden' : 'visible',
          },
          {opacity: disable ? 0.2 : 1},
        ]}
        // onPress={() => {
        //   _dateHandler(
        //     _data?.date?.dateString,
        //     data[_data?.date?.dateString] ? true : false,
        //   );
        // }}
      >
        {disable && (
          <Text
            style={[
              styles.text,
              {
                color:
                  value === _data?.date?.dateString
                    ? globalStyles.themeBlue
                    : 'black',
              },
            ]}>
            {_data?.date?.day}
          </Text>
        )}
        {!disable && (
          <View style={styles.moodDateModal}>
            <LinearGradient
              style={{height: '100%', justifyContent: 'flex-end'}}
              colors={[
                'white',
                data[_data?.date?.dateString]
                  ? moodColorHandler(
                      data[_data?.date?.dateString]?.toLowerCase(),
                    )
                  : 'white',
              ]}
              start={{x: 0.0, y: 0.0}}
              end={{x: 0, y: 10}}>
              <View
                style={{
                  height: '90%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: 'black',
                    },
                  ]}>
                  {_data?.date?.day}
                </Text>
              </View>
              <View
                style={{
                  ...styles.moodDateModalBottom,
                  backgroundColor: data[_data?.date?.dateString]
                    ? moodColorHandler(
                        data[_data?.date?.dateString]?.toLowerCase(),
                      )
                    : 'transparent',
                }}
              />
            </LinearGradient>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const monthHandler = async (date: any) => {
    disableArrowRight && setDisableArrowRight(false);
    if (date?.year >= new Date().getFullYear()) {
      if (date?.month >= new Date().getMonth() + 1) {
        setDisableArrowRight(true);
      }
    }

    setCurrentMonth(() => date?.month);
    setCurrentYear(date?.year);
    // await getMoodData(date?.month, date?.year);
  };

  return (
    <>
      <Calendar
        date={date ? date : value}
        maxDate={`${new Date().toUTCString()}`}
        dayComponent={data => <DateComponent _data={data} />}
        renderHeader={(date: any) => <CalendarCustomHeader date={date} />}
        disableArrowRight={disableArrowRight}
        style={[styles.calendar, containerStyle]}
        onMonthChange={monthHandler}
      />
      {/* <Modal animationType="slide" transparent={true} visible={showModal}>
        <TouchableOpacity
          onPress={() => {
            setShowModal(false);
          }}
          style={styles.modalContainer}></TouchableOpacity>
      </Modal> */}
    </>
  );
};

export default MoodCalendar;

const styles = StyleSheet.create({
  calendar: {
    width: responsiveWidth(67),
  },
  date: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(3.5),
    width: responsiveHeight(3),
    borderRadius: responsiveHeight(0.8),
  },
  text: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
  },
  moodDateModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    borderRadius: responsiveHeight(0.8),
  },
  moodDateModalBottom: {
    height: '10%',
    width: '100%',
    opacity: 0.4,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
