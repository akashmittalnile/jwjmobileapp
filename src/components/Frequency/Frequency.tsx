import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface FrequencyProps {
  onClick: () => void;
  value: string;
  placeholder?: string;
}

const Frequency: React.FC<FrequencyProps> = ({
  onClick,
  value,
  placeholder = '',
}) => {
  return (
    <>
      <Wrapper containerStyle={styles.wrapper}>
        <TouchableOpacity style={styles.touch} onPress={onClick}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '50%',
              height: '100%',
            }}>
            <Text style={{color: 'black'}}>{placeholder}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.text}>{value}</Text>
            <Image
              source={require('../../assets/Icons/right-arrow-blue.png')}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
        </TouchableOpacity>
      </Wrapper>
    </>
  );
};

export default Frequency;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: responsiveHeight(2),
    paddingTop: responsiveHeight(0),
    width: '100%',
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(3),
    width: '100%',
  },
  time: {
    marginRight: responsiveWidth(2),
    fontSize: responsiveFontSize(2),
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  image: {
    height: '100%',
    width: responsiveHeight(2),
  },
  text: {
    paddingRight: responsiveWidth(1),
    fontSize: responsiveHeight(2),
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    color: 'black'
  },
});
