import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  View,
  Platform,
  ScrollView,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import ImagePicker from 'react-native-image-crop-picker';
import {globalStyles} from '../../utils/constant';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FastImage from 'react-native-fast-image';

interface UploadPictureProps {
  onClick: (result: any) => void;
  style?: ViewStyle;
  placeholder?: string;
  uri?: {}[] | [];
  multipleImage?: boolean;
  cropingDetails?: {height: number; width: number; cropping: boolean};
  onRemoveInitialImage?: (id: number) => void;
  disable?: boolean;
}

const UploadPicture: React.FC<UploadPictureProps> = ({
  onClick,
  style,
  placeholder = 'Upload Pictures',
  uri,
  multipleImage,
  cropingDetails,
  onRemoveInitialImage,
  disable = false,
}) => {
  const [imageUrl, setImageUrl] = React.useState<
    {
      uri: string | undefined;
      type: string | undefined;
      filename: string | undefined;
    }[]
  >([]);

  React.useEffect(() => {
    if (uri) {
      setImageUrl(uri);
    }
  }, [uri]);

  const imagePicker = async () => {
    try {
      const result = cropingDetails?.height
        ? await ImagePicker.openPicker({
            ...cropingDetails,
            multiple: multipleImage,
            maxFiles: 100,
            forceJpg: true
          })
        : await ImagePicker.openPicker({
            width: responsiveHeight(30),
            height: responsiveHeight(30),
            cropping: true,
            multiple: multipleImage,
            forceJpg: true
          });
      // for (let i = 0; Array.isArray(result) && i < result?.length; i++) {
      //   if (Platform.OS === 'ios') {
      //     if (
      //       result[i]?.filename?.includes('JPG') ||
      //       result[i]?.filename?.includes('JPEG') ||
      //       result[i]?.filename?.includes('PNG')
      //     ) {
      //       continue;
      //     } else {
      //       Toast.show({
      //         type: 'error',
      //         text1: 'Only JPEG, JPG & PNG format are allowed',
      //       });
      //       return;
      //     }
      //   } else if (Platform.OS === 'android') {
      //     if (
      //       result[i]?.filename?.includes('jpg') ||
      //       result[i]?.filename?.includes('jpeg') ||
      //       result[i]?.filename?.includes('png')
      //     ) {
      //       continue;
      //     } else {
      //       Toast.show({
      //         type: 'error',
      //         text1: 'Only JPEG, JPG & PNG format are allowed',
      //       });
      //       return;
      //     }
      //   }
      // }
      if (Array.isArray(result)) {
        if (multipleImage) {
          const _result = result?.map(item => ({
            ...item,
            uri: Platform.OS === 'ios' ? item?.sourceURL : item?.path,
            type: item?.mime,
            filename:
              Platform.OS === 'ios' ? item?.filename : item?.modificationDate,
          }));
          setImageUrl(preData => {
            return [...preData, ..._result];
          });
          onClick([...imageUrl, ..._result]);
        }
      } else {
        onClick([
          {
            uri: Platform.OS === 'ios' ? result?.sourceURL : result?.path,
            type: result?.mime,
            filename:
              Platform.OS === 'ios'
                ? result?.filename
                : result?.modificationDate,
          },
        ]);
        setImageUrl([
          {
            uri: Platform.OS === 'ios' ? result?.sourceURL : result?.path,
            type: result?.mime,
            filename:
              Platform.OS === 'ios'
                ? result?.filename
                : result?.modificationDate,
          },
        ]);
      }
    } catch (err: any) {
      console.log('err in image picker', err);
      onClick(imageUrl);
    }
  };

  const cancelImageHandler = (value: number, item: any) => {
    const temp = imageUrl.filter((item: any, index: number) => index !== value);
    setImageUrl(temp);
    onClick(temp);
    if (onRemoveInitialImage) {
      if (item?.id) onRemoveInitialImage(item?.id);
    }
  };

  return (
    <>
      <Wrapper containerStyle={{...styles.wrapper, ...style}}>
        <TouchableOpacity
          style={styles.imagePickerTouch}
          onPress={imagePicker}
          disabled={true}>
          <View
            style={{
              flex: 8,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              height: '100%',
            }}>
            {imageUrl[0]?.uri ? (
              <ScrollView
                horizontal={true}
                style={{
                  height: '100%',
                  width: 'auto',
                }}>
                {imageUrl?.map((item: any, index: number) => (
                  <View
                    key={index.toString()}
                    style={{position: 'relative', alignSelf: 'center'}}>
                    <TouchableOpacity
                      disabled={disable}
                      onPress={imagePicker}
                      style={{position: 'relative', alignSelf: 'center'}}>
                      <FastImage
                        key={index?.toString()}
                        source={{
                          uri: item?.uri,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                    {multipleImage && (
                      <TouchableOpacity
                        disabled={disable}
                        style={styles.cancelTouch}
                        onPress={() => {
                          cancelImageHandler(index, item);
                        }}>
                        <Image
                          source={require('../../assets/Icons/cancel.png')}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Image
                source={require('../../assets/Icons/gallery.png')}
                resizeMode="contain"
                style={styles.img}
              />
            )}
            {(imageUrl.length === 0 || !multipleImage) && (
              <Text
                style={{
                  flex: 4,
                  color: globalStyles.textGray,
                  marginLeft: '1%',
                }}>
                {placeholder}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: responsiveHeight(8),
            width: '15%',
            borderLeftColor: 'rgba(0,0,0,0.2)',
            borderLeftWidth: responsiveWidth(0.2),
          }}>
          <TouchableOpacity
            disabled={disable}
            onPress={imagePicker}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}>
            <Image
              source={require('../../assets/Icons/upload.png')}
              resizeMode="contain"
              style={styles.img}
            />
            <Text
              style={{
                fontSize: responsiveHeight(1.4),
                fontWeight: '500',
                color: 'gray',
              }}>
              Click
            </Text>
          </TouchableOpacity>
        </View>
      </Wrapper>
      {/* <Text style={styles.note}>
        Note: Only JPEG, JPG & PNG format are allowed
      </Text> */}
    </>
  );
};

export default UploadPicture;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    width: '100%',
    elevation: 2,
    paddingTop: 0,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  imagePickerTouch: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: '2%',
    height: responsiveHeight(8),
    width: '85%',
  },
  image: {
    height: responsiveHeight(5),
    width: responsiveWidth(10),
    marginRight: responsiveWidth(4),
  },
  img: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
    marginRight: '2%',
  },
  cancelTouch: {
    position: 'absolute',
    top: responsiveHeight(-1),
    right: responsiveHeight(0),
    height: responsiveHeight(3),
    width: responsiveHeight(3),
    borderRadius: responsiveHeight(1),
  },
  icon: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
    borderRadius: responsiveHeight(1),
  },
  note: {
    marginLeft: responsiveWidth(1),
    marginTop: responsiveHeight(1),
    color: 'black',
    fontSize: responsiveFontSize(1.5),
  },
});
