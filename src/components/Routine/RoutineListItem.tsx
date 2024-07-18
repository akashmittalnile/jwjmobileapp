/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import defaultImage from '../../assets/Icons/meditation.png';
import {SvgXml} from 'react-native-svg';
import moment from 'moment';

interface RoutineListItemProps {
  imageUri?: string;
  headerText?: string;
  headerDate?: string;
  descriptionHeading?: string;
  description?: string;
  onClick?: () => void;
  routineType?: string;
  sharedBy?: string;
}

const RoutineListItem: React.FC<RoutineListItemProps> = ({
  imageUri,
  headerText,
  headerDate,
  descriptionHeading,
  description,
  onClick,
  routineType = '',
  sharedBy,
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isSvg, setIsSvg] = useState<boolean>(false);
  const defaultImagePath = Image.resolveAssetSource(defaultImage).uri;

  useEffect(() => {
    if (imageUri && imageUri.endsWith('.svg')) {
      setIsSvg(true);
      fetch(imageUri)
        .then(response => response.text())
        .then(data => setSvgContent(data))
        .catch(error => {
          console.error('Error fetching SVG:', error);
          setSvgContent(null);
        });
    } else {
      setIsSvg(false);
    }
  }, [imageUri]);

  const onClickHandler = () => {
    if (onClick) {
      onClick();
    }
  };

  const statusHandler = (status: string) => {
    if (status === 'closed') {
      return (
        <View style={styles.status}>
          <Image
            source={require('../../assets/Icons/tick-green.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#82AD26'}}>Closed</Text>
        </View>
      );
    } else if (status === 'completed') {
      return (
        <View style={styles.status}>
          <Image
            source={require('../../assets/Icons/tick-green.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#82AD26', width: 'auto'}}>Completed</Text>
        </View>
      );
    } else if (status === 'progress') {
      return (
        <View style={{...styles.status, borderColor: globalStyles.themeBlue}}>
          <Image
            source={require('../../assets/Icons/progress.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: globalStyles.themeBlue}}>In-progress</Text>
        </View>
      );
    } else if (status === 'pending') {
      return (
        <View style={{...styles.status, borderColor: '#FFA412'}}>
          <Image
            source={require('../../assets/Icons/timer.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#FFA412'}}>Pending</Text>
        </View>
      );
    } else {
      return (
        <View style={{...styles.status, borderColor: globalStyles.midGray}}>
          <Text style={{color: 'black', paddingLeft: responsiveWidth(2)}}>
            {status}
          </Text>
        </View>
      );
    }
  };

  return (
    <Wrapper containerStyle={styles.wrapper}>
      <TouchableOpacity
        style={{justifyContent: 'space-between'}}
        onPress={onClickHandler}
        activeOpacity={0.5}>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: responsiveHeight(1),
          }}>
          <Text style={{marginLeft: responsiveWidth(3), color: 'black'}}>
            Status:{' '}
          </Text>
          {statusHandler(data?.status?.toLowerCase())}
        </View> */}
        <View style={styles.header}>
          <View style={styles.imgContainer}>
            <View style={styles.imageIconContainer}>
              {isSvg && svgContent ? (
                <SvgXml
                  xml={svgContent}
                  height={responsiveHeight(7)}
                  width={responsiveHeight(7)}
                />
              ) : (
                <Image
                  source={{uri: imageUri || defaultImagePath}}
                  resizeMode="contain"
                  style={{
                    height: responsiveHeight(7),
                    width: responsiveHeight(7),
                  }}
                />
              )}
            </View>
            <View>
              <Text style={styles.textBold}>{headerText}</Text>
              {routineType && (
                <Text style={{...styles.routineTypeText, fontWeight: '500'}}>
                  {routineType}
                </Text>
              )}
              {sharedBy && (
                <View
                  style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <Text style={{...styles.routineTypeText}}>by</Text>
                  <Text
                    style={{
                      ...styles.routineTypeText,
                      color: 'black',
                      marginLeft: responsiveWidth(1),
                    }}>
                    {sharedBy}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.text}>
            {moment(headerDate, 'DD MMM, YYYY hh:mm A').format('MMM DD, YYYY') +
              ' ' +
              moment(headerDate, 'DD MMM, YYYY hh:mm A').format('hh:mm A')}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: responsiveFontSize(1.6),
              fontWeight: '500',
              color: 'black',
              paddingLeft: responsiveWidth(2),
              marginTop: responsiveHeight(0.5),
            }}>
            {descriptionHeading && descriptionHeading}
          </Text>
          <Text
            style={{
              fontSize: responsiveFontSize(1.5),
              color: globalStyles.textGray,
              paddingLeft: responsiveWidth(2),
              marginTop: responsiveHeight(0.5),
              lineHeight: 20,
            }}>
            {description && description}
          </Text>
        </View>
      </TouchableOpacity>
    </Wrapper>
  );
};

