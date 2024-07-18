import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';

interface IconTabProps {
  style?: ViewStyle;
  imageUri?: string;
  imageStyle?: ImageStyle;
  text: string;
  percentage?: string;
  disable?: boolean;
  onPress?: (text: string) => void;
  showPercentage?: boolean;
  textStyle?: TextStyle;
  percentageStyle?: TextStyle;
}

const IconTab: React.FC<IconTabProps> = ({
  style,
  imageUri,
  text,
  percentage = '',
  imageStyle,
  disable = false,
  onPress,
  showPercentage = true,
  textStyle,
  percentageStyle,
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isSvg, setIsSvg] = useState<boolean>(false);

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

  const clickHandler = () => {
    if (onPress) {
      onPress(text);
    }
  };

  const image = React.useMemo(() => {
    if (!imageUri) return null;
    return isSvg && svgContent ? (
      <SvgXml
        xml={svgContent}
        height={responsiveHeight(7)}
        width={responsiveWidth(17)}
      />
    ) : (
      <FastImage
        source={{uri: imageUri, priority: FastImage.priority.high}}
        style={{
          height: responsiveHeight(7),
          width: responsiveWidth(17),
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  }, [imageUri, isSvg, svgContent]);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.touch}
        disabled={disable}
        onPress={clickHandler}>
        <View style={{height: responsiveHeight(7), width: responsiveWidth(17)}}>
          {image}
        </View>
        {text && (
          <Text numberOfLines={1} style={[styles.text, textStyle]}>
            {text}
          </Text>
        )}
        {showPercentage && (
          <Text
            style={[
              styles.text,
              {color: globalStyles.themeBlueText, fontWeight: '700'},
              percentageStyle,
            ]}>
            {`${Number(percentage)?.toFixed()}%`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(IconTab);

const styles = StyleSheet.create({
  container: {
    marginRight: responsiveWidth(2.5),
    paddingBottom: responsiveHeight(0.5),
    width: responsiveWidth(25),
    borderRadius: responsiveWidth(2),
    borderWidth: responsiveWidth(0.25),
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
    overflow: 'hidden',
  },
  touch: {
    alignItems: 'center',
    paddingTop: responsiveHeight(1),
  },
  text: {
    marginTop: responsiveHeight(0.1),
    paddingHorizontal: 2,
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: 'black',
  },
});

// /* eslint-disable react-native/no-inline-styles */
// /* eslint-disable prettier/prettier */
// import {
//   View,
//   Text,
//   StyleSheet,
//   ViewStyle,
//   Image,
//   ImageStyle,
//   TouchableOpacity,
// } from 'react-native';
// import React from 'react';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import {globalStyles} from '../../utils/constant';
// import SvgUri from 'react-native-svg-uri';
// import FastImage from 'react-native-fast-image';

// interface IconTabProps {
//   style?: ViewStyle;
//   imageUri?: string;
//   imageStyle?: ImageStyle;
//   text: string;
//   percentage?: string;
//   disable?: boolean;
//   onPress?: (text: string) => void;
//   showPercentage?: boolean;
// }
// const IconTab: React.FC<IconTabProps> = ({
//   style,
//   imageUri,
//   text,
//   percentage = '',
//   imageStyle,
//   disable = false,
//   onPress,
//   showPercentage = true,
// }) => {
//   const temp = imageUri?.split('.') || [];
//   const imageType = temp[temp?.length - 1];
//   const clickHandler = () => {
//     if (onPress) {
//       onPress(text);
//     }
//   };

//   const image = React.useMemo(() => {
//     return imageType == 'svg' ? (
//       <SvgUri
//         source={{uri: imageUri}}
//         height={responsiveHeight(7)}
//         width={responsiveWidth(17)}
//       />
//     ) : (
//       <FastImage
//         source={{uri: imageUri, priority: FastImage.priority.high}}
//         style={{
//           height: responsiveHeight(7),
//           width: responsiveWidth(17),
//         }}
//         resizeMode={FastImage.resizeMode.contain}
//       />
//     );
//   }, []);

//   return (
//     <View style={[styles.container, style]}>
//       <TouchableOpacity
//         style={styles.touch}
//         disabled={disable}
//         onPress={clickHandler}>
//         <View style={{height: responsiveHeight(7), width: responsiveWidth(17)}}>
//           {imageUri && image}
//         </View>
//         {text && (
//           <Text numberOfLines={1} style={styles.text}>
//             {text}
//           </Text>
//         )}
//         {showPercentage && (
//           <Text
//             style={[
//               styles.text,
//               {color: globalStyles.themeBlueText, fontWeight: '700'},
//             ]}>
//             {`${Number(percentage)?.toFixed()}%`}
//           </Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default React.memo(IconTab);

// const styles = StyleSheet.create({
//   container: {
//     marginRight: responsiveWidth(2.5),
//     paddingBottom: responsiveHeight(0.5),
//     width: responsiveWidth(25),
//     borderRadius: responsiveWidth(2),
//     borderWidth: responsiveWidth(0.25),
//     backgroundColor: 'white',
//     elevation: 3,
//     shadowColor: globalStyles.shadowColor,
//     overflow: 'hidden',
//   },
//   touch: {
//     alignItems: 'center',
//     paddingTop: responsiveHeight(1),
//   },
//   // img: {
//   //   height: '60%',
//   //   width: '70%',
//   // },
//   text: {
//     marginTop: responsiveHeight(0.1),
//     paddingHorizontal: 2,
//     fontSize: responsiveFontSize(1.6),
//     fontWeight: '500',
//     color: 'black',
//   },
// });
