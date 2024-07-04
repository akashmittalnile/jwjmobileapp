import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import FastImage from 'react-native-fast-image';
import userPic from '../../assets/Icons/user.png'

interface UserListItemProps {
  id: number;
  username: string;
  profileImage: string;
  onClick: (id: number) => void;
  clickable?: boolean;
  selected?: boolean;
}

const userPicIcon = Image.resolveAssetSource(userPic).uri

const UserListItem: React.FC<UserListItemProps> = ({
  id,
  username,
  profileImage,
  onClick,
  clickable = true,
  selected = false,
}) => {
  const [isClicked, setIsClicked] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (selected) {
      setIsClicked(true);
    }
  }, [selected]);

  const clickHandler = () => {
    if (!clickable) {
      return;
    }
    setIsClicked(value => !value);
    onClick && onClick(id);
  };
  return (
    <View
      style={{
        ...styles.userContainer,
        borderColor: isClicked ? globalStyles.themeBlue : globalStyles.midGray,
      }}>
      <TouchableOpacity
        disabled={!clickable}
        style={styles.touch}
        activeOpacity={0.5}
        onPress={clickHandler}>
        <View style={styles.profilePic}>
          <FastImage
            source={{uri: profileImage ? profileImage : userPicIcon, priority: FastImage.priority.high}}
            resizeMode={FastImage.resizeMode.cover}
            style={{height: '100%', width: '100%'}}
          />
        </View>
        <View>
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.tickContainer}>
          {isClicked && (
            <View style={styles.tickSubcontainer}>
              <Image
                source={require('../../assets/Icons/tick-circle.png')}
                style={{
                  height: responsiveHeight(3),
                  width: responsiveHeight(3),
                }}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(UserListItem);

const styles = StyleSheet.create({
  userContainer: {
    marginBottom: responsiveHeight(1),
    borderRadius: responsiveWidth(2),
    borderWidth: responsiveWidth(0.23),
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
  },
  profilePic: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(3),
    overflow: 'hidden',
  },
  username: {
    paddingLeft: responsiveWidth(2),
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
    letterSpacing: 0.8,
  },
  tickContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  tickSubcontainer: {
    width: responsiveHeight(3),
  },
});
