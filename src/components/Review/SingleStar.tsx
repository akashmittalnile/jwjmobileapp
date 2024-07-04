/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { TouchableOpacity, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import React from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

interface SingleStarProps {
    style?: ViewStyle,
    imageStyle?: ImageStyle,
    onPress?: (value: number) => void,
    value?: boolean,
    disabledButton?: boolean,
    uniqueNumber: number
}

const SingleStar: React.FC<SingleStarProps> = ({ style, imageStyle, onPress, value = false, disabledButton = false, uniqueNumber }) => {
    const clickHandler = () => {
        if (onPress) {
            onPress(uniqueNumber);
        }
    };
    return (
        <TouchableOpacity style={[styles.touch, style]} onPress={clickHandler} disabled={disabledButton}>
            {value ? <Image source={require('../../assets/Icons/star.png')} style={[{ height: '100%', width: '100%' }, imageStyle]} resizeMode="contain" /> : <Image source={require('../../assets/Icons/disable-star.png')} style={[{ height: '100%', width: '100%' }, imageStyle]} resizeMode="contain" />}
        </TouchableOpacity>
    );
};

export default SingleStar;

const styles = StyleSheet.create({
    touch: {
        marginHorizontal: responsiveWidth(0.3),
        height: responsiveHeight(5),
        width: responsiveHeight(5),
    },
});