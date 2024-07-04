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
import BorderBtn from '../Button/BorderBtn';
import {globalStyles} from '../../utils/constant';
import IconButton from '../Button/IconButton';
import edit from '../../assets/Icons/edit.png';
import trash from '../../assets/Icons/trash.png';
import userIcon from '../../assets/Icons/user.png';
import FastImage from 'react-native-fast-image';
import {PostApiWithToken, endPoint} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import {reloadHandler} from '../../redux/ReloadScreen';
import ScreenNames from '../../utils/ScreenNames';
import Toast from 'react-native-toast-message';

interface FollowedCommunityTabProps {
  id?: number;
  profilePic?: string;
  headerTitle?: string;
  totleFollowers?: number;
  style?: ViewStyle;
  postHandler: () => void;
  unfollowHandler?: () => void;
  unfollowHandlerCallback?: () => void;
  onClickTab?: () => void;
  followingBtnText?: string;
  disablePostButton?: boolean;
  disableFollowButton?: boolean;
  images?: [] | undefined;
  memberImages?: [] | undefined;
  showPostButton?: boolean;
  showDeleteButton?: boolean;
  deleteHandler?: () => void;
  followersModalHandler?: () => void;
  totalPost?: number;
  showFollowButton?: boolean;
  styleTouch?: ViewStyle;
  editHandler?: () => void;
  showEditButton?: boolean;
}

const FollowedCommunityTab: React.FC<FollowedCommunityTabProps> = ({
  id,
  profilePic = '',
  headerTitle = '',
  totleFollowers = 0,
  style,
  postHandler,
  unfollowHandler,
  unfollowHandlerCallback,
  onClickTab,
  followingBtnText = 'Unfollow',
  disablePostButton = false,
  disableFollowButton = false,
  images = [],
  memberImages = [],
  showPostButton = true,
  showDeleteButton = true,
  deleteHandler,
  followersModalHandler,
  totalPost = 0,
  showFollowButton = true,
  styleTouch,
  editHandler,
  showEditButton = false,
}) => {
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload);
  const dispatch = useAppDispatch();
  const [loader, setLoader] = React.useState<boolean>(false);

  const deleteBtnHandler = () => {
    if (deleteHandler) {
      deleteHandler();
    }
  };

  const editBtnHandler = () => {
    if (editHandler) {
      editHandler();
    }
  };

  const _unfollowHandler = async () => {
    setLoader(true);
    if (unfollowHandler) {
      unfollowHandler();
    } else {
      try {
        const response = await PostApiWithToken(
          endPoint.followUnfollow,
          {community_id: id, status: 0},
          token,
        );
        if (response?.data?.status) {
          dispatch(
            reloadHandler({
              [ScreenNames.Community]: !reload.Community,
              [ScreenNames.Home]: !reload.Home,
            }),
          );
          unfollowHandlerCallback && unfollowHandlerCallback()
        }
        Toast.show({
          type: response?.data?.status ? 'success' : 'error',
          text1: response?.data?.message,
        });
      } catch (err: any) {
        console.log('following handler on community details page', err.message);
      } finally {
        setLoader(false);
      }
    }
  };

  const _onClickTab = () => {
    onClickTab && onClickTab();
  };

  return (
    <Wrapper containerStyle={{...styles.wrapper, ...style}}>
      {/* header */}
      <TouchableOpacity
        disabled={(disableFollowButton && disablePostButton) || loader}
        style={[styles.touch]}
        onPress={_onClickTab}
        activeOpacity={1}>
        <View style={styles.headerContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <View style={styles.titleSignContainer}>
              {images?.length > 0 ? (
                <FastImage
                  style={{
                    width: responsiveHeight(5),
                    height: responsiveHeight(5),
                    borderRadius: responsiveHeight(5),
                  }}
                  source={{
                    uri: images[0],
                    priority: FastImage.priority.high,
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
                // <Text style={styles.titleSign}>{headerTitleSign}</Text>
              )}
            </View>
            <Text style={styles.title}>{headerTitle}</Text>
          </View>
          <View style={styles.headerButtonsContainer}>
            {showPostButton && (
              <BorderBtn
                disable={disablePostButton}
                buttonText="Post"
                onClick={postHandler}
                containerStyle={styles.headerButton}
                buttonTextStyle={styles.headerButtonText}
              />
            )}
            {showFollowButton && (
              <BorderBtn
                loader={loader}
                disable={disableFollowButton || loader}
                buttonText={followingBtnText}
                onClick={_unfollowHandler}
                containerStyle={styles.headerButton}
                buttonTextStyle={styles.headerButtonText}
              />
            )}
            {showEditButton && (
              <IconButton
                onPress={editBtnHandler}
                iconUri={Image.resolveAssetSource(edit).uri}
                style={{
                  ...styles.headerButton,
                  backgroundColor: '#3DA1E3',
                  width: responsiveWidth(6),
                }}
              />
            )}
            {showDeleteButton && (
              <IconButton
                onPress={deleteBtnHandler}
                iconUri={Image.resolveAssetSource(trash).uri}
                style={{
                  ...styles.headerButton,
                  backgroundColor: 'red',
                  width: responsiveWidth(6),
                }}
              />
            )}
          </View>
        </View>

        {/* followers */}
        <View style={styles.tabMembersContainer}>
          <TouchableOpacity
            style={{...styles.touch1, ...styleTouch}}
            onPress={followersModalHandler}>
            <View>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.7),
                  fontWeight: '500',
                  color: globalStyles.themeBlue,
                }}>
                {`${totalPost} Posts`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: responsiveWidth(37),
              }}>
              {totleFollowers > 0 && (
                <View
                  style={{
                    position: 'relative',
                    height: responsiveHeight(4),
                    width: responsiveHeight(5),
                  }}>
                  {memberImages?.length > 2 && (
                    <View style={{...styles.tabMemberContainer}}>
                      <FastImage
                        source={{
                          uri: memberImages[memberImages?.length - 3],
                          priority: FastImage.priority.high,
                        }}
                        style={[styles.memberImg, {zIndex: 1000}]}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </View>
                  )}
                  {memberImages?.length > 1 && (
                    <View
                      style={{
                        ...styles.tabMemberContainer,
                        left: responsiveWidth(1.5),
                      }}>
                      <FastImage
                        source={{
                          uri: memberImages[memberImages?.length - 2],
                          priority: FastImage.priority.high,
                        }}
                        style={[styles.memberImg, {zIndex: 1000}]}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </View>
                  )}
                  {memberImages?.length > 0 && (
                    <View
                      style={{
                        ...styles.tabMemberContainer,
                        left: responsiveWidth(3),
                      }}>
                      <FastImage
                        source={{
                          uri: memberImages[memberImages?.length - 1],
                          priority: FastImage.priority.high,
                        }}
                        style={[styles.memberImg, {zIndex: 2000}]}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </View>
                  )}
                </View>
              )}
              <Text
                style={{
                  flex: 7,
                  color: 'black',
                  marginLeft: responsiveWidth(2),
                }}>
                {totleFollowers === 0 ? 'No' : totleFollowers} Followers
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Wrapper>
  );
};

