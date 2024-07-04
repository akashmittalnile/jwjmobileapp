// CalendarStrip.tsx

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface HorizontalCalendarStripProps {
  onSelectDate: (date: string) => void;
  selected: string;
}

const HorizontalCalendarStrip: React.FC<HorizontalCalendarStripProps> = ({
  onSelectDate,
  selected,
}) => {
  const [dates, setDates] = useState<string[]>([]);

  const getDates = () => {
    const _dates: string[] = [];
    for (let i = 0; i < 30; i++) {
      const date = moment().add(i, 'days').format('YYYY-MM-DD');
      _dates.push(date);
    }
    setDates(_dates);
  };

  useEffect(() => {
    getDates();
  }, []);

  interface DateComponentProps {
    date: string;
  }

  const DateComponent: React.FC<DateComponentProps> = ({date}) => {
    const isToday = moment(date).isSame(moment(), 'day');
    const day = isToday ? 'Today' : moment(date).format('ddd');
    const dayNumber = moment(date).format('D');

    return (
      <TouchableOpacity
        onPress={() => onSelectDate(date)}
        style={[styles.card, selected === date && {...styles.selectedCard}]}>
        <Text
          style={[
            styles.day,
            isToday && styles.todayText,
            selected === date && styles.selectedText,
          ]}>
          {day}
        </Text>
        <View style={{height: 10}} />
        <Text
          style={[styles.dayNumber, selected === date && styles.selectedText]}>
          {Number(dayNumber) < 10 ? `0${dayNumber}` : dayNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.dateSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}>
          {dates.map((date, index) => (
            <DateComponent key={index} date={date} />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateSection: {
    marginTop: responsiveHeight(1),
    width: '100%',
  },
  card: {
    borderRadius: responsiveWidth(2),
    borderWidth: responsiveWidth(0.23),
    borderColor: 'white',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    height: responsiveHeight(9),
    width: responsiveWidth(18),
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  selectedCard: {
    backgroundColor: 'white',
    borderColor: globalStyles.themeBlue,
  },
  day: {
    fontWeight: '400',
    fontSize: responsiveFontSize(1.6),
  },
  todayText: {
    color: globalStyles.themeBlue,
  },
  dayNumber: {
    fontWeight: '700',
    fontSize: responsiveFontSize(2),
    color: globalStyles.themeBlue,
  },
  selectedText: {
    color: globalStyles.themeBlue,
    fontWeight: 'bold',
  },
});

export default React.memo(HorizontalCalendarStrip);
