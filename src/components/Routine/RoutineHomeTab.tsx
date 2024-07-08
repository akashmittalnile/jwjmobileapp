import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import SvgUri from 'react-native-svg-uri';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import defaultImage from '../../assets/Icons/meditation.png';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';

interface RoutineHomeTabProps {
  data: any;
}

const RoutineHomeTab: React.FC<RoutineHomeTabProps> = ({data}) => {
  const navigation = useNavigation();
  const goToRoutineDetailsScreenHandler = () => {
    navigation.navigate(ScreenNames.RoutineDetailsWithTask, {
      id: data?.routineid,
    });
  };

  const statusHandler = (status: string) => {
    if (status === 'closed') {
      return (
        <View style={styles.status}>
          <Image
            source={require('../../assets/Icons/tick-green.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#82AD26'}}>Closed</Text>
        </View>
      );
    } else if (status === 'completed') {
      return (
        <View style={styles.status}>
          <Image
            source={require('../../assets/Icons/tick-green.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#82AD26', width: 'auto'}}>Completed</Text>
        </View>
      );
    } else if (status === 'progress') {
      return (
        <View style={{...styles.status, borderColor: globalStyles.themeBlue}}>
          <Image
            source={require('../../assets/Icons/progress.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: globalStyles.themeBlue}}>In-progress</Text>
        </View>
      );
    } else if (status === 'pending') {
      return (
        <View style={{...styles.status, borderColor: '#FFA412'}}>
          <Image
            source={require('../../assets/Icons/timer.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#FFA412'}}>Pending</Text>
        </View>
      );
    } else {
      return (
        <View style={{...styles.status, borderColor: globalStyles.midGray}}>
          <Text style={{color: 'black', paddingLeft: responsiveWidth(2)}}>
            {status}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={goToRoutineDetailsScreenHandler}>
        {/* <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: responsiveHeight(1)}}>
          <Text style={{marginLeft: responsiveWidth(3),color: 'black'}}>Status: </Text>
          {statusHandler(data?.status?.toLowerCase())}
        </View> */}
        <View style={styles.touch}>
          <View style={{flex: 1}}>
            <SvgUri
              source={{
                uri: data
                  ? data?.category_logo
                  : Image.resolveAssetSource(defaultImage)?.uri,
              }}
              height={responsiveHeight(7)}
              width={responsiveHeight(7)}
            />
          </View>
          <View style={{flex: 3}}>
            <Text
              style={{
                ...styles.text,
                fontSize: responsiveFontSize(2),
                color: globalStyles.themeBlue,
              }}>{`${data?.routinename}`}</Text>
            <Text style={styles.text}>{`${data?.description} ${
              data?.time ? '@' + data?.time : ''
            }`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RoutineHomeTab;

const styles = StyleSheet.create({
  container: {
    marginVertical: responsiveHeight(1),
    width: '95%',
    borderWidth: responsiveWidth(0.2),
    borderRadius: responsiveWidth(2),
    borderColor: globalStyles.veryLightGray,
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    color: 'black',
    letterSpacing: 0.8,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '400',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.3),
    paddingRight: responsiveWidth(2.5),
    borderWidth: responsiveWidth(0.2),
    borderRadius: responsiveWidth(1),
    borderColor: '#82AD26',
  },
  icon: {
    height: responsiveHeight(1.7),
    width: responsiveWidth(8),
  },
});