export default React.memo(FollowedCommunityTab);

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: responsiveHeight(0),
    width: '100%',
    borderRadius: responsiveWidth(2),
    backgroundColor: 'white',
  },
  touch: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '3%',
    paddingVertical: responsiveHeight(1.2),
    borderBottomWidth: responsiveWidth(0.1),
    borderBottomColor: globalStyles.lightGray,
  },
  titleSignContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
    backgroundColor: '#F0F0F0',
  },
  titleSign: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
    color: globalStyles.themeBlue,
  },
  title: {
    flex: 1,
    textAlign: 'left',
    paddingLeft: responsiveWidth(2),
    color: 'black',
    fontSize: responsiveFontSize(1.7),
    letterSpacing: 0.8,
    fontWeight: '400',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerButton: {
    marginLeft: responsiveWidth(1),
    paddingHorizontal: responsiveWidth(2),
    height: responsiveHeight(3.3),
    width: responsiveWidth(18),
    backgroundColor: '#3DA1E3',
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    borderRadius: responsiveWidth(1.5),
  },
  headerButtonText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '500',
  },
  tabMembersContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabMemberContainer: {
    position: 'absolute',
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveHeight(2),
    overflow: 'hidden',
  },
  memberImg: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
  },
  touch1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: responsiveHeight(1.2),
    paddingLeft: responsiveWidth(3),
    // paddingBottom: responsiveHeight(2),
    width: '100%',
  },
});
