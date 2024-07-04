import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface TimeProps {
  onClick: () => void;
  value?: Date[];
  placeholder?: string;
  style?: ViewStyle;
}

const Time: React.FC<TimeProps> = ({
  onClick,
  value = [],
  placeholder = '',
  style,
}) => {
  return (
    <>
      <Wrapper containerStyle={{...styles.wrapper, ...style}}>
        <TouchableOpacity style={styles.touch} onPress={onClick}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '80%',
              height: '100%',
            }}>
            {value?.length > 0 ? (
              value?.map((item: Date, index: number) => {
                const hours = item.getHours();
                const minutes = item.getMinutes();
                return (
                  <Text style={styles.time} key={index.toString()}>{`${
                    hours < 10 ? '0' + hours : hours
                  }:${minutes < 10 ? '0' + minutes : minutes}`}</Text>
                );
              })
            ) : (
              <Text style={{color: 'black'}}>{placeholder}</Text>
            )}
          </View>
          <Image
            source={require('../../assets/Icons/clock.png')}
            resizeMode="contain"
            style={styles.image}
          />
        </TouchableOpacity>
      </Wrapper>
    </>
  );
};

export default Time;

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
    color: 'black',
  },
  image: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
  },
});
