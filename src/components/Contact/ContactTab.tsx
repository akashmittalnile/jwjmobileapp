import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Image,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import userPic from '../../assets/Icons/user.png';
import FastImage from 'react-native-fast-image';

interface ContactTabProps {
  profile?: string;
  name: string;
  date: string;
  enquiryText?: string;
  text: string;
  style?: ViewStyle;
  onPress: () => void;
  admin?: boolean;
}

const userPicPath = Image.resolveAssetSource(userPic).uri;

const ContactTab: React.FC<ContactTabProps> = ({
  name,
  profile,
  date,
  enquiryText,
  text,
  style,
  onPress,
  admin,
}) => {
  const [clicked, setClicked] = React.useState<boolean>(false);
  const clickHandler = () => {
    if (onPress) {
      onPress;
    }
    setClicked(value => !value);
  };
  
  return (
    <TouchableOpacity
      disabled={true}
      style={{
        ...styles.container,
        ...style,
        borderColor: globalStyles[admin ? 'themeBlue' : 'midGray'],
      }}
      onPress={clickHandler}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={{
              ...styles.nameSignContainer,
              backgroundColor: '#EFEFEF',
            }}>
           {profile ? <FastImage
              source={{
                uri: profile ? profile : '',
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
              style={{height: responsiveHeight(5), width: responsiveHeight(5)}}
            /> : <Text style={{fontSize: responsiveFontSize(2.4), color: globalStyles.themeBlue, fontWeight:'500'}}>{[...name][0]?.toUpperCase()}</Text>}
          </View>
          <View style={styles.leftHeaderTextContainer}>
            <Text
              style={{
                marginTop: responsiveHeight(0.3),
                color: 'black',
                fontSize: responsiveFontSize(1.6),
                fontWeight: '600',
              }}>
              {name}
            </Text>
            <Text
              style={{
                marginTop: responsiveHeight(0.3),
                color: globalStyles.midGray,
                fontSize: responsiveFontSize(1.6),
              }}>
              {date}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {enquiryText && (
            <View style={styles.plan}>
              <Text style={styles.planText}>{enquiryText}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ContactTab;

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveHeight(1.2),
    paddingBottom: responsiveHeight(1.2),
    borderColor: globalStyles.themeBlue,
    borderWidth: responsiveWidth(0.23),
    borderRadius: responsiveWidth(2),
    width: '95%',
  },
  nameSignContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(2),
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(3),
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
    marginTop: responsiveHeight(1),
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  nameSignText: {
    fontSize: responsiveFontSize(3),
    fontWeight: '600',
  },
  leftHeaderTextContainer: {
    justifyContent: 'flex-start',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  plan: {
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: responsiveWidth(1),
    backgroundColor: globalStyles.themeBlue,
  },
  planText: {
    color: 'white',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
  },
  text: {
    marginTop: responsiveHeight(1),
    paddingHorizontal: '3%',
    fontSize: responsiveFontSize(1.7),
    color: 'black',
    fontWeight: '400',
    opacity: 0.9,
    lineHeight: responsiveHeight(2),
    letterSpacing: 0.8,
  },
});
