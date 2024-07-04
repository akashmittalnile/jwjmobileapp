/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import {Calendar} from 'react-native-calendars';
import CalendarCustomHeader from '../Header/CalendarCustomHeader';
import {responsiveWidth} from 'react-native-responsive-dimensions';

interface CustomCalendarProps {
  containerStyle?: ViewStyle;
  dateHandler?: (date: string) => void;
  value?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  containerStyle,
  dateHandler,
  value,
}) => {
  const [selected, setSelected] = React.useState<[]>([]);

  return (
    <Calendar
      date={value ? value : undefined}
      maxDate={`${new Date().toUTCString()}`}
      renderHeader={(date: any) => <CalendarCustomHeader date={date} />}
      // renderArrow={(props) => <RenderArrow obj={props} />}
      style={[styles.calendar, containerStyle]}
      onDayPress={(day: {dateString: any}) => {
        setSelected(day.dateString);
        if (dateHandler) {
          dateHandler(day.dateString);
        }
      }}
      markedDates={{
        [selected]: {
          selected: true,
          disableTouchEvent: true,
          selectedDotColor: 'orange',
        },
      }}
    />
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  calendar: {
    width: responsiveWidth(67),
  },
});
