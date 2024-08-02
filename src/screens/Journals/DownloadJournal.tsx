import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import {globalStyles} from '../../utils/constant';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import moment from 'moment';
import BorderBtn from '../../components/Button/BorderBtn';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import Wrapper from '../../components/Wrapper/Wrapper';

const DownloadJournal = () => {
  const navigation = useNavigation();
  const [showCalendar, setShowCalendar] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<string>('');

  const _dateHandler = async (date: string) => {
    setDate(moment(date).format('MM-DD-YYYY'));
    showCalendar && setShowCalendar(false);
  };

  const showCalendarHandler = () => {
    setShowCalendar(value => !value);
  };

  const downloadJournal = () => {
    navigation.navigate(ScreenNames.Payment, {
      downloadJournal: true,
      startDate: date,
    });
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Header title="Print Pdf" notificationButton={false} />
        </View>
        <View style={styles.subContainer}>
          <Text style={styles.heading}>
            This is an opportunity for you to create a legacy for your future
            generations. You can download a six month span into a printable PDF
            file.
          </Text>
          <Wrapper containerStyle={styles.wrapper}>
            <Text style={styles.headingText}>From Date</Text>
            <View style={styles.calendarDateContainer}>
              <TouchableOpacity
                style={styles.touch}
                activeOpacity={0.5}
                onPress={showCalendarHandler}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../../assets/Icons/calendar-blue.png')}
                    resizeMode="contain"
                    style={{...styles.img, marginLeft: responsiveWidth(2)}}
                  />
                </View>
                <View style={styles.calendarTextContainer}>
                  <Text style={styles.calendarText}>
                    {date ? date : 'MM-DD-YYYY'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text
              style={[styles.headingText, {marginTop: responsiveHeight(3)}]}>
              To Date
            </Text>
            <View
              style={{
                ...styles.calendarDateContainer,
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}>
              <TouchableOpacity
                disabled={true}
                style={styles.touch}
                activeOpacity={0.5}
                onPress={showCalendarHandler}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../../assets/Icons/calendar-blue.png')}
                    resizeMode="contain"
                    style={{...styles.img, marginLeft: responsiveWidth(2)}}
                  />
                </View>
                <View style={styles.calendarTextContainer}>
                  <Text style={styles.calendarText}>
                    {date
                      ? moment(date, 'MM-DD-YYYY')
                          .add(6, 'month')
                          .format('MM-DD-YYYY')
                      : 'MM-DD-YYYY'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <BorderBtn
              disable={date ? false : true}
              buttonText="Print Pdf for $29.99"
              onClick={downloadJournal}
              containerStyle={styles.button}
            />
          </Wrapper>
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
    alignItems: 'center',
    width: responsiveWidth(95),
  },
  wrapper: {
    marginTop: responsiveHeight(2),
    width: '94%',
  },
  heading: {
    marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
    fontSize: responsiveFontSize(1.7),
    fontWeight: '400',
    textAlign: 'center',
  },
  calendarDateContainer: {
    marginTop: responsiveHeight(1),
    paddingVertical: responsiveHeight(0.2),
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 2,
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
  },
  headingText: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    fontSize: responsiveFontSize(1.8),
    color: 'rgba(0,0,0,0.7)',
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: responsiveHeight(6),
    width: '90%',
  },
  calendarTextContainer: {
    paddingHorizontal: responsiveWidth(3),
    width: '88%',
  },
  calendarText: {
    fontSize: responsiveHeight(1.8),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '10%',
  },
  img: {
    height: '50%',
    width: '100%',
  },
  button: {
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(5),
    width: '70%',
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
