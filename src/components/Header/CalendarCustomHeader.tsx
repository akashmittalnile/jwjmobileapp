/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

interface CalendarCustomHeaderProps {
    date: any,
}

const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

const CalendarCustomHeader: React.FC<CalendarCustomHeaderProps> = ({ date }) => {
    const [month, setMonth] = React.useState<string>('');

    const monthHandler = React.useCallback(() => {
        const _date = new Date(date);
        const _month = _date.getMonth();
        setMonth(months[_month]);
    }, [date]);

    React.useEffect(() => {
        monthHandler();
    }, [date, monthHandler]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{month}</Text>
        </View>
    );
};

export default CalendarCustomHeader;

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    text: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: '600',
        color: 'black',
    },
});