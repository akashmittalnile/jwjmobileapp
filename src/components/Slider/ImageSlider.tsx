import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import {useAppDispatch} from '../../redux/Store';
import {showImageViewerHandler} from '../../redux/ImageViewerSlice';
import FastImage from 'react-native-fast-image';

interface ImageSliderProps {
  data: string[];
  imageStyle?: ImageStyle;
  showImageViewer?: boolean;
}
let currentIndex = 0;
const ImageSlider: React.FC<ImageSliderProps> = ({
  data = [''],
  imageStyle,
  showImageViewer = true,
}) => {
  const dispatch = useAppDispatch();
  const flatlistRef = React.useRef<FlatList>(null);
  const [cIndex, setCIndex] = React.useState<number>(0);

  React.useEffect(() => {}, [imageStyle?.width]);

  const flatlistScrollHandler = () => {
    if (currentIndex === data?.length - 1) {
      currentIndex = -1;
    }
    if (currentIndex < data.length - 1) {
      flatlistRef.current?.scrollToIndex({index: currentIndex + 1});
      currentIndex = currentIndex + 1;
    }
    setCIndex(currentIndex);
  };

  const ImageModalHandler = (uri: string) => {
    showImageViewer && dispatch(showImageViewerHandler({show: true, uri}));
  };

  const renderImageItem = ({item}: {item: string}) => (
    <View
      style={{
        ...styles.followedCommunityImage,
        ...imageStyle,
      }}>
      <TouchableOpacity
        onPress={() => {
          ImageModalHandler(item);
        }}
        style={{height: responsiveHeight(22)}}>
        <FastImage
          style={{
            width: imageStyle?.width
              ? imageStyle?.width
              : responsiveWidth(93.2),
            height: responsiveHeight(22),
            borderRadius: responsiveWidth(2),
          }}
          source={{
            uri: item ? item : '',
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        {/* <Image
          source={{uri: item ? item : ''}}
          style={{...styles.followedCommunityImage, ...imageStyle}}
          resizeMode="contain"
        /> */}
      </TouchableOpacity>
    </View>
  );

  const scrollButton = (index: number) => {
    currentIndex = index - 1;
    flatlistScrollHandler();
  };

  const onScrollHandle = (e: any) => {
    const {contentOffset, layoutMeasurement} = e.nativeEvent;
    const index = contentOffset.x / layoutMeasurement.width;
    currentIndex = Math.floor(index);
    setCIndex(() => Math.floor(index));
  };

  return (
    <View style={styles.container}>
      {data?.length > 0 && (
        <FlatList
          ref={flatlistRef}
          horizontal={true}
          data={data}
          renderItem={renderImageItem}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={16}
          pagingEnabled={true}
          snapToAlignment="center"
          onMomentumScrollEnd={onScrollHandle}
        />
      )}
      {data?.length > 1 && (
        <View style={styles.paginationContainer}>
          {data?.length > 0 &&
            data?.map((_, index) => (
              <TouchableOpacity
                onPress={() => {
                  scrollButton(index);
                }}
                key={index.toString()}
                style={{
                  ...styles.paginationDot,
                  backgroundColor:
                    index === cIndex ? globalStyles.themeBlue : '#EFF1FE',
                }}></TouchableOpacity>
            ))}
        </View>
      )}
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(25),
    width: '100%',
  },
  followedCommunityImage: {
    marginRight: responsiveWidth(2),
    height: responsiveHeight(22),
    width: responsiveWidth(93.2),
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(3),
    width: '100%',
  },
  paginationDot: {
    marginHorizontal: responsiveWidth(1.5),
    height: responsiveHeight(1.2),
    width: responsiveHeight(1.2),
    borderRadius: responsiveHeight(1),
    borderWidth: responsiveWidth(0.25),
    borderColor: globalStyles.themeBlue,
  },
});
