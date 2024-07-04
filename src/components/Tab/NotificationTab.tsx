import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import bellIcon from '../../assets/Icons/notification-blue.png';

interface NotificationTabProps {
  imageUri?: string;
  style?: ViewStyle;
  type?: string;
  message?: string;
  time?: string;
  onPress?: () => void;
  name?: string;
}

const NotificationTab: React.FC<NotificationTabProps> = ({
  imageUri,
  style,
  type = 'notification',
  message = 'You have a new messages from John…',
  time = '12:03pm',
  onPress = () => {},
  name = '',
}) => {
  const [icon, setIcon] = React.useState<any>();
  React.useEffect(() => {
    // iconHandler();
  }, [imageUri]);

  const iconHandler = () => {
    if (!imageUri) {
      let temp;
      if (type === 'community') {
        temp = require('../../assets/Icons/community-2.png');
      } else {
        temp = require('../../assets/Icons/notification-blue.png');
      }
      setIcon(temp);
    } else {
      setIcon(imageUri);
    }
  };
// console.log(imageUri)
  return (
    <Wrapper containerStyle={{...styes.wrapper, ...style}}>
      <TouchableOpacity style={styes.touch} onPress={onPress}>
        <View style={styes.imageContainer}>
          <Image
            source={{
              uri: imageUri
                ? imageUri
                : Image.resolveAssetSource(bellIcon)?.uri,
            }}
            resizeMode="contain"
            style={{height: imageUri ? responsiveHeight(5) : responsiveHeight(3), width: imageUri ? responsiveHeight(5) : responsiveHeight(3)}}
          />
        </View>
        <View style={styes.textContainer}>
          <Text style={styes.message}>{message}</Text>
          <Text style={styes.date}>{time}</Text>
        </View>
      </TouchableOpacity>
    </Wrapper>
  );
};

export default NotificationTab;

const styes = StyleSheet.create({
  wrapper: {
    paddingBottom: 0,
    paddingTop: 0,
    width: '100%',
    height: responsiveHeight(8),
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingHorizontal: responsiveWidth(2),
    paddingBottom: responsiveHeight(1),
    paddingTop: responsiveHeight(1),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(3),
    overflow: 'hidden',
    backgroundColor: globalStyles.veryLightGray,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingLeft: responsiveWidth(2),
    height: '100%',
  },
  message: {
    fontSize: responsiveFontSize(1.6),
    width: '100%',
    color: 'black',
    fontWeight: '400',
  },
  date: {
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(1.4),
    color: globalStyles.lightGray,
    fontWeight: '400',
  },
});
