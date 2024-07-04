import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import FastImage from 'react-native-fast-image';
import {useAppSelector} from '../../redux/Store';
import userIcon from '../../assets/Icons/user.png';

interface ChatProps {
  userName: string;
  own?: boolean;
  chat: string;
  time: string;
}

const ChatSection: React.FC<ChatProps> = ({
  userName = '',
  own = true,
  chat = '',
  time = '',
}) => {
  const userDetails = useAppSelector(state => state.userDetails);
  const _username = [...userName];
  _username[0] = _username[0]?.toUpperCase();

  return (
    <View
      style={{...styles.container, alignSelf: own ? 'flex-end' : 'flex-start'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {own && (
          <View
            style={{
              marginRight: responsiveWidth(1),
              height: responsiveHeight(5),
              width: responsiveHeight(5),
              borderRadius: responsiveHeight(2.5),
              overflow: 'hidden',
            }}>
            <FastImage
              source={{
                uri: userDetails?.profileImage
                  ? userDetails?.profileImage
                  : Image.resolveAssetSource(userIcon)?.uri,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
              style={{height: responsiveHeight(5), width: responsiveHeight(5)}}
            />
          </View>
        )}
        <View
          style={{
            ...styles.chatContainer,
            borderBottomRightRadius: own ? 0 : responsiveWidth(5),
            borderBottomLeftRadius: own ? responsiveWidth(5) : 0,
          }}>
          <Text
            style={{
              ...styles.userName,
              color: own ? 'black' : globalStyles.themeBlue,
              opacity: own ? 0.7 : 1,
            }}>
            {_username}
          </Text>
          <Text style={styles.chat}>{chat}</Text>
        </View>
        {!own && (
          <View
            style={{
              marginLeft: responsiveWidth(1),
              height: responsiveHeight(5),
              width: responsiveHeight(5),
              borderRadius: responsiveHeight(2.5),
              overflow: 'hidden',
            }}>
            <FastImage
              source={{
                uri: userDetails?.adminProfileImage
                  ? userDetails?.adminProfileImage
                  : Image.resolveAssetSource(userIcon)?.uri,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
              style={{height: responsiveHeight(5), width: responsiveHeight(5)}}
            />
          </View>
        )}
      </View>
      {time && (
        <Text style={{...styles.time, textAlign: own ? 'right' : 'left'}}>
          {time}
        </Text>
      )}
    </View>
  );
};

export default ChatSection;

const styles = StyleSheet.create({
  container: {
    marginBottom: responsiveHeight(1.5),
    marginHorizontal: responsiveWidth(5),
    width: responsiveWidth(68),
  },
  chatContainer: {
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
    width: responsiveWidth(55),
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: 'rgba(137, 137, 137, .25)',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderTopRightRadius: responsiveWidth(5),
    borderTopLeftRadius: responsiveWidth(5),
  
  },
  userName: {
    marginBottom: responsiveHeight(0.7),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '700',
    color: globalStyles.themeBlue,
  },
  chat: {
    color: 'black',
    opacity: 0.7,
    lineHeight: responsiveHeight(2.3),
    letterSpacing: 0.7,
  },
  time: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.4),
    color: 'black',
    opacity: 0.6,
  },
});
