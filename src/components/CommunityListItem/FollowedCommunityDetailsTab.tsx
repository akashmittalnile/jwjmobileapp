import {
  View,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import ImageSlider from '../Slider/ImageSlider';
import IconButton from '../Button/IconButton';
import trash from '../../assets/Icons/trash.png';
import edit from '../../assets/Icons/edit.png';
import likeIcon from '../../assets/Icons/heart.png';
import likeBlueIcon from '../../assets/Icons/heart-blue.png';
import messageBlueIcon from '../../assets/Icons/message-blue.png';
import userIcon from '../../assets/Icons/user.png';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

interface FollowedCommunityTabProps {
  profilePic?: string;
  id: number;
  userName?: string;
  style?: ViewStyle;
  date?: string;
  imageUri?: string[];
  disable?: boolean;
  onPress?: (data: any) => void;
  title?: string;
  showMoreButton?: boolean;
  editHandler?: () => void;
  deleteHandler?: () => void;
  deletepostLoader?: boolean;
  isLiked: boolean;
  likes_count: number;
  comment_count: number;
}

const FollowedCommunityDetailsTab: React.FC<FollowedCommunityTabProps> = ({
  id,
  userName = '',
  style,
  date,
  imageUri = [],
  disable = false,
  onPress,
  title = '',
  showMoreButton = true,
  editHandler,
  deleteHandler,
  deletepostLoader = false,
  isLiked = false,
  likes_count = 0,
  comment_count = 0,
  profilePic,
}) => {
  const [show, setShow] = React.useState<boolean>(false);
  const userNameSignTemp = userName ? userName.split(' ') : [];
  // const userNameSign =
  //   userNameSignTemp.length > 0 ? userNameSignTemp[0][0] : '';
  const $userName = userName?.split(' ');
  const _userName = $userName?.reduce((acc, value) => {
    value = [...value][0]?.toUpperCase() + value.substring(1, value?.length);
    return acc + ' ' + value;
  }, '');

  const clickHandler = (data: any) => {
    if (onPress) {
      onPress(data);
    }
  };

  const editButtonHandler = () => {
    if (editHandler) {
      editHandler();
      setShow(value => !value);
    }
  };

  const deleteButtonHandler = () => {
    if (deleteHandler) {
      deleteHandler();
    }
  };

  const showButtonHandler = () => {
    setShow(value => !value);
  };

  return (
    <Wrapper containerStyle={{...styles.wrapper, ...style}}>
      <TouchableOpacity
        style={styles.touch}
        onPress={clickHandler}
        disabled={disable}
        activeOpacity={0.5}>
        {/* header */}
        <View style={styles.headerContainer}>
          <View style={styles.titleSignContainer}>
            {profilePic ? (
              <FastImage
                source={{uri: profilePic, priority: FastImage.priority.high}}
                style={{
                  height: responsiveHeight(5),
                  width: responsiveHeight(5),
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <FastImage
                source={{
                  uri: Image.resolveAssetSource(userIcon).uri,
                  priority: FastImage.priority.high,
                }}
                style={{
                  height: responsiveHeight(5),
                  width: responsiveHeight(5),
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              // <Text style={styles.titleSign}>{userNameSign}</Text>
            )}
          </View>
          <Text style={styles.title}>{_userName}</Text>
          <View style={styles.headerDateContainer}>
            <Text style={styles.date}>
              {' '}
              {moment(date, 'DD MMM, YYYY hh:mm A').format('MMM DD, YYYY') +
                ' ' +
                moment(date, 'DD MMM, YYYY hh:mm A').format('hh:mm A')}
            </Text>
          </View>
          {showMoreButton && (
            <View style={{position: 'relative'}}>
              <View>
                <TouchableOpacity
                  onPress={showButtonHandler}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: responsiveHeight(4),
                    width: responsiveHeight(4),
                  }}>
                  <Image
                    source={require('../../assets/Icons/more-circle-1.png')}
                    style={{
                      height: responsiveHeight(2.5),
                      width: responsiveHeight(2.5),
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* post image */}
        <View style={styles.followedCommunityImageContainer}>
          {Array.isArray(imageUri) && imageUri?.length > 0 && (
            <ImageSlider
              data={imageUri?.map((item: any) => item?.image)}
              imageStyle={{width: responsiveWidth(93)}}
            />
          )}
        </View>

        {/* bottom */}
        <View style={styles.bottom}>
          <View>
            <Text style={styles.postHeading}>{title}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <IconButton
              iconUri={
                Image.resolveAssetSource(isLiked ? likeBlueIcon : likeIcon).uri
              }
              onPress={() => {}}
              style={{
                paddingHorizontal: responsiveWidth(2),
                height: responsiveHeight(4),
                width: '45%',
                borderWidth: responsiveWidth(0.23),
                borderColor: 'rgba(0,0,0,0.2)',
              }}
              text={likes_count.toString()}
              disable={true}
            />
            <IconButton
              iconUri={Image.resolveAssetSource(messageBlueIcon).uri}
              onPress={() => {}}
              style={{
                paddingHorizontal: responsiveWidth(2),
                height: responsiveHeight(4),
                width: '45%',
                borderWidth: responsiveWidth(0.23),
                borderColor: 'rgba(0,0,0,0.2)',
              }}
              text={comment_count.toString()}
              disable={true}
            />
          </View>
        </View>
      </TouchableOpacity>
      {show && (
        <View style={styles.moreButtonContainer}>
          <IconButton
            onPress={() => {
              editButtonHandler();
            }}
            iconUri={Image.resolveAssetSource(edit).uri}
            style={styles.moreButton}
          />
          <IconButton
            onPress={deleteButtonHandler}
            iconUri={Image.resolveAssetSource(trash).uri}
            style={{...styles.moreButton, backgroundColor: 'red'}}
            loader={deletepostLoader}
          />
        </View>
      )}
    </Wrapper>
  );
};

export default React.memo(FollowedCommunityDetailsTab);

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: responsiveHeight(0),
    height: 'auto',
    width: '100%',
    borderRadius: responsiveWidth(2),
    paddingBottom: responsiveHeight(2),
  },
  touch: {
    // height: '100%',
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '3%',
    paddingVertical: responsiveHeight(1.2),
  },
  titleSignContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  titleSign: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
    color: globalStyles.themeBlue,
  },
  title: {
    flex: 1,
    textAlign: 'left',
    paddingLeft: responsiveWidth(2.5),
    color: 'black',
    fontSize: responsiveFontSize(1.7),
    letterSpacing: 0.8,
    fontWeight: '400',
  },
  headerDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  date: {
    fontSize: responsiveFontSize(1.2),
    color: globalStyles.midGray,
    fontWeight: '400',
    letterSpacing: 0.8,
  },
  tabMembersContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(1.2),
    height: responsiveHeight(5),
  },
  tabMemberContainer: {
    position: 'absolute',
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    marginRight: responsiveWidth(1),
    borderRadius: responsiveWidth(50),
    overflow: 'hidden',
  },
  memberImg: {
    height: '100%',
    width: 'auto',
  },
  followedCommunityImageContainer: {
    height: responsiveHeight(25),
    width: '100%',
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  followedCommunityImage: {
    height: '100%',
    width: '100%',
  },
  postHeading: {
    marginTop: responsiveHeight(1.2),
    width: '100%',
    paddingHorizontal: responsiveWidth(3),
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
    letterSpacing: 0.7,
  },
  moreButtonContainer: {
    position: 'absolute',
    top: responsiveHeight(5),
    right: 0,
    zIndex: 10000,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
  },
  moreButton: {
    marginBottom: responsiveHeight(0.5),
    height: responsiveHeight(5),
    width: responsiveWidth(20),
    backgroundColor: globalStyles.themeBlue,
  },
  bottom: {},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
});
