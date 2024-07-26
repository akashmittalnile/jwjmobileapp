import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import React from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import FollowedCommunityTab from '../../components/CommunityListItem/FollowedCommunityTab';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ScreenNames from '../../utils/ScreenNames';
import {PostApiWithToken} from '../../services/Service';
import {reloadHandler} from '../../redux/ReloadScreen';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import {GetApiWithToken, endPoint} from '../../services/Service';
import Toast from 'react-native-toast-message';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import {globalStyles} from '../../utils/constant';
import Header from '../../components/Header/Header';

let pagination = {
  currentPage: 1,
  lastPage: 1,
  loader: false,
};

const FollowedCommunity = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const focused = useIsFocused();
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload);
  const [communityList, setCommunityList] = React.useState<any[]>([]);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(true);
  const [shouldRefresh, setshouldRefresh] = React.useState<boolean>(false);
  const [paginationLoader, setPaginationLoader] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (focused) {
      pagination.currentPage = 1;
      pagination.lastPage = 1;
      pagination.loader = false;
    }
  }, [focused]);

  React.useEffect(() => {
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    setCommunityList([]);
    communityListHandler(true);
  }, [reload.FollowedCommunity]);

  const communityListHandler = async (loader: boolean) => {
    loader && setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(
        `${endPoint.followedCommunity}?page=${pagination.currentPage}`,
        token,
      );
      if (response?.data?.status) {
        pagination.currentPage === 1
          ? setCommunityList(response?.data?.data?.data)
          : setCommunityList(preState => [
              ...preState,
              ...response?.data?.data?.data,
            ]);
        (pagination.currentPage =
          response?.data?.data?.pagination?.currentPage + 1),
          (pagination.lastPage = response?.data?.data?.pagination?.lastPage);
        pagination.loader = false;
      }
    } catch (err: any) {
      console.log('err in followed community list', err.message);
    } finally {
      loader && setShowSkeleton(false);
      setPaginationLoader(false);
      setshouldRefresh(false);
    }
  };

  // const followingHandler = async (
  //   community_id: string,
  //   value: number,
  //   index: number,
  // ) => {
  //   try {
  //     const response = await PostApiWithToken(
  //       endPoint.followUnfollow,
  //       {community_id, status: !value ? 1 : 0},
  //       token,
  //     );
  //     if (response?.data?.status) {
  //       dispatch(
  //         reloadHandler({
  //           [ScreenNames.Community]: !reload.Community,
  //         }),
  //       );
  //       const temp = communityList.filter(
  //         (item: any, ItemIndex: number) => ItemIndex !== index,
  //       );
  //       setCommunityList(temp);
  //     }
  //     Toast.show({
  //       type: response?.data?.status ? 'success' : 'error',
  //       text1: response?.data?.message,
  //     });
  //   } catch (err: any) {
  //     console.log('following handler on community details page', err.message);
  //   }
  // };

  const _unfollowHandlerCallback = (index: number) => {
    const temp = communityList.filter(
      (item: any, ItemIndex: number) => ItemIndex !== index,
    );
    setCommunityList(temp);
  };
  const onClickTabHandler = (community_id: string) => {
    navigation.navigate(ScreenNames.FollowedCommunityDetails, {community_id});
  };

  const newPostHandler = (community_id: string) => {
    navigation.navigate(ScreenNames.AddNewPost, {community_id});
  };

  const onRefresh = async () => {
    setshouldRefresh(true);
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    communityListHandler(true);
  };

  const renderdata = (item: any) => {
    return (
      <FollowedCommunityTab
        id={item?.item?.id}
        images={[item?.item?.image[0]?.image]}
        // images={[item?.item?.posted_by_image]}
        headerTitle={item?.item?.name}
        totleFollowers={item?.item?.member_follow_count}
        style={styles.followedCommunityTabStyle}
        postHandler={() => {
          newPostHandler(item?.item?.id);
        }}
        // unfollowHandler={() => {
        //   followingHandler(item?.item?.id, item?.item?.id, item?.index);
        // }}
        unfollowHandlerCallback={() => {
          _unfollowHandlerCallback(item?.index);
        }}
        onClickTab={() => {
          onClickTabHandler(item?.item?.id);
        }}
        memberImages={item?.item?.member_image}
        showDeleteButton={false}
        totalPost={item?.item?.post_count}
        styleTouch={{paddingBottom: responsiveHeight(1.2)}}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Header title="Followed Communities" notificationButton={false} />
      </View>
      <View style={styles.subContainer}>
        {showSkeleton ? (
          <>
            <SkeletonContainer />
          </>
        ) : communityList.length > 0 ? (
          <FlatList
            data={communityList}
            renderItem={renderdata}
            style={{
              height: responsiveHeight(85),
            }}
            contentContainerStyle={{paddingBottom:responsiveHeight(5)}}
            keyExtractor={(_, index) => index?.toString()}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (
                pagination?.currentPage <= pagination?.lastPage &&
                !pagination.loader &&
                communityList?.length % 10 === 0
              ) {
                setPaginationLoader(true);
                pagination.loader = true;
                communityListHandler(false);
              }
            }}
            ListFooterComponent={() =>
              paginationLoader ? (
                <ActivityIndicator
                  size="large"
                  color={globalStyles.themeBlue}
                />
              ) : null
            }
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={shouldRefresh}
                onRefresh={onRefresh}
              />
            }
          />
        ) : (
          <View style={{alignItems: 'center', marginTop: responsiveHeight(15)}}>
            <Image
              source={require('../../assets/Icons/no-data-found.png')}
              resizeMode="contain"
              style={{height: responsiveHeight(15), width: responsiveWidth(30)}}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: responsiveFontSize(2.8),
                color: 'black',
                letterSpacing: 0.8,
              }}>
              No Followed Community Found
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FollowedCommunity;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: globalStyles.backgroundColor,
  },
  followedCommunityTabStyle: {
    marginTop: responsiveHeight(1.5),
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: responsiveHeight(2),
    backgroundColor: globalStyles.themeBlue,
  },
  subContainer: {
    flex: 1,
    width: responsiveWidth(95),
  },
});
