/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { globalStyles } from '../../utils/constant';

const temp = [1, 2, 3, 4, 5];

interface ReviewTabProps {
    totalRating?: number,
    name?: string,
    description?: string,
    date?: string,
    style?: ViewStyle
}

const ReviewTab: React.FC<ReviewTabProps> = ({ totalRating = '4.0', name = 'John', description, date = '01 Wed, 09:30', style }) => {

    const rating = temp.map((item, index) => (index + 1) <= Number(totalRating) ? <Image key={index.toString()} source={require('../../assets/Icons/star.png')} resizeMode="contain" style={{ marginLeft: responsiveWidth(1), height: responsiveHeight(1.5), width: responsiveHeight(2) }} /> : <Image key={index.toString()} source={require('../../assets/Icons/disable-star.png')} resizeMode="contain" style={{ marginLeft: responsiveWidth(1), height: responsiveHeight(1.5), width: responsiveHeight(2) }} />);

    return (
        <Wrapper containerStyle={{ ...styles.wrapper, ...style }}>

            {/* header */}
            <View style={styles.header}>
                <View style={styles.nameSign}>
                    <Text style={styles.nameSignText}>J</Text>
                </View>
                <View>
                    <View style={{ marginLeft: responsiveWidth(2) }}>
                        <Text style={{ color: 'black', fontSize: responsiveFontSize(1.5), fontWeight: '400' }}>John</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: responsiveHeight(-0.3) }}>
                            {rating}
                            <Text style={{ paddingLeft: responsiveWidth(2), color: 'black', fontSize: responsiveFontSize(1.5) }}>{`${totalRating} Rating`}</Text>
                        </View>
                    </View>
                    <View></View>
                </View>
            </View>

            {/* description */}
            <View style={{ marginTop: responsiveHeight(1) }}>
                <Text style={{ fontSize: responsiveFontSize(1.6), color: 'black', letterSpacing: 0.7, paddingHorizontal: responsiveWidth(2), fontWeight: '400', lineHeight: responsiveHeight(2.8) }}>I Recently Had The Pleasure Of Visiting This Furniture Store, And I Must Say, I Was Thoroughly Impressed With …</Text>
            </View>

            {/* date */}
            <Text style={{ marginVertical: responsiveHeight(0.7), width: '100%', paddingLeft: responsiveWidth(2), fontSize: responsiveFontSize(1.4), color: globalStyles.lightGray }}>01 Wed, 09:30</Text>

        </Wrapper>
    );
};

export default ReviewTab;

const styles = StyleSheet.create({
    wrapper: {
        marginTop: responsiveHeight(1),
        height: responsiveHeight(22),
        width: '100%',
        borderRadius: responsiveWidth(2),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
    },
    nameSign: {
        height: responsiveHeight(6),
        width: responsiveHeight(6),
        borderRadius: responsiveHeight(3),
        backgroundColor: globalStyles.veryLightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameSignText: {
        fontSize: responsiveFontSize(2),
        fontWeight: '500',
        color: globalStyles.themeBlue,
    },
});