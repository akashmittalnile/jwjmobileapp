/* eslint-disable prettier/prettier */
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { globalStyles } from '../../utils/constant';

interface BorderLessBtnProps {
    buttonText: string,
    containerStyle?: ViewStyle,
    buttonTextStyle?: TextStyle,
    onClick: () => void,
}

const BorderLessBtn: React.FC<BorderLessBtnProps> = ({ buttonText, containerStyle, buttonTextStyle, onClick }) => {
    return (
        <TouchableOpacity onPress={onClick} style={[styles.touch, containerStyle]}>
            <Text style={[styles.text, buttonTextStyle]}>{buttonText}</Text>
        </TouchableOpacity>
    );
};

export default BorderLessBtn;

const styles = StyleSheet.create({
    touch: {
        height: responsiveHeight(3),
        width: '95%',
    },
    text: {
        color: globalStyles.themeBlue,
        fontSize: responsiveFontSize(1.6),
        textAlign: 'right',
    },
});