export default RoutineListItem;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: responsiveHeight(2),
    paddingTop: responsiveHeight(1.2),
    paddingBottom: responsiveHeight(1.5),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  touch: {
    paddingBottom: responsiveHeight(1.5),
    height: '100%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '3%',
    width: '100%',
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: responsiveHeight(7),
    borderRadius: responsiveHeight(3.5),
  },
  imageIconContainer: {
    height: responsiveHeight(7),
    width: responsiveHeight(7),
    borderRadius: responsiveHeight(3.5),
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.07)',
  },
  img: {
    height: responsiveHeight(7),
    width: '100%',
  },
  textBold: {
    fontSize: responsiveFontSize(1.6),
    color: 'black',
    textAlignVertical: 'center',
    marginLeft: responsiveWidth(2),
    width: responsiveWidth(40),
  },
  text: {
    fontSize: responsiveFontSize(1.4),
    color: globalStyles.lightGray,
    textAlignVertical: 'center',
  },
  routineTypeText: {
    marginTop: responsiveHeight(0),
    marginLeft: responsiveWidth(2),
    color: globalStyles.themeBlue,
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.3),
    paddingRight: responsiveWidth(2.5),
    borderWidth: responsiveWidth(0.2),
    borderRadius: responsiveWidth(1),
    borderColor: '#82AD26',
  },
  icon: {
    height: responsiveHeight(1.7),
    width: responsiveWidth(8),
  },
});

// /* eslint-disable react-native/no-inline-styles */
// /* eslint-disable prettier/prettier */
// import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
// import React from 'react';
// import Wrapper from '../Wrapper/Wrapper';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import {globalStyles} from '../../utils/constant';
// import defaultImage from '../../assets/Icons/meditation.png';
// import SvgUri from 'react-native-svg-uri';
// import moment from 'moment';

// interface RoutineListItemProps {
//   imageUri?: string;
//   headerText?: string;
//   headerDate?: string;
//   descriptionHeading?: string;
//   description?: string;
//   onClick?: () => void;
//   routineType?: string;
// }

// const RoutineListItem: React.FC<RoutineListItemProps> = ({
//   imageUri,
//   headerText,
//   headerDate,
//   descriptionHeading,
//   description,
//   onClick,
//   routineType = '',
// }) => {
//   const defaultImagePath = Image.resolveAssetSource(defaultImage).uri;
//   const onClickHandler = () => {
//     if (onClick) {
//       onClick();
//     }
//   };

//   return (
//     <Wrapper containerStyle={styles.wrapper}>
//       <TouchableOpacity
//         style={{justifyContent: 'space-between'}}
//         onPress={onClickHandler}
//         activeOpacity={0.5}>
//         <View style={styles.header}>
//           <View style={styles.imgContainer}>
//             <View style={styles.imageIconContainer}>
//               {imageUri ? (
//                 <SvgUri
//                   source={{uri: imageUri}}
//                   height={responsiveHeight(7)}
//                   width={responsiveHeight(7)}
//                 />
//               ) : (
//                 <Image
//                   source={{uri: defaultImagePath}}
//                   resizeMode="contain"
//                   style={{
//                     height: responsiveHeight(7),
//                     width: responsiveHeight(7),
//                   }}
//                 />
//               )}
//             </View>
//             <View>
//               <Text style={styles.textBold}>{headerText}</Text>
//               {routineType && (
//                 <Text style={styles.routineTypeText}>{routineType}</Text>
//               )}
//             </View>
//           </View>
//           <Text style={styles.text}>
//             {' '}
//             {moment(headerDate, 'DD MMM, YYYY hh:mm A').format('MMM DD, YYYY') +
//               ' ' +
//               moment(headerDate, 'DD MMM, YYYY hh:mm A').format('hh:mm A')}
//           </Text>
//         </View>
//         <View>
//           <Text
//             style={{
//               fontSize: responsiveFontSize(1.6),
//               fontWeight: '500',
//               color: 'black',
//               paddingLeft: responsiveWidth(2),
//               marginTop: responsiveHeight(0.5),
//             }}>
//             {descriptionHeading && descriptionHeading}
//           </Text>
//           <Text
//             style={{
//               fontSize: responsiveFontSize(1.5),
//               color: globalStyles.textGray,
//               paddingLeft: responsiveWidth(2),
//               marginTop: responsiveHeight(0.5),
//               lineHeight: 20,
//             }}>
//             {description && description}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     </Wrapper>
//   );
// };

// export default RoutineListItem;

// const styles = StyleSheet.create({
//   wrapper: {
//     marginTop: responsiveHeight(2),
//     paddingTop: responsiveHeight(1.2),
//     paddingBottom: responsiveHeight(1.5),
//     width: '100%',
//     borderRadius: responsiveWidth(2),
//   },
//   touch: {
//     paddingBottom: responsiveHeight(1.5),
//     height: '100%',
//     width: '100%',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: '3%',
//     width: '100%',
//   },
//   imgContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     height: responsiveHeight(7),
//     borderRadius: responsiveHeight(3.5),
//   },
//   imageIconContainer: {
//     height: responsiveHeight(7),
//     width: responsiveHeight(7),
//     borderRadius: responsiveHeight(3.5),
//     overflow: 'hidden',
//     backgroundColor: 'rgba(0,0,0,0.07)',
//   },
//   img: {
//     height: responsiveHeight(7),
//     width: '100%',
//   },
//   textBold: {
//     fontSize: responsiveFontSize(1.6),
//     color: 'black',
//     textAlignVertical: 'center',
//     marginLeft: responsiveWidth(2),
//     width: responsiveWidth(40),
//   },
//   text: {
//     fontSize: responsiveFontSize(1.4),
//     color: globalStyles.lightGray,
//     textAlignVertical: 'center',
//   },
//   routineTypeText: {
//     marginTop: responsiveHeight(0.3),
//     marginLeft: responsiveWidth(2),
//     color: globalStyles.themeBlue,
//     fontSize: responsiveFontSize(1.5),
//     fontWeight: '500',
//   },
// });
