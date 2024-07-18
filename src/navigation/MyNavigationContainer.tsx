import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import MainNavigation from './MainNavigation';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useAppDispatch, useAppSelector} from '../redux/Store';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {showImageViewerHandler} from '../redux/ImageViewerSlice';
import {globalStyles} from '../utils/constant';
import ReviewModal from '../components/Modal/ReviewModal';
import FastImage from 'react-native-fast-image';
import IconButton from '../components/Button/IconButton';
import cancelIcon from '../assets/Icons/close.png';
import cancelWhiteIcon from '../assets/Icons/close-white.png';

const MyNavigationContainer = () => {
  const dispatch = useAppDispatch();
  const [bgColor, setBgColor] = React.useState<boolean>(false);
  const {showImageViewer, uri} = useAppSelector(state => state.ImageViewer);
  const showReviewModal = useAppSelector(
    state => state.userDetails.showReviewModal,
  );
  const userDetails = useAppSelector(state => state.userDetails);

  const imageViewerHandler = () => {
    dispatch(showImageViewerHandler({show: false, uri: ['']}));
    setBgColor(value => !value);
  };

  return (
    <>
      <View style={styles.container}>
        <MainNavigation />
        {showImageViewer && (
          <View
            style={{
              ...styles._modalContainer,
              // backgroundColor: bgColor ? 'black' : 'white',
              backgroundColor: 'white'
            }}>
            <IconButton
              iconUri={
                // Image.resolveAssetSource(bgColor ? cancelWhiteIcon : cancelIcon)
                //   .uri
                Image.resolveAssetSource(cancelIcon)?.uri
              }
              onPress={imageViewerHandler}
              style={styles.close}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={{
                maxHeight: responsiveHeight(100),
                width: responsiveWidth(100),
              }}
              // onPress={() => {
              //   setBgColor(value => !value);
              // }}
              >
              <ScrollView horizontal pagingEnabled={true}>
                {uri?.map((uri: string, index: number) => (
                  <FastImage
                    key={index}
                    source={{uri, priority: FastImage.priority.high}}
                    style={{
                      height: responsiveHeight(80),
                      width: responsiveWidth(100),
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                ))}
              </ScrollView>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {showReviewModal && <ReviewModal />}
      {userDetails.homeScreenLoader && (
        <View style={styles.screenLoader}>
          <ActivityIndicator color={globalStyles.themeBlue} size="large" />
        </View>
      )}
    </>
  );
};

export default MyNavigationContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    height: responsiveHeight(100),
    width: responsiveWidth(100),
  },
  _modalContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touch: {
    height: '100%',
    width: '100%',
  },
  modalImage: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
  },
  close: {
    position: 'absolute',
    top: responsiveHeight(5),
    left: responsiveWidth(2),
    zIndex: 10000,
    height: responsiveHeight(5),
    width: responsiveHeight(5),
  },
  screenLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
