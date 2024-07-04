/* eslint-disable prettier/prettier */
import { View, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

interface BgLinearGradientProps {
    colors?: [],
    containerStyle?: ViewStyle
}

const BgLinearGradient: React.FC<BgLinearGradientProps> = ({ colors = ['#B9D9EB', '#F0F8FF',  'white'], containerStyle }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} colors={colors} style={styles.gradientStyle}/>
        </View>
    );
};

export default BgLinearGradient;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // zIndex: 0,
    },
    gradientStyle: {
        height: '100%',
        width: '100%',
    },
});