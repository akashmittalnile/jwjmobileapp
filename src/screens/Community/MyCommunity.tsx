import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Container from '../../components/Container/Container';
import FollowedCommunityTab from '../../components/CommunityListItem/FollowedCommunityTab';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ScreenNames from '../../utils/ScreenNames';
import {DeleteApi, PostApiWithToken} from '../../services/Service';
import {reloadHandler} from '../../redux/ReloadScreen';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import {GetApiWithToken, endPoint} from '../../services/Service';
import Toast from 'react-native-toast-message';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import {globalStyles} from '../../utils/constant';
import Wrapper from '../../components/Wrapper/Wrapper';
import BorderBtn from '../../components/Button/BorderBtn';

interface CommunityData {
  approved: number;
  pending: number;
  rejected: number;
}

interface CommunityListState {
  data: any[]; // Adjust the type according to your data structure
  count: CommunityData;
}

const MyCommunity = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const focused = useIsFocused();
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload);
  const [communityList, setCommunityList] = React.useState<CommunityListState>({
    data: [],
    count: {
      approved: 0,
      pending: 0,
      rejected: 0,
    },
  });
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(true);
  const [selectedTab, setSelectedtab] = React.useState<number>(1);
  const [showDeletedModal, setShowDeleteModal] = React.useState<{
    loader: boolean;
    showModal: boolean;
    id: number | null;
  }>({
    loader: false,
    showModal: false,
    id: null,
  });

  React.useEffect(() => {
    focused && communityListHandler(`?status=${1}`);
  }, [focused, reload.MyCommunity]);

  const communityListHandler = async (params: string) => {
    setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(
        `${endPoint.MyCommunity}${params}`,
        token,
      );
      if (response?.data?.status) {
        setCommunityList({
          data: response?.data?.data?.data,
          count: {
            approved: response?.data?.data?.activeCount,
            rejected: response?.data?.data?.rejectCount,
            pending: response?.data?.data?.pendingCount,
          },
        });
        setShowSkeleton(false);
      } else if (!response?.data?.status) {
        response?.data?.message &&
          Toast.show({
            type: 'error',
            text1: response?.data?.message,
          });
      }
    } catch (err: any) {
      console.log('err in followed community list', err.message);
    } finally {
      setShowSkeleton(false);
    }
  };

  const followingHandler = async (
    community_id: string,
    value: number,
    index: number,
  ) => {
    try {
      const response = await PostApiWithToken(
        endPoint.followUnfollow,
        {community_id, status: !value ? 1 : 0},
        token,
      );
      if (response?.data?.status) {
        dispatch(
          reloadHandler({
            [ScreenNames.Community]: !reload.Community,
          }),
        );
        // const temp = communityList.filter(
        //   (item: any, ItemIndex: number) => ItemIndex !== index,
        // );
        communityListHandler(`?status=${selectedTab}`);
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('following handler on community details page', err.message);
    }
  };

  const onClickTabHandler = (community_id: string, follow: boolean) => {
    navigation.navigate(ScreenNames.FollowedCommunityDetails, {community_id});
  };

  const newPostHandler = (community_id: string) => {
    navigation.navigate(ScreenNames.AddNewPost, {community_id});
  };

  const refreshControlHandler = () => {
    setShowSkeleton(true);
    setCommunityList({
      data: [],
      count: {
        approved: 0,
        pending: 0,
        rejected: 0,
      },
    });
    communityListHandler(`?status=${selectedTab}`);
  };

  const communityTypeHandler = (number: number) => {
    if (number === selectedTab) {
      return;
    }
    setSelectedtab(number);
    communityListHandler(`?status=${number}`);
  };

  const editCommunityHandler = (data: any) => {
    navigation.navigate(ScreenNames.AddNewPost, {
      createCommunity: true,
      editCommunity: true,
      data,
    });
  };

  const showDeleteModal = (id: number) => {
    console.log('clecked');
    setShowDeleteModal(preData => ({...preData, showModal: true, id}));
  };

  const deleteCommunity = async () => {
    try {
      setShowDeleteModal(preData => ({...preData, loader: true}));
      const response = await DeleteApi(
        `${endPoint.deletCommunity}?id=${showDeletedModal?.id}`,
        token,
      );
      if (response?.data?.status) {
        dispatch(
          reloadHandler({[ScreenNames.MyCommunity]: !reload.MyCommunity}),
        );
      }
    } catch (err: any) {
      console.log('err in deleting my community', err?.message);
    } finally {
      setShowDeleteModal(preData => ({
        ...preData,
        loader: false,
        showModal: false,
      }));
    }
  };

  return (
    <>
      <Container
        style={{flex: 1, height: responsiveHeight(100)}}
        headerText="My Communities"
        onRefreshHandler={refreshControlHandler}
        subContainerStyle={{paddingTop: 0, height: responsiveHeight(100)}}
        scrollViewContentContainerStyle={{height: responsiveHeight(100)}}>
        <View style={styles.communityAndMessageBox}>
          <View
            style={{
              ...styles.communityContainer,
              borderColor:
                selectedTab === 1 ? globalStyles.themeBlue : 'transparent',
            }}>
            <TouchableOpacity
              onPress={() => {
                communityTypeHandler(1);
              }}>
              <Image
                source={require('../../assets/Icons/global-search.png')}
                style={styles.img}
                resizeMode="contain"
              />
              <Text style={styles.text1}>Approved Communities</Text>
              <Text style={styles.number}>{communityList.count?.approved}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.communityContainer,
              borderColor:
                selectedTab === 3 ? globalStyles.themeBlue : 'transparent',
            }}>
            <TouchableOpacity
              onPress={() => {
                communityTypeHandler(3);
              }}>
              <Image
                source={require('../../assets/Icons/global-search.png')}
                style={styles.img}
                resizeMode="contain"
              />
              <Text style={styles.text1}>Rejected Communities</Text>
              <Text style={styles.number}>{communityList.count?.rejected}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.communityContainer,
              borderColor:
                selectedTab === 0 ? globalStyles.themeBlue : 'transparent',
            }}>
            <TouchableOpacity
              onPress={() => {
                communityTypeHandler(0);
              }}>
              <Image
                source={require('../../assets/Icons/global-search.png')}
                style={styles.img}
                resizeMode="contain"
              />
              <Text style={styles.text1}>Pending Communities</Text>
              <Text style={styles.number}>{communityList.count?.pending}</Text>
            </TouchableOpacity>
          </View>
          <View></View>
        </View>

        {showSkeleton ? (
          <>
            <SkeletonContainer />
          </>
        ) : communityList?.data?.length > 0 ? (
          <View style={{flex: 1}}>
            {communityList?.data?.map((item: any, index: number) => (
              <View
                style={{
                  marginBottom: responsiveHeight(2),
                  backgroundColor: 'white',
                  borderRadius: responsiveWidth(3),
                }}
                key={index.toString()}>
                <FollowedCommunityTab
                  images={item?.image?.map((item: any) => item?.image)}
                  // images={[item?.posted_by_image]}
                  key={index.toString()}
                  headerTitle={item?.name}
                  totleFollowers={item?.member_follow_count}
                  style={styles.followedCommunityTabStyle}
                  followingBtnText={item?.follow ? 'Unfollow' : 'Follow'}
                  showDeleteButton={selectedTab === 1}
                  deleteHandler={() => {
                    showDeleteModal(item?.id);
                  }}
                  postHandler={() => {
                    newPostHandler(item?.id);
                  }}
                  unfollowHandler={() => {
                    followingHandler(item?.id, item?.follow, index);
                  }}
                  onClickTab={() => {
                    onClickTabHandler(item?.id, item?.follow);
                  }}
                  memberImages={item?.member_image}
                  disablePostButton={selectedTab === 1 ? false : true}
                  disableFollowButton={selectedTab === 1 ? false : true}
                  showPostButton={false}
                  totalPost={item?.post_count}
                  showFollowButton={false}
                  showEditButton={selectedTab === 1}
                  editHandler={() => {
                    editCommunityHandler(item);
                  }}
                />
                {item?.reject_reason && (
                  <View
                    style={{
                      alignSelf: 'center',
                      paddingVertical: 5,
                      width: '95%',
                      borderTopWidth: 0.3,
                      borderTopColor: globalStyles.lightGray,
                    }}>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.7),
                        fontWeight: '400',
                      }}>{`Reason: ${item?.reject_reason}`}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={{alignItems: 'center', marginTop: responsiveHeight(10)}}>
            <Image
              source={require('../../assets/Icons/no-data-found.png')}
              resizeMode="contain"
              style={{height: responsiveHeight(15), width: responsiveWidth(25)}}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: responsiveFontSize(2.8),
                color: 'black',
                letterSpacing: 0.8,
              }}>
              No Communities Found
            </Text>
          </View>
        )}
      </Container>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeletedModal.showModal}>
        <View style={styles.modalContainer}>
          <Wrapper
            containerStyle={{
              paddingBottom: responsiveHeight(2),
              width: responsiveWidth(90),
            }}>
            <Text style={styles.modalText}>
              Do you want to delete community?
            </Text>
            <View style={styles.modalButtonContainer}>
              <BorderBtn
                loader={showDeletedModal.loader}
                loaderColor="red"
                buttonText="Delete"
                onClick={deleteCommunity}
                containerStyle={{
                  ...styles.modalButtonStyle,
                  borderColor: 'red',
                }}
                buttonTextStyle={{color: 'red'}}
              />
              <BorderBtn
                buttonText="Cancel"
                onClick={() => {
                  setShowDeleteModal(preData => ({
                    ...preData,
                    showModal: false,
                  }));
                }}
                containerStyle={{
                  ...styles.modalButtonStyle,
                  borderColor: globalStyles.themeBlue,
                }}
                buttonTextStyle={{color: globalStyles.themeBlue}}
              />
            </View>
          </Wrapper>
        </View>
      </Modal>
    </>
  );
};

