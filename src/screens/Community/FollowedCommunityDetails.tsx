import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/MainNavigation'
import FollowedCommunityTab from '../../components/CommunityListItem/FollowedCommunityTab';
import {Dropdown} from 'react-native-element-dropdown';
import {globalStyles} from '../../utils/constant';
import FollowedCommunityDetailsTab from '../../components/CommunityListItem/FollowedCommunityDetailsTab';
import ScreenNames from '../../utils/ScreenNames';
import {
  DeleteApi,
  GetApiWithToken,
  PostApiWithToken,
  endPoint,
} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';
import {reloadHandler} from '../../redux/ReloadScreen';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import Skeleton from '../../components/Skeleton/Skeleton';
import DeleteModal from '../../components/Modal/DeleteModal';
import FollowersModal from '../../components/Modal/FollowersModal';
import FastImage from 'react-native-fast-image';
import ImageSlider from '../../components/Slider/ImageSlider';

const data = [
  {label: 'Latest posts', value: 'Latest posts'},
  {label: 'Most Liked', value: 'Most Liked'},
  {label: 'Most Commented', value: 'Most Commented'},
];

type FollowedCommunityDetailsRouteProsp = RouteProp<
  RootStackParamList,
  'FollowedCommunityDetails'
>;

const FollowedCommunityDetails = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const reload = useAppSelector(state => state.reload);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(true);
  const {params} = useRoute<FollowedCommunityDetailsRouteProsp>();
  const token = useAppSelector(state => state.auth.token);
  const [postFilter, setPostFilter] = React.useState<string>('');
  const [community, setCommunity] = React.useState<any>();
  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [showPostDeleteModal, setShowPostDeleteModal] = React.useState<{
    show: boolean;
    id: number | undefined;
  }>({show: false, id: undefined});
  const [deleteLoader, setDeleteLoader] = React.useState(false);
  const [postDeleteLoader, setPostDeleteLoader] = React.useState(false);
  const [followersData, setFollowersData] = React.useState<
    {profile: string; name: string; user_name: string}[]
  >([{profile: '', name: '', user_name: ''}]);
  const [showFollowersModal, setShowFollowersModal] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    getCommunityDetails('?post_latest=1');
  }, [reload.FollowedCommunityDetails]);

  const getCommunityDetails = async (_params: string) => {
    setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(
        `${endPoint.community + params?.community_id}${_params}`,
        token,
      );
      if (response?.data?.status) {
        setCommunity(response.data?.data);
      }
      if (!response?.data?.status) {
        response?.data?.message &&
          Toast.show({
            type: 'error',
            text1: response?.data?.message,
          });
      }
    } catch (err: any) {
      console.log('err in community details', err.message);
    } finally {
      setShowSkeleton(false);
    }
  };

  const screenReloadHandler = () => {
    dispatch(
      reloadHandler({
        [ScreenNames.FollowedCommunity]: !reload.FollowedCommunity,
        [ScreenNames.Community]: !reload.Community,
      }),
    );
  };

  const followingHandler = async (community_id: string, status: number) => {
    try {
      const response = await PostApiWithToken(
        endPoint.followUnfollow,
        {community_id, status},
        token,
      );
      if (response?.data?.status) {
        screenReloadHandler();
        navigation.goBack();
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('following handler on community details page', err.message);
    }
  };

  const goToFollowedCommunityPost = (id: number) => {
    navigation.navigate(ScreenNames.FollowedCommunityPost, {postId: id});
  };

  const newPostHandler = (community_id: string) => {
    navigation.navigate(ScreenNames.AddNewPost, {community_id});
  };

  const deleteCommunity = async () => {
    setDeleteLoader(true);
    try {
      const response = await DeleteApi(
        `${endPoint.deletCommunity}?id=${params?.community_id}`,
        token,
      );
      if (response?.data?.status) {
        screenReloadHandler();
        navigation.goBack();
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err in deleting community', err?.messsage);
    } finally {
      setDeleteLoader(false);
    }
  };

  const deleteModalHandler = () => {
    setDeleteModal(false);
  };

  const editPostHandler = (item: any) => {
    navigation.navigate(ScreenNames.AddNewPost, {editPost: true, data: item});
  };

  const _deletePostHandler = async () => {
    setDeleteLoader(true);
    try {
      const response = await DeleteApi(
        `${endPoint.DeletePost}?id=${showPostDeleteModal.id}`,
        token,
      );
      if (response?.data?.status) {
        const newPosts = community?.posts?.filter(
          (item: any) => item?.id != showPostDeleteModal.id,
        );
        setCommunity((preData: any) => ({
          ...preData,
          posts: newPosts,
        }));
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err in delete post', err?.message);
    } finally {
      setShowPostDeleteModal({show: false, id: undefined});
      setDeleteLoader(false);
    }
  };

  const deletePostHandler = async (id: number) => {
    setShowPostDeleteModal({show: true, id});
  };

  const _followersModalHandler = (data: any[]) => {
    setFollowersData(data);
    setShowFollowersModal(value => !value);
  };

  const postFilterHandler = (item: any) => {
    let _params = '';
    setPostFilter(item?.value);
    if (item?._index === 0) {
      _params = '?post_latest=1';
    } else if (item?._index === 1) {
      _params = '?post_like=1';
    } else if (item?._index === 2) {
      _params = '?post_comment=1';
    }
    getCommunityDetails(_params);
  };

  const editCommunityHandler = (data: any) => {
    navigation.navigate(ScreenNames.AddNewPost, {
      createCommunity: true,
      editCommunity: true,
      data: community,
    });
  };

  return (
    <>
      <Container
        onRefreshHandler={() => {
          getCommunityDetails('?post_latest=1');
        }}
        headerText={community?.name || ''}
        scrollViewContentContainerStyle={{
          // flex: 1,
          paddingBottom: responsiveHeight(5),
        }}
        subContainerStyle={{paddingTop: 0}}>
        <View
          style={{
            ...styles.followedCommunityImageContainer,
            height:
              community?.image?.length > 1
                ? responsiveHeight(25)
                : responsiveHeight(22),
          }}>
          {showSkeleton ? (
            <Skeleton />
          ) : (
            community?.image?.length > 0 && (
              <ImageSlider
                data={community?.image?.map((item: any) => item?.image)}

              />
              //    <FastImage
              //    style={{
              //      width: '100%',
              //      height: '100%',
              //      borderRadius: responsiveWidth(2),
              //    }}
              //    source={{
              //      uri: community?.image[0]?.image,
              //      priority: FastImage.priority.high,
              //    }}
              //    resizeMode={FastImage.resizeMode.contain}
              //  />
            )
          )}
        </View>

        {/* followers tab */}
        {!showSkeleton && (
          <FollowedCommunityTab
            images={[community?.image[0]?.image]}
            memberImages={community?.member_image}
            headerTitle={community?.name}
            description={community?.description}
            followingBtnText={community?.follow ? 'Unfollow' : 'Follow'}
            postHandler={() => {
              newPostHandler(community?.id);
            }}
            unfollowHandler={() => {
              followingHandler(community?.id, community.follow ? 0 : 1);
            }}
            totleFollowers={community?.member_follow_count}
            style={styles.followedCommunityTab}
            deleteHandler={() => {
              setDeleteModal(true);
            }}
            showFollowButton={!community?.my_community}
            showDeleteButton={community?.my_community}
            followersModalHandler={() => {
              _followersModalHandler(community?.followers);
            }}
            totalPost={community?.posts?.length}
            styleTouch={{marginBottom: responsiveHeight(1)}}
            editHandler={() => {
              editCommunityHandler(community?.id);
            }}
            showEditButton={community?.my_community}
          />
        )}

        {/* post dropdown header */}
        <View style={styles.postDropdownHeaderContainer}>
          <Text style={styles.postText}>Posts</Text>
          <Dropdown
            style={styles.dropdown}
            data={data}
            value={postFilter}
            containerStyle={{
              borderRadius: responsiveWidth(2),
              // overflow: 'hidden',
            }}
            itemContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: globalStyles.veryLightGray,
            }}
            itemTextStyle={styles.dropdownItemTextStyle}
            placeholder={postFilter ? postFilter : 'Latest posts'}
            placeholderStyle={{
              color: 'black',
              paddingLeft: responsiveWidth(3),
            }}
            onChange={postFilterHandler}
          />
        </View>

        {/* posts */}
        {/* <CommunityApproval
        disableButton={true}
        buttonText="Post On Community"
        modalHandler={() => {}}
      /> */}

        {showSkeleton ? (
          <SkeletonContainer />
        ) : community?.posts?.length > 0 ? (
          community?.posts?.map((item: any, index: number) => (
            <FollowedCommunityDetailsTab
              profilePic={item?.posted_by_profile_image}
              id={item?.id}
              key={item?.id?.toString()}
              userName={item?.posted_by_user_name}
              date={item?.created_at}
              style={styles.followedCommunityDetailsTab}
              imageUri={item?.image}
              onPress={() => {
                goToFollowedCommunityPost(item?.id);
              }}
              title={item?.title}
              editHandler={() => {
                editPostHandler(item);
              }}
              deleteHandler={() => {
                deletePostHandler(item?.id);
              }}
              deletepostLoader={postDeleteLoader}
              showMoreButton={item?.my_post}
              likes_count={item?.likes_count}
              comment_count={item?.comment_count}
              isLiked={item?.is_liked === 1 ? true : false}
            />
          ))
        ) : (
          <View style={{alignItems: 'center', marginTop: responsiveHeight(10)}}>
            <Image
              source={require('../../assets/Icons/no-data-found.png')}
              resizeMode="contain"
              style={{height: responsiveHeight(12), width: responsiveWidth(30)}}
            />
            <Text
              style={{
                fontSize: responsiveFontSize(3),
                fontWeight: '500',
                width: '100%',
                textAlign: 'center',
                color: 'black',
              }}>
              No Posts Found
            </Text>
          </View>
        )}
      </Container>
      {deleteModal && (
        <DeleteModal
          cancelButtonHandler={deleteModalHandler}
          confirmButtonHandler={deleteCommunity}
          loader={deleteLoader}
        />
      )}
      {showPostDeleteModal.show && (
        <DeleteModal
          title="Are you sure you want to delete this post?"
          cancelButtonHandler={() => {
            setShowPostDeleteModal(() => ({id: undefined, show: false}));
          }}
          confirmButtonHandler={_deletePostHandler}
          loader={deleteLoader}
        />
      )}
      {showFollowersModal && (
        <FollowersModal
          disableModalHandler={() => {
            setShowFollowersModal(value => !value);
          }}
          data={followersData}
        />
      )}
    </>
  );
};

export default FollowedCommunityDetails;

const styles = StyleSheet.create({
  followedCommunityImageContainer: {
    paddingTop: responsiveHeight(1.5),
    width: '100%',
    borderRadius: responsiveWidth(2),
    // overflow: 'hidden',
  },
  followedCommunityImage: {
    height: '100%',
    width: '100%',
  },
  followedCommunityTab: {
    marginTop: responsiveHeight(1.5),
  },
  postDropdownHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  postText: {
    fontSize: responsiveFontSize(1.7),
    color: 'black',
    fontWeight: '500',
  },
  dropdown: {
    height: responsiveHeight(5),
    width: responsiveWidth(45),
    paddingRight: responsiveWidth(2),
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
  },
  dropdownItemTextStyle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
  followedCommunityDetailsTab: {
    marginTop: responsiveHeight(1.5),
  },
});
