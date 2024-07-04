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

interface ToadyCommunityPorps {
  style?: ViewStyle;
  data: any;
}

const TodayCommunity: React.FC<ToadyCommunityPorps> = ({data, style}) => {
  const navigation = useNavigation();
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

  const renderItem = ({item}: {item: any}) => {
    const goTocommunityDetails = (community_id: number) => {
      navigation.navigate(ScreenNames.FollowedCommunityDetails, {community_id});
    };

    return (
      <View
        style={{
          marginTop: responsiveHeight(1.5),
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            goTocommunityDetails(item?.id);
          }}>
          <View
            style={{...styles.todayEntriesBtnContainer, width: style?.width}}>
            <ImageSlider
              data={[item?.image[0]]}
              imageStyle={{
                width:
                  style?.width && Number(style?.width) < responsiveWidth(80)
                    ? responsiveWidth(68)
                    : null,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: style?.width,
            }}>
            <Text
              style={{
                color: 'black',
                fontWeight: '400',
                width: style?.width,
                paddingHorizontal: '5%',
                textAlign: 'center',
              }}>
              {item?.name}
            </Text>
          </View>
          <Text
            style={{
              marginTop: responsiveHeight(0.5),
              paddingHorizontal: responsiveWidth(5),
              color: globalStyles.textGray,
              letterSpacing: 1.5,
              fontSize: responsiveFontSize(1.4),
              width: style?.width,
            }}>
            {item?.description}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  //  console.log( data?.length > 1 && currentIndex === data?.length - 1 ? true : false)
  return (
    <Wrapper
      containerStyle={{
        ...styles.wrapper,
        paddingBottom: responsiveHeight(2),
        width: '100%',
        ...style,
        overflow: 'hidden',
      }}>
      <View style={styles.TodayEntriesHeader}>
        <ArrowButton
          arrowType="left"
          onPress={arrowLeftHandler}
          disable={currentIndex === 0 ? true : false}
        />
        <Text style={{...styles.TodayEntriesText, fontWeight: 'bold'}}>
          Community
        </Text>
        <ArrowButton
          onPress={arrowRightHandler}
          disable={
            currentIndex === data?.length - 1 || data?.length < 1 ? true : false
          }
        />
      </View>

      {data?.length > 0 && (
        <FlatList
          ref={flatlistRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal={true}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={{width: '100%'}}
        />
      )}
      {data?.length === 0 && (
        <>
          <Image
            source={require('../../assets/Icons/no-data-found.png')}
            style={{
              ...styles.noData,
              width: style?.width,
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              ...styles.TodayEntriesText,
              fontWeight: 'bold',
            }}>
            No Communities Found
          </Text>
        </>
      )}
    </Wrapper>
  );
};

export default TodayCommunity;

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
    marginTop: responsiveHeight(1),
    // marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
  },
  todayEntriesTouch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(6),
    width: '48%',
    borderRadius: responsiveWidth(1),
    ...globalStyles.shadowStyle,
    elevation: 5,
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
