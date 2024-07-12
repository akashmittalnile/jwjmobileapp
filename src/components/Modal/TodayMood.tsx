import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
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
  loader?: boolean;
  onPress: (mood: string) => void;
  disableModal: () => void;
}

const TodayMood: React.FC<TodayMoodProps> = ({
  onPress,
  disableModal,
  loader = false,
}) => {
  const moodData = useAppSelector(state => state.mood);
  const moodHandler = (id: string) => {
    onPress(id);
  };
  const disableModalHandler = () => {
    disableModal && disableModal();
  };

  const renderMood = ({item, index}: {item: any; index: number}) => {
    return (
      <TouchableOpacity
        disabled={loader}
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
    );
  };
  return (
    <View style={styles.container}>
      <Wrapper containerStyle={styles.wrapper}>
        <TouchableOpacity
          style={styles.crossTouch}
          onPress={disableModalHandler}
          disabled={loader}>
          {!loader && (
            <Image
              source={require('../../assets/Icons/cancel.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          )}
          {loader && <ActivityIndicator color={globalStyles.themeBlue} />}
        </TouchableOpacity>
        <Text style={styles.heading}>How Are You Feeling Today?</Text>
        <View style={styles.buttonsContainer}>
          <FlatList
            data={moodData}
            renderItem={renderMood}
            numColumns={Math.ceil((moodData?.length * 0 + 4) / 1)}
            bounces={false}
          />
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
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(3.5),
    width: responsiveHeight(3.5),
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
    marginTop: responsiveHeight(1),
    width: '100%',
    maxHeight: responsiveHeight(40),
  },
  touch: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  img: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
  },
  text: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
    color: globalStyles.themeBlue,
    textAlign: 'center',
  },
});
