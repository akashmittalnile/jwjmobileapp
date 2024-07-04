/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import ScreenNames from '../../utils/ScreenNames';
const CurveTab = () => {
  const navigation= useNavigation();
  const clickHandler = () => {
    navigation.navigate(ScreenNames.Journals)
  }
  return (
    <View style={styles.container}>
      <View style={styles.ImageContainer}>
        <TouchableOpacity style={styles.touch} onPress={clickHandler}>
          <Image
            source={require('../../assets/Icons/menu-board.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CurveTab;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  ImageContainer: {
    position: 'absolute',
    zIndex: 2000,
    bottom: '40%',
    backgroundColor: globalStyles.themeBlue,
    height: responsiveHeight(9),
    width: responsiveHeight(9),
    borderRadius: responsiveHeight(4.5),
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  image: {
    height: '60%',
    width: '70%',
  },
});
