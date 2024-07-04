/* eslint-disable prettier/prettier */
import { View, Image, StyleSheet, NativeModules } from 'react-native';
import React from 'react';


const {StatusBarManager} = NativeModules
const BgImage = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/Images/bgImage.png')} resizeMode="cover" style={styles.bgImage} />
        </View>
    );
};

export default BgImage;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: '90%',
        width: '100%',
        zIndex: -100,
    },
    bgImage: {
        height: '100%',
        width: '100%',
    },
});