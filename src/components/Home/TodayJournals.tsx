import {View, Text, Image, StyleSheet, ViewStyle, FlatList} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import ArrowButton from '../Button/ArrowButton';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface ToadyCommunityPorps {
  style?: ViewStyle;
  data: any;
}

const TodayJournals: React.FC<ToadyCommunityPorps> = ({data, style}) => {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const flatlistRef = React.useRef<FlatList>(null);

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

  const renderItem = ({item}: {item: any}) => (
    <View style={{marginTop: responsiveHeight(1.5)}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: style?.width,
          paddingLeft: '5%',
        }}>
        {item?.mood_logo && (
          <Image
            source={{uri: item?.mood_logo}}
            style={{
              height: responsiveHeight(5),
              width: responsiveHeight(5),
            }}
            resizeMode="contain"
          />
        )}
        <Text
          style={{
            color: 'black',
            fontWeight: '400',
            paddingLeft: '1%',
          }}>
          {item?.title}
        </Text>
      </View>
      <Text
        style={{
          marginTop: responsiveHeight(0.5),
          paddingHorizontal: '3%',
          color: globalStyles.textGray,
          textAlign: 'center',
          letterSpacing: 1.5,
          fontSize: responsiveFontSize(1.4),
          width: style?.width,
        }}>
        {item?.content}
      </Text>
    </View>
  );

  return (
    <Wrapper
      containerStyle={{
        ...styles.wrapper,
        paddingBottom: responsiveHeight(2),
        width: '100%',
        ...style,
        overflow: 'hidden',
      }}>
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
        <Text style={{...styles.TodayEntriesText, fontWeight: 'bold'}}>
          No Journals Found
        </Text>
      )}
    </Wrapper>
  );
};

export default TodayJournals;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
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
});
