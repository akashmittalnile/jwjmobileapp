import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import {useAppSelector} from '../../redux/Store';
import FastImage from 'react-native-fast-image';

interface TodayMoodProps {
  onPress: (mood: string) => void;
  disableModal: () => void;
}

const TodayMood: React.FC<TodayMoodProps> = ({onPress, disableModal}) => {
  const moodData = useAppSelector(state => state.mood);
  const moodHandler = (id: string) => {
    onPress(id);
  };
  const disableModalHandler = () => {
    disableModal && disableModal();
  };
  return (
    <View style={styles.container}>
      <Wrapper containerStyle={styles.wrapper}>
        <TouchableOpacity
          style={styles.crossTouch}
          onPress={disableModalHandler}>
          <Image
            source={require('../../assets/Icons/cancel.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.heading}>How Are You Feeling Today?</Text>
        <View style={styles.buttonsContainer}>
          <ScrollView
            style={{height: '100%'}}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
            bounces={false}>
            {moodData?.map((item, index) => (
              <TouchableOpacity
                key={item?.id.toString() + index}
                style={styles.touch}
                onPress={() => {
                  moodHandler(item?.id);
                }}>
                <FastImage
                  source={{uri: item?.logo, priority: FastImage.priority.high}}
                  resizeMode={FastImage.resizeMode.contain}
                  style={styles.img}
                />
                <Text style={styles.text}>{item?.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Wrapper>
    </View>
  );
};

export default TodayMood;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  wrapper: {
    position: 'relative',
    paddingTop: responsiveHeight(2.5),
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(2.5),
  },
  crossTouch: {
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveWidth(2),
    height: responsiveHeight(2.5),
    width: responsiveHeight(2.5),
  },
  icon: {
    height: responsiveHeight(2.5),
    width: responsiveHeight(2.5),
  },
  heading: {
    marginBottom: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    opacity: 0.8,
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: responsiveHeight(1),
    width: '100%',
    paddingHorizontal: responsiveWidth(15),
    maxHeight: responsiveHeight(40),
  },
  touch: {
    alignItems: 'center',
    width: '50%',
  },
  img: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
  },
  text: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    color: globalStyles.themeBlue,
  },
});
