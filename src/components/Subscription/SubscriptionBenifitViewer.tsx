/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
import { View, StyleSheet, Image, Text } from 'react-native';
import React from 'react';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

interface SubscriptionBenifitViewerProps {
    text?: string
}

const SubscriptionBenifitViewer: React.FC<SubscriptionBenifitViewerProps> = ({ text }) => {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/Icons/tick-circle.png')} />
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

export default SubscriptionBenifitViewer;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: responsiveHeight(5),
    },
    text: {
        paddingLeft: responsiveWidth(3),
        fontSize: responsiveFontSize(1.7),
        fontWeight: '500',
        color: 'black'
    },
});