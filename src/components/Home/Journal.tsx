import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import ArrowButton from '../Button/ArrowButton';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import ImageSlider from '../Slider/ImageSlider';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import FastImage from 'react-native-fast-image';
import noDataFoundIcon from '../../assets/Icons/no-data-found.png';

interface ToadyCommunityPorps {
  style?: ViewStyle;
  data: any;
}

const Journal: React.FC<ToadyCommunityPorps> = ({data, style}) => {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const flatlistRef = React.useRef<FlatList>(null);
  const navigation = useNavigation();

  const arrowLeftHandler = () => {
    flatlistRef?.current?.scrollToIndex({
      index: currentIndex - 1,
      animated: true,
    });
    setCurrentIndex(value => --value);
  };

  const arrowRightHandler = () => {
    flatlistRef?.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
    setCurrentIndex(value => ++value);
  };

  const journalInfoHandler = (id: string) => {
    navigation.navigate(ScreenNames.JournalsInfo, {journalsId: id});
  };

  const renderItem = ({item}: {item: any}) => {
    const imageData = item?.images[0]?.img_path;
    return (
      <View style={{marginTop: responsiveHeight(1.5)}}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            journalInfoHandler(item?.id);
          }}>
          <View
            style={{
              ...styles.todayEntriesBtnContainer,
              width: style?.width,
            }}>
            <ImageSlider
              data={[
                imageData
                  ? imageData
                  : Image.resolveAssetSource(noDataFoundIcon)?.uri,
              ]}
              imageStyle={styles.imageSlider}
            />
            {!imageData && (
              <View
                style={{
                  position: 'absolute',
                  bottom: responsiveHeight(2),
                  right: 0,
                  left: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'black', fontSize: responsiveFontSize(2)}}>
                  No Image
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              alignItems: 'center',
              width: style?.width,
              marginTop: responsiveHeight(-1),
            }}>
            {item?.mood_logo && (
              <FastImage
                source={{
                  uri: item?.mood_logo,
                  priority: FastImage.priority.high,
                }}
                style={{
                  height: responsiveHeight(5),
                  width: responsiveHeight(5),
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            )}
            <Text
              style={{
                marginTop: responsiveHeight(0.5),
                color: 'black',
                fontWeight: '400',
              }}>
              {item?.mood_name}
            </Text>
          </View>
          <Text
            style={{
              marginTop: responsiveHeight(1),
              paddingHorizontal: responsiveWidth(5),
              // paddingHorizontal: '5%',
              color: globalStyles.textGray,
              fontWeight: '800',
              letterSpacing: 1.5,
              fontSize: responsiveFontSize(1.6),
              width: style?.width,
            }}>
            {item?.title}
          </Text>
          <Text
            style={{
              marginTop: responsiveHeight(0.5),
              paddingHorizontal: responsiveWidth(5),
              // paddingHorizontal: '5%',
              color: globalStyles.textGray,
              letterSpacing: 1.5,
              fontSize: responsiveFontSize(1.4),
              width: style?.width,
            }}>
            {item?.content}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Wrapper
      containerStyle={{
        ...styles.wrapper,
        paddingBottom: responsiveHeight(2),
        width: '100%',
        ...style,
        overflow: 'hidden',
      }}>
      <View style={styles.dailyJournalsHeader}>
        <Text style={styles.text}>Daily Journal</Text>
        <View style={styles.dailyJournalsCounter}>
          {data?.length > 0 && (
            <Text style={styles.text}>{currentIndex + 1}/</Text>
          )}
          {data?.length > 0 && (
            <Text style={[styles.text, {color: globalStyles.textGray}]}>
              {data?.length}
            </Text>
          )}
        </View>
      </View>
      {data?.length > 0 && (
        <>
          <View style={styles.TodayEntriesHeader}>
            <ArrowButton
              arrowType="left"
              onPress={arrowLeftHandler}
              disable={currentIndex === 0 ? true : false}
            />
            <Text style={{...styles.TodayEntriesText, fontWeight: 'bold'}}>
              Journals
            </Text>
            <ArrowButton
              onPress={arrowRightHandler}
              disable={currentIndex === data?.length - 1 ? true : false}
            />
          </View>

          {/* <View
            style={{
              height: responsiveHeight(1),
              width: responsiveWidth(10),
              backgroundColor: 'red',
            }}></View> */}

          <FlatList
            ref={flatlistRef}
            data={data}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal={true}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}
      {data?.length === 0 && (
        <>
          <Image
            source={require('../../assets/Icons/no-data-found.png')}
            style={{...styles.noData, width: style?.width}}
            resizeMode="contain"
          />
          <Text style={{...styles.TodayEntriesText, fontWeight: 'bold'}}>
            No Journals Found
          </Text>
        </>
      )}
    </Wrapper>
  );
};

export default Journal;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
  },
  dailyJournalsHeader: {
    marginBottom: responsiveHeight(2),
    width: '100%',
    paddingHorizontal: responsiveWidth(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dailyJournalsCounter: {
    flexDirection: 'row',
  },
  text: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
  TodayEntriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    width: '100%',
  },
  TodayEntriesText: {
    color: globalStyles.textGray,
  },
  todayEntriesBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    width: '100%',
  },
  todayEntriesTouch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(6),
    width: '48%',
    borderRadius: responsiveWidth(1),
    elevation: 1,
    shadowColor: globalStyles.lightGray,
  },
  todayEntriesText: {
    color: 'black',
    marginHorizontal: responsiveWidth(2),
  },
  imageSlider: {
    width: '100%',
  },
  noData: {
    height: responsiveHeight(10),
  },
});
