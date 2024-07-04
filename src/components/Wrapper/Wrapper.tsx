/* eslint-disable prettier/prettier */
import { View, ViewStyle, StyleSheet } from 'react-native';
import React, { ReactNode } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { globalStyles } from '../../utils/constant';

interface WrapperProps {
    children?: ReactNode,
    containerStyle?: ViewStyle
}

const Wrapper: React.FC<WrapperProps> = ({ children, containerStyle }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {children}
        </View>
    );
};

export default Wrapper;

const styles = StyleSheet.create({
    container: {
        // paddingBottom: responsiveHeight(3),
        paddingTop: responsiveHeight(3),
        width: responsiveWidth(90),
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: responsiveWidth(7),
        // elevation: 2,
        shadowColor: globalStyles.shadowColor,
    },
})