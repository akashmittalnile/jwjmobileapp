import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../Button/BorderBtn';
import {Calendar} from 'react-native-calendars';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {daysSorting} from '../../utils/Method';

interface RepeatOptionsPorps {
  routineStartDate?: string;
  routineEndDate?: string;
  onClick: (data: {
    text: string;
    value: string | string[];
    schedule_startdate?: string;
    schedule_enddate?: string;
  }) => void;
  disableModal: () => void;
  initialValue: string | string[] | undefined;
  onStartDateHandler?: (data: any) => {};
  onEndDateHandler?: (data: any) => {};
}

const days = ['M', 'T', 'W', 'TH', 'F', 'SA', 'S'];

const RepeatOptions: React.FC<RepeatOptionsPorps> = ({
  onClick,
  disableModal,
  initialValue,
  onStartDateHandler,
  onEndDateHandler,
  routineStartDate,
  routineEndDate,
}) => {
  const [showCalendar, setShowCalendar] = React.useState<boolean>(false);
  const [showStartDateCalendar, setShowStartDateCalendar] =
    React.useState<boolean>(false);
  const [showEndDateCalendar, setShowendDateCalendar] =
    React.useState<boolean>(false);
  const [customDay, setCustomDay] = React.useState<string[]>([]);
  const [date, setDate] = React.useState<
    {name: string; value: string} | undefined
  >();
  const [startDate, setStartDate] = React.useState<
    {name: string; value: string} | undefined
  >(undefined);
  const [endDate, setEndDate] = React.useState<
    {name: string; value: string} | undefined
  >(undefined);
  const [showHorizontalCalendar, setShowHorizontalCalendar] =
    React.useState<boolean>(false);
  const [err, setErr] = React.useState<{
    startDate: boolean;
    endDate: boolean;
    customDay: boolean;
  }>({
    startDate: false,
    endDate: false,
    customDay: false,
  });

  React.useEffect(() => {
    if (Array.isArray(initialValue)) {
      const result = daysSorting(days, initialValue);
      console.log('nile', result);
      Array.isArray(result) && result?.length > 0 && setCustomDay(result);
      if (routineEndDate && routineStartDate) {
        setStartDate({name: routineStartDate, value: routineStartDate});
        setEndDate({name: routineEndDate, value: routineEndDate});
      }
    } else if (initialValue?.includes('-')) {
      setDate({name: initialValue, value: initialValue});
    }
  }, []);

  const onceHandler = (value: {text: string; value: string}) => {
    if (onClick) {
      onClick(value);
    }
  };

  const dateHandler = () => {
    setShowCalendar(true);
    0;
  };

  const customHandler = () => {
    setShowHorizontalCalendar(true);
  };

  const calendarCancelHandler = () => {
    setShowCalendar(false);
    setShowStartDateCalendar(false);
    setShowendDateCalendar(false);
  };

  const customDateHandler = () => {
    if (date) {
      onClick({text: date?.value, value: date?.value});
      setShowCalendar(false);
      disableModal();
    } else {
      Toast.show({
        type: 'info',
        text1: 'Select Date',
      });
    }
  };

  const startDateHandler = () => {
    setErr(preData => ({...preData, endDate: false}));
    if (startDate) {
      if (onStartDateHandler) {
        onStartDateHandler({text: startDate?.value, value: startDate?.value});
      }
      setShowStartDateCalendar(false);
    } else {
      Toast.show({
        type: 'info',
        text1: 'Select Date',
      });
    }
  };

  const endDateHandler = () => {
    setErr(preData => ({...preData, endDate: false}));
    if (endDate) {
      if (onEndDateHandler) {
        onEndDateHandler({text: endDate?.value, value: endDate?.value});
      }
      setShowendDateCalendar(false);
    } else {
      Toast.show({
        type: 'info',
        text1: 'Select Date',
      });
    }
  };

  const dayHandler = (item: string) => {
    setErr(preData => ({...preData, customDay: false}));
    if (customDay.includes(item)) {
      const temp = customDay.filter((value: string) => value != item);
      const result = daysSorting(days, temp);
      Array.isArray(result) && setCustomDay(result);
      return;
    }
    const result = daysSorting(days, [...customDay, item]);
    Array.isArray(result) && setCustomDay(result);
  };

  const HorizontalCalendar = days.map(item => (
    <View
      key={item}
      style={{
        marginRight: responsiveWidth(3),
        height: responsiveHeight(6),
        width: responsiveHeight(8),
        borderRadius: responsiveWidth(2),
        borderWidth: responsiveWidth(0.3),
        borderColor: customDay?.includes(item)
          ? globalStyles.themeBlue
          : err.customDay
          ? 'red'
          : 'gray',
      }}>
      <TouchableOpacity
        onPress={() => {
          dayHandler(item);
        }}
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: customDay?.includes(item) ? globalStyles.themeBlue : 'gray',
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    </View>
  ));

  const customDayHandler = () => {
    if (customDay?.length > 0 && startDate && endDate) {
      let temp = '';
      for (let i = 0; i < customDay?.length; i++) {
        if (i === customDay.length - 1) {
          temp = temp + customDay[i];
        } else {
          temp = temp + customDay[i] + ', ';
        }
      }
      onClick({
        text: temp,
        value: customDay,
        schedule_startdate: startDate?.value,
        schedule_enddate: endDate?.value,
      });
    }
    if (customDay?.length === 0) {
      setErr(preData => ({...preData, customDay: true}));
    }
    if (!startDate) {
      setErr(preData => ({...preData, startDate: true}));
    }
    if (!endDate) {
      setErr(preData => ({...preData, endDate: true}));
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.repeatHeader}>
          <View>
            <Text style={styles.headerText}>Repeat</Text>
          </View>
          <View style={styles.cancel}>
            <TouchableOpacity onPress={disableModal}>
              <Image
                style={styles.img}
                source={require('../../assets/Icons/cancel.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.subContainer}>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => {
              onceHandler({text: 'Once', value: 'O'});
            }}>
            <Text style={styles.text}>Once</Text>
          </TouchableOpacity>
          <View style={styles.subContainer}>
            <TouchableOpacity
              style={styles.touch}
              onPress={() => {
                onceHandler({text: 'Daily', value: 'D'});
              }}>
              <Text style={styles.text}>Daily</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subContainer}>
            <TouchableOpacity style={styles.touch} onPress={dateHandler}>
              <Text style={styles.text}>Date</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subContainer}>
            <TouchableOpacity style={styles.touch} onPress={customHandler}>
              <Text style={styles.text}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {showCalendar && (
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              markedDates={{
                [date?.name]: {
                  selected: true,
                  selectedColor: globalStyles.themeBlue,
                },
              }}
              minDate={new Date().toDateString()}
              onDayPress={day => {
                setDate({name: day?.dateString, value: day?.dateString});
              }}
              style={{
                height: responsiveHeight(40),
                paddingBottom: responsiveHeight(2),
                width: responsiveWidth(100),
                borderTopLeftRadius: responsiveWidth(5),
                borderTopRightRadius: responsiveWidth(5),
              }}
            />
            <BorderBtn
              buttonText="Ok"
              onClick={customDateHandler}
              containerStyle={{
                ...styles.calendarCancelButton,
                marginTop: responsiveHeight(1.5),
                marginBottom: responsiveHeight(1.5),
                backgroundColor: globalStyles.themeBlue,
                borderWidth: 0,
              }}
            />
            <BorderBtn
              buttonText="Cancel"
              onClick={calendarCancelHandler}
              containerStyle={styles.calendarCancelButton}
              buttonTextStyle={{color: 'red'}}
            />
          </View>
        </View>
      )}

      {showHorizontalCalendar && (
        <View style={styles.modalContainer}>
          <View style={styles.horizontal}>
            <Text
              style={{
                marginVertical: responsiveHeight(2),
                width: responsiveWidth(90),
                fontSize: responsiveFontSize(2.6),
                color: 'black',
              }}>
              Custom
            </Text>
            <ScrollView
              style={{width: responsiveWidth(80)}}
              horizontal={true}
              bounces={false}
              showsHorizontalScrollIndicator={false}>
              {HorizontalCalendar}
            </ScrollView>
            <View style={{width: '80%'}}>
              <View>
                <TouchableOpacity
                  style={{
                    ...styles.touch1,
                    borderColor: startDate?.value
                      ? globalStyles.themeBlue
                      : err?.startDate
                      ? 'red'
                      : 'gray',
                  }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setShowStartDateCalendar(true);
                  }}>
                  <Text
                    style={{fontSize: responsiveFontSize(2), color: 'black'}}>
                    {startDate?.name
                      ? startDate?.name
                      : 'Select Routine Start Date'}
                  </Text>
                  <Image
                    source={require('../../assets/Icons/calendar-black.png')}
                    style={{
                      height: responsiveHeight(3),
                      width: responsiveHeight(3),
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    ...styles.touch1,
                    borderColor: endDate?.value
                      ? globalStyles.themeBlue
                      : err.endDate
                      ? 'red'
                      : 'gray',
                  }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setShowendDateCalendar(true);
                  }}>
                  <Text
                    style={{fontSize: responsiveFontSize(2), color: 'black'}}>
                    {endDate?.name ? endDate?.name : 'Select Routine End Date'}
                  </Text>
                  <Image
                    source={require('../../assets/Icons/calendar-black.png')}
                    style={{
                      height: responsiveHeight(3),
                      width: responsiveHeight(3),
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <BorderBtn
              buttonText="Ok"
              onClick={customDayHandler}
              containerStyle={{
                ...styles.calendarCancelButton,
                marginTop: responsiveHeight(1.5),
                marginBottom: responsiveHeight(1.5),
                backgroundColor: globalStyles.themeBlue,
                borderWidth: 0,
              }}
            />
            <BorderBtn
              buttonText="Cancel"
              onClick={() => {
                setShowHorizontalCalendar(false);
              }}
              containerStyle={styles.calendarCancelButton}
              buttonTextStyle={{color: 'red'}}
            />
          </View>
        </View>
      )}
      {showStartDateCalendar && (
        <View style={{...styles.modalContainer}}>
          <View style={styles.calendarContainer}>
            <Calendar
              markedDates={{
                [startDate?.name]: {
                  selected: true,
                  selectedColor: globalStyles.themeBlue,
                },
              }}
              minDate={new Date().toDateString()}
              onDayPress={day => {
                if (
                  day?.dateString &&
                  endDate?.value &&
                  moment(day?.dateString).isAfter(moment(endDate?.value))
                ) {
                  setEndDate(() => undefined);
                }
                setStartDate(() => ({
                  name: day?.dateString,
                  value: day?.dateString,
                }));
              }}
              style={{
                height: responsiveHeight(40),
                paddingBottom: responsiveHeight(2),
                width: responsiveWidth(100),
                borderTopLeftRadius: responsiveWidth(5),
                borderTopRightRadius: responsiveWidth(5),
              }}
            />
            <BorderBtn
              buttonText="Ok"
              onClick={startDateHandler}
              containerStyle={{
                ...styles.calendarCancelButton,
                marginTop: responsiveHeight(1.5),
                marginBottom: responsiveHeight(1.5),
                backgroundColor: globalStyles.themeBlue,
                borderWidth: 0,
              }}
            />
            <BorderBtn
              buttonText="Cancel"
              onClick={calendarCancelHandler}
              containerStyle={styles.calendarCancelButton}
              buttonTextStyle={{color: 'red'}}
            />
          </View>
        </View>
      )}
      {showEndDateCalendar && (
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              markedDates={{
                [endDate?.name]: {
                  selected: true,
                  selectedColor: globalStyles.themeBlue,
                },
              }}
              minDate={
                startDate
                  ? new Date(startDate?.value)?.toDateString()
                  : new Date().toDateString()
              }
              onDayPress={day => {
                setEndDate(() => ({
                  name: day?.dateString,
                  value: day?.dateString,
                }));
              }}
              style={{
                // height: responsiveHeight(40),
                paddingBottom: responsiveHeight(2),
                width: responsiveWidth(100),
                borderTopLeftRadius: responsiveWidth(5),
                borderTopRightRadius: responsiveWidth(5),
              }}
            />
            <BorderBtn
              buttonText="Ok"
              onClick={endDateHandler}
              containerStyle={{
                ...styles.calendarCancelButton,
                marginTop: responsiveHeight(1.5),
                marginBottom: responsiveHeight(1.5),
                backgroundColor: globalStyles.themeBlue,
                borderWidth: 0,
              }}
            />
            <BorderBtn
              buttonText="Cancel"
              onClick={calendarCancelHandler}
              containerStyle={styles.calendarCancelButton}
              buttonTextStyle={{color: 'red'}}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default RepeatOptions;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: responsiveHeight(3),
    borderTopRightRadius: responsiveWidth(8),
    borderTopLeftRadius: responsiveWidth(8),
    backgroundColor: 'white',
  },
  repeatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(7),
    width: responsiveWidth(100),
  },
  headerText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '400',
    color: 'black',
  },
  cancel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
  },

  subContainer: {
    marginVertical: responsiveHeight(0.5),
    width: responsiveWidth(95),
    borderRadius: responsiveWidth(1),
    ...globalStyles.shadowStyle,
  },
  touch: {
    paddingVertical: responsiveHeight(0.5),
  },
  text: {
    paddingLeft: responsiveWidth(7),
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
    color: 'black',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'flex-end',
  },
  calendarContainer: {
    alignItems: 'center',
    borderTopLeftRadius: responsiveWidth(5),
    borderTopRightRadius: responsiveWidth(5),
    backgroundColor: 'white',
  },
  calendarCancelButton: {
    marginBottom: responsiveHeight(4),
    width: responsiveWidth(80),
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: responsiveWidth(0.23),
  },
  horizontal: {
    alignItems: 'center',
    borderTopLeftRadius: responsiveWidth(5),
    borderTopRightRadius: responsiveWidth(5),
    backgroundColor: 'white',
  },
  touch1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(1.5),
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: '2%',
    width: '100%',
    borderWidth: responsiveWidth(0.3),
    borderRadius: responsiveWidth(2),
    ...globalStyles.shadowStyle,
  },
});
