/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  ImageStyle,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface MarkCompletedProps {
  isCompleted?: boolean;
  circleContainerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  line?: boolean;
  lineActive?: boolean;
  text?: string;
}
const MarkCompleted: React.FC<MarkCompletedProps> = ({
  circleContainerStyle,
  imageStyle,
  isCompleted = false,
  line = false,
  lineActive = false,
  text = '',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={[styles.circleStyle, circleContainerStyle]}>
          {isCompleted ? (
            <Image
              source={require('../../assets/Icons/mark-completed-blue.png')}
              style={[styles.img, imageStyle]}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/Icons/mark-completed-gray.png')}
              style={[styles.img, imageStyle]}
              resizeMode="contain"
            />
          )}
        </View>
        <Image
          source={
            lineActive
              ? require('../../assets/Icons/Vector-3.png')
              : require('../../assets/Icons/Vector-4.png')
          }
          resizeMode="stretch"
          style={{
            width: line ? responsiveWidth(15) : 0,
            height: responsiveHeight(2.5),
          }}
        />
      </View>
    </View>
  );
};

export default MarkCompleted;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 'auto',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: responsiveWidth(11),
    width: responsiveWidth(11),
    borderRadius: responsiveWidth(7),
    backgroundColor: globalStyles.veryLightGray,
  },
  img: {
    height: responsiveWidth(5),
    width: responsiveWidth(5),
  },
  text: {
    position: 'absolute',
    top: responsiveHeight(6),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
});
