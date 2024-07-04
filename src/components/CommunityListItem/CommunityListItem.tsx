/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import React, {ReactNode} from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import edit from '../../assets/Icons/edit.png';
import deleteIcon from '../../assets/Icons/trash.png';
import userIcon from '../../assets/Icons/user.png';
import IconButton from '../Button/IconButton';
import FastImage from 'react-native-fast-image';
import {DeleteApi, endPoint} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import {reloadHandler} from '../../redux/ReloadScreen';
import ScreenNames from '../../utils/ScreenNames';
import Toast from 'react-native-toast-message';
import DeleteModal from '../Modal/DeleteModal';
import {PostApiWithToken} from '../../services/Service';
import {followedCommunityHandler} from '../../redux/TrackNumbers';
import {useNavigation} from '@react-navigation/native';

interface CommunityListItemProps {
  headerHeading?: string;
  headerHeadingStyle?: TextStyle;
  headerButtonText?: string;
  onClick?: (value: boolean, message: string) => void;
  isFollow?: boolean;
  planPrice?: string;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  disableButton?: boolean;
  id: string;
  loader?: boolean;
  headerRightButtonLoader?: boolean;
  memberCount?: number;
  memberImages?: [];
  images?: string[];
  planName?: string;
  totalPost?: number;
  onPress?: () => void;
  editButtonHandler?: () => void;
  showFollowButton?: boolean;
  myCommunity: number;
}