export default MyCommunity;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginBottom: responsiveHeight(2),
    paddingTop: 0,
    borderRadius: responsiveWidth(2),
    width: '100%',
  },
  touch: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(3),
    height: '100%',
    width: '100%',
  },
  img: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
  },
  textContainer: {
    marginLeft: responsiveWidth(2),
  },
  text: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    color: 'black',
  },
  number: {
    color: globalStyles.themeBlue,
    fontSize: responsiveFontSize(2.6),
    fontWeight: '500',
  },
  followedCommunityTabStyle: {
    marginBottom: responsiveHeight(1.5),
  },
  communityAndMessageBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveHeight(1.5),
    width: '100%',
  },
  communityContainer: {
    paddingVertical: responsiveHeight(1),
    width: '30%',
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: responsiveWidth(2),
    shadowColor: globalStyles.lightGray,
    paddingHorizontal: responsiveWidth(2),
    borderWidth: responsiveWidth(0.23),
  },
  text1: {
    marginTop: responsiveHeight(1),
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  close: {
    position: 'absolute',
    top: responsiveHeight(5),
    left: responsiveWidth(2),
    zIndex: 10000,
    height: responsiveHeight(5),
    width: responsiveHeight(5),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  modalButtonStyle: {
    width: responsiveWidth(35),
    backgroundColor: 'white',
    borderWidth: responsiveWidth(0.23),
  },
  modalText: {
    marginBottom: responsiveHeight(2),
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});
