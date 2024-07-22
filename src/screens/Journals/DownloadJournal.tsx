import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import {globalStyles} from '../../utils/constant';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import moment from 'moment';
import BorderBtn from '../../components/Button/BorderBtn';

const DownloadJournal = () => {
  const [showCalendar, setShowCalendar] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<string>('');

  const _dateHandler = async (date: string) => {
    setDate(moment(date).format('MM-DD-YYYY'));
    showCalendar && setShowCalendar(false);
  };

  const showCalendarHandler = () => {
    setShowCalendar(value => !value);
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Header title="Download Journal" notificationButton={false} />
        </View>
        <View style={styles.subContainer}>
          <View style={styles.calendarDateContainer}>
            <TouchableOpacity
              style={styles.touch}
              activeOpacity={0.5}
              onPress={showCalendarHandler}>
              <View style={styles.calendarTextContainer}>
                <Text style={styles.calendarText}>
                  {date ? date : 'MM-DD-YYYY'}
                </Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/Icons/calendar-blue.png')}
                  resizeMode="contain"
                  style={{...styles.img, marginLeft: responsiveWidth(2)}}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.calendarDateContainer}>
            <TouchableOpacity
              style={styles.touch}
              activeOpacity={0.5}
              onPress={showCalendarHandler}>
              <View style={styles.calendarTextContainer}>
                <Text style={styles.calendarText}>
                  {date
                    ? moment(date, 'MM-DD-YYYY')
                        .add(6, 'month')
                        .format('MM-DD-YYYY')
                    : 'MM-DD-YYYY'}
                </Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/Icons/calendar-blue.png')}
                  resizeMode="contain"
                  style={{...styles.img, marginLeft: responsiveWidth(2)}}
                />
              </View>
            </TouchableOpacity>
          </View>
          <BorderBtn
            disable={date ? false : true}
            buttonText="Download"
            onClick={() => {}}
            containerStyle={styles.button}
          />
        </View>
      </View>
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <CustomCalendar
            value={date}
            containerStyle={styles.calendarStyle}
            dateHandler={_dateHandler}
          />
        </View>
      )}
    </>
  );
};

export default DownloadJournal;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: globalStyles.backgroundColor,
  },
  followedCommunityTabStyle: {
    marginTop: responsiveHeight(1.5),
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: responsiveHeight(2),
    backgroundColor: globalStyles.themeBlue,
  },
  subContainer: {
    flex: 1,
    width: responsiveWidth(95),
  },
  calendarDateContainer: {
    marginTop: responsiveHeight(2),
    paddingVertical: responsiveHeight(0.2),
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 3,
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: responsiveHeight(6),
    width: '100%',
  },
  calendarTextContainer: {
    paddingHorizontal: responsiveWidth(3),
    width: '70%',
  },
  calendarText: {
    fontSize: responsiveHeight(2),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '20%',
  },
  img: {
    height: '50%',
    width: '100%',
  },
  button: {
    marginTop: responsiveHeight(4),
    width: '100%',
  },
  calendarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  calendarStyle: {
    width: responsiveWidth(80),
    padding: 10,
    borderRadius: responsiveWidth(2),
  },
});