const CommunityListItem: React.FC<CommunityListItemProps> = ({
  id,
  headerHeading,
  headerButtonText = 'Follow',
  onClick = () => {},
  isFollow = false,
  planPrice = 'Free',
  showEditButton = false,
  showDeleteButton = false,
  disableButton = false,
  loader = false,
  headerRightButtonLoader = false,
  memberCount = 0,
  memberImages = [],
  images = [],
  planName = '',
  totalPost = 0,
  onPress,
  editButtonHandler,
  showFollowButton = true,
  myCommunity,
}) => {
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [imagesNode, setImagesNode] = React.useState<string[]>([]);
  let profileName = '';
  const [deleteLoader, setDeleteLoader] = React.useState<{
    loader: boolean;
    showDeleteModal: boolean;
  }>({loader: false, showDeleteModal: false});
  const [follow, setFollow] = React.useState<{
    loader: boolean;
    isFollow: boolean;
  }>({loader: false, isFollow: false});

  React.useEffect(() => {
    const temp: any[] = [];
    setFollow(preValue => ({...preValue, isFollow}));
    for (let i = 1; i < images.length; i++) {
      if (i === 4) {
        break;
      }
      temp.push(
        <View style={styles.tabImgContainer} key={i.toString()}>
          <Image
            source={{uri: images[i]}}
            style={styles.tabImg}
            resizeMode="cover"
          />
        </View>,
      );
    }
    setImagesNode(temp);
  }, []);

  if (headerHeading) {
    const temp = headerHeading.split(' ');
    profileName = temp.reduce(
      (name, item) => name + item[0]?.toUpperCase(),
      '',
    );
  }

  const followinHandler = async () => {
    setFollow(preValue => ({...preValue, loader: true}));
    try {
      const response = await PostApiWithToken(
        endPoint.followUnfollow,
        {community_id: id, status: !follow.isFollow ? 1 : 0},
        token,
      );
      if (response?.data?.status) {
        dispatch(reloadHandler({[ScreenNames.Home]: !reload.Home}))
        onClick && onClick(!follow.isFollow, response?.data?.message);
        setFollow(preValue => ({...preValue, isFollow: !preValue.isFollow}));
      }
    } catch (err: any) {
      console.log('err in following handler of community', err.message);
    } finally {
      setFollow(preValue => ({...preValue, loader: false}));
    }
  };

  const headerRightButton = () => {
    // setHeaderRightBtnLoader(value => !value);
    followinHandler();
    // setHeaderRightBtnLoader(value => !value);
  };

  const delteCommunityHandler = async () => {
    setDeleteLoader(preData => ({...preData, loader: true}));
    try {
      if (id) {
        const response = await DeleteApi(
          `${endPoint.deletCommunity}?id=${id}`,
          token,
        );
        if (response?.data?.status) {
          dispatch(reloadHandler({[ScreenNames.Community]: !reload.Community}));
        }
        Toast.show({
          type: response?.data?.status ? 'success' : 'error',
          text1: response?.data?.message,
        });
      }
    } catch (err: any) {
      console.log('err in deleting commmunity', err?.message);
    } finally {
      setDeleteLoader({showDeleteModal: false, loader: false});
    }
  };

  const goToFollowedCommunityDetails = () => {
    if (follow?.isFollow || myCommunity) {
      navigation.navigate(ScreenNames.FollowedCommunityDetails, {
        community_id: id,
      });
    } else {
      Toast.show({
        type: 'info',
        text1: 'Please follow community first',
      });
    }
  };

  return (
    <>
      <Wrapper containerStyle={styles.wrapper}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={goToFollowedCommunityDetails}
          disabled={follow.loader}>
          <View>
            {/* header */}
            <View style={styles.header}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '55%',
                }}>
                <View
                  style={{
                    // height: responsiveHeight(5),
                    width: responsiveHeight(5),
                    borderRadius: responsiveHeight(3),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: globalStyles.veryLightGray,
                  }}>
                  {images?.length > 0 ? (
                    <FastImage
                      source={{
                        uri: images[0],
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                      style={{
                        height: responsiveHeight(5),
                        width: responsiveHeight(5),
                        borderRadius: responsiveHeight(3),
                      }}
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
                    // <Text
                    //   style={{
                    //     color: globalStyles.themeBlueText,
                    //     fontWeight: '500',
                    //   }}>
                    //   {profileName}
                    // </Text>
                  )}
                </View>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: '500',
                    marginLeft: responsiveWidth(2),
                    width: '70%',
                  }}>
                  {headerHeading}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                {showEditButton && (
                  <View
                    style={{
                      height: responsiveHeight(4),
                      ...globalStyles.shadowStyle,
                      marginRight: responsiveWidth(1),
                    }}>
                    {
                      <IconButton
                        onPress={() => {
                          editButtonHandler && editButtonHandler();
                        }}
                        iconUri={Image.resolveAssetSource(edit).uri}
                        style={styles.moreButton}
                      />
                      // <TouchableOpacity
                      //   disabled={loader}
                      //   style={{...styles.touch, backgroundColor: 'red'}}
                      //   onPress={onClick}>
                      //   <Text style={styles.buttonText}>{headerButtonText}</Text>
                      // </TouchableOpacity>
                    }
                  </View>
                )}
                {showDeleteButton && (
                  <View
                    style={{
                      height: responsiveHeight(4),
                      ...globalStyles.shadowStyle,
                      marginRight: responsiveWidth(1),
                    }}>
                    {
                      <IconButton
                        onPress={() => {
                          showDeleteButton &&
                            setDeleteLoader(preData => ({
                              ...preData,
                              showDeleteModal: true,
                            }));
                        }}
                        iconUri={Image.resolveAssetSource(deleteIcon).uri}
                        style={{...styles.moreButton, backgroundColor: 'red'}}
                      />
                      // <TouchableOpacity
                      //   disabled={loader}
                      //   style={{...styles.touch, backgroundColor: 'red'}}
                      //   onPress={onClick}>
                      //   <Text style={styles.buttonText}>{headerButtonText}</Text>
                      // </TouchableOpacity>
                    }
                  </View>
                )}
                {showFollowButton && (
                  <View
                    style={{
                      ...globalStyles.shadowStyle,
                      height: responsiveHeight(4),
                    }}>
                    <TouchableOpacity
                      disabled={follow.loader}
                      style={{
                        ...styles.touch,
                        backgroundColor:
                          globalStyles[disableButton ? 'midGray' : 'themeBlue'],
                        opacity: disableButton ? 0.6 : 1,
                      }}
                      onPress={headerRightButton}>
                      {follow.loader ? (
                        <ActivityIndicator
                          color="white"
                          style={{width: responsiveWidth(17)}}
                        />
                      ) : (
                        <Text style={styles.buttonText}>
                          {/* {headerButtonText} */}
                          {follow.isFollow ? 'Unfollow' : 'Follow'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* tab images */}
            {imagesNode?.length > 0 && (
              <View style={styles.tabImgsContainer}>{imagesNode}</View>
            )}

            {/* plan */}

            <View style={styles.planContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 2,
                  height: '100%',
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.7),
                    fontWeight: '500',
                    letterSpacing: 0.8,
                    color: globalStyles.themeBlue,
                  }}>{`${totalPost} Posts`}</Text>
                {/* <View style={styles.imgContainer}>
              <Image
                source={require('../../assets/Icons/plan.png')}
                resizeMode="contain"
                style={styles.img}
              />
            </View>
            <View style={{marginLeft: responsiveWidth(2)}}>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.6),
                  fontWeight: '500',
                  color: 'black',
                  marginBottom: responsiveHeight(0.5),
                }}>
                {planName}
              </Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.3),
                  color: 'black',
                }}>
                {planPrice}
              </Text>
            </View> */}
              </View>

              {/* members images */}
              <View style={{height: responsiveHeight(4)}}>
                <TouchableOpacity disabled={true}>
                  {
                    <View style={styles.tabMembersContainer}>
                      <View
                        style={{
                          position: 'relative',
                          height: responsiveHeight(4),
                          width: responsiveHeight(5),
                        }}>
                        {memberImages?.length > 2 && (
                          <View
                            style={{
                              ...styles.tabMemberContainer,
                              left: responsiveWidth(3),
                            }}>
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
                              left: responsiveWidth(4),
                            }}>
                            <FastImage
                              source={{
                                uri: memberImages[memberImages?.length - 2],
                                priority: FastImage.priority.high,
                              }}
                              style={[styles.memberImg, {zIndex: 1500}]}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          </View>
                        )}
                        {memberImages?.length > 0 && (
                          <View
                            style={{
                              ...styles.tabMemberContainer,
                              left: responsiveWidth(5.5),
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
                      <Text
                        style={{
                          marginLeft: responsiveWidth(7),
                          color: 'black',
                        }}>
                        {`${memberCount ? memberCount : 'No'} Followers`}
                      </Text>
                    </View>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Wrapper>
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteLoader.showDeleteModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setDeleteLoader(preData => ({...preData, showDeleteModal: false}));
        }}>
        <DeleteModal
          title="Are you sure want to delete this community?"
          loader={deleteLoader.loader}
          confirmButtonHandler={delteCommunityHandler}
          cancelButtonHandler={() => {
            setDeleteLoader(preData => ({...preData, showDeleteModal: false}));
          }}
        />
      </Modal>
    </>
  );
};

export default CommunityListItem;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: responsiveHeight(1),
    paddingTop: responsiveHeight(1),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: responsiveHeight(6),
    width: responsiveWidth(95),
    paddingBottom: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(2),
    borderBottomWidth: 0.4,
    borderBottomColor: globalStyles.lightGray,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '45%',
  },
  touch: {
    justifyContent: 'center',
    height: '100%',
    width: responsiveWidth(17),
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: globalStyles.themeBlue,
    borderRadius: responsiveWidth(2),
    elevation: 3,
    shadowColor: globalStyles.themeBlue,
  },
  buttonText: {
    paddingVertical: responsiveHeight(0.4),
    color: 'white',
    fontSize: responsiveFontSize(1.4),
    fontWeight: '700',
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    width: '100%',
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  img: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
  },
  tabImgsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: responsiveHeight(1.2),
    paddingBottom: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    borderBottomWidth: 0.4,
    borderBlockColor: globalStyles.lightGray,
  },
  tabImgContainer: {
    height: responsiveHeight(6),
    width: responsiveHeight(6),
    marginRight: responsiveWidth(1),
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  tabImg: {
    height: '100%',
    width: '100%',
  },
  tabMembersContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
  },
  tabMemberContainer: {
    position: 'absolute',
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveHeight(2),
    overflow: 'hidden',
  },
  memberImg: {
    height: '100%',
    width: 'auto',
  },
  moreButton: {
    marginBottom: responsiveHeight(0.5),
    height: '100%',
    width: responsiveWidth(10),
    backgroundColor: globalStyles.themeBlue,
  },
});
