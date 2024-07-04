/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import HomeHeader from '../../components/Header/HomeHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {globalStyles} from '../../utils/constant';
import SearchBarWithInsideIcon from '../../components/SearchBar/SearchBarWithInsideIcon';
import BorderBtn from '../../components/Button/BorderBtn';
import CommunityListItem from '../../components/CommunityListItem/CommunityListItem';
import ScreenNames from '../../utils/ScreenNames';
import CommunityModal from '../../components/Modal/CommunityModal';
import {
  GetApiWithToken,
  endPoint,
} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import {followedCommunityHandler} from '../../redux/TrackNumbers';

const pagination = {
  currentPage: 1,
  lastPage: 1,
  loader: false,
};

const Community = () => {
  const navigation = useNavigation();
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload.Community);
  const followedCommunityNumber = useAppSelector(
    state => state.TrackNumber.followedCommunity,
  );
  const dispatch = useAppDispatch();
  const focused = useIsFocused();
  const unSeenMessage = useAppSelector(
    state => state.TrackNumber.unSeenMessage,
  );
  const [modal, setModal] = React.useState<boolean>(false);
  const [communityList, setCommunityList] = React.useState<any[]>([]);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
  const [shouldRefresh, setshouldRefresh] = React.useState<boolean>(false);
  const [myCommunity, setMyCommunity] = React.useState<number>(0);
  const [saerchValue, setSearchValue] = React.useState<string>('');
  const [paginationLoader, setPaginationLoader] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    setShowSkeleton(true);
    if (focused || reload) {
      setCommunityList([]);
      setSearchValue('');
      pagination.currentPage = 1;
      pagination.lastPage = 1;
      pagination.loader = false;
      getInitialData();
    }
  }, [focused, reload]);

  // React.useEffect(() => {
  //   setCommunityList([]);
  //   setSearchValue('');
  //   pagination.currentPage = 1;
  //   pagination.lastPage = 1;
  //   pagination.loader = false;
  //   getInitialData();
  // }, [reload]);

  const getInitialData = async () => {
    getCommunityList(true);
    getMyCommunity();
  };

  const tabContainer = (
    <View style={styles.communityAndMessageBox}>
      <View style={styles.communityContainer}>
        <TouchableOpacity
          onPress={() => {
            goToScreenHandler('FollowedCommunity');
          }}>
          <Image
            source={require('../../assets/Icons/global-search.png')}
            style={styles.img}
            resizeMode="contain"
          />
          <Text style={styles.text}>Followed Communities</Text>
          <View>
            <Text style={styles.number}>{followedCommunityNumber}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.communityContainer}>
        <TouchableOpacity
          onPress={() => {
            goToScreenHandler('MyCommunity');
          }}>
          <Image
            source={require('../../assets/Icons/global-search.png')}
            style={styles.img}
            resizeMode="contain"
          />
          <Text style={styles.text}>My Communities</Text>
          <View>
            <Text style={styles.number}>{myCommunity}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.communityContainer}>
        <TouchableOpacity
          onPress={() => {
            goToScreenHandler('Chat');
          }}>
          <Image
            source={require('../../assets/Icons/messages.png')}
            style={styles.img}
            resizeMode="contain"
          />
          <Text style={styles.text}>Messages</Text>
          <Text style={{color: 'gray'}}>New</Text>
          <View>
            <Text style={styles.number}>{unSeenMessage}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
  const createCommunityHandler = () => {
    navigation.navigate(ScreenNames.AddNewPost, {createCommunity: true});
  };

  const searchBar = (
    <View style={styles.searchBarContainer}>
      <SearchBarWithInsideIcon
        value={saerchValue}
        searchKey="search"
        placeHolder="Search Community By Name"
        arrowSide="left"
        style={{
          width: '65%',
          height: responsiveHeight(6),
          elevation: 3,
          shadowColor: globalStyles.lightGray,
        }}
        onSearch={(key: string) => {
          pagination.currentPage = 1;
          pagination.lastPage = 1;
          pagination.loader = false;
          setSearchValue(key?.split('=')[1]);
          searchHandler(key);
        }}
      />
      <BorderBtn
        buttonText="Add New"
        onClick={createCommunityHandler}
        containerStyle={{width: '34%', marginTop: 0, elevation: 3}}
      />
    </View>
  );

  const noDataFound = (
    <View style={styles.noDataFoundContainer}>
      <Image
        source={require('../../assets/Icons/no-data-found.png')}
        style={styles.noUserFoundImage}
        resizeMode="contain"
      />
      <Text style={styles.noUserFound}>No Communities Found</Text>
    </View>
  );

  const getCommunityList = React.useCallback(async (loader: boolean) => {
    loader && !showSkeleton && setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(
        `${endPoint.communityList}?page=${pagination?.currentPage}`,
        token,
      );
      if (response?.data?.status) {
        dispatch(
          followedCommunityHandler({
            followedCommunity: response?.data?.data?.totalFollow,
          }),
        );
        setCommunityList(preData => [
          ...preData,
          ...response?.data?.data?.data,
        ]);
        pagination.currentPage =
          response?.data?.data?.pagination?.currentPage + 1;
        pagination.lastPage = response?.data?.data?.pagination?.lastPage;
        pagination.loader = false;
      }
    } catch (err: any) {
      console.log('err in community list', err.message);
    } finally {
      setShowSkeleton(false);
      setshouldRefresh(false);
    }
  }, []);

  const getMyCommunity = React.useCallback(async () => {
    try {
      const response = await GetApiWithToken(endPoint.MyCommunity, token);
      if (response?.data?.status) {
        setMyCommunity(response?.data?.data?.data?.length);
      }
    } catch (err: any) {
      console.log('err in my community', err?.message);
    }
  }, []);

  const onRefresh = async () => {
    setCommunityList([]);
    setSearchValue('');
    setshouldRefresh(true);
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    getInitialData();
  };

  const goToScreenHandler = (value: string) => {
    if (value) {
      navigation.navigate(value);
    }
  };

  const followinHandler = async (value: boolean, message: string) => {
    dispatch(
      followedCommunityHandler({
        followedCommunity: value
          ? followedCommunityNumber + 1
          : followedCommunityNumber - 1,
      }),
    );
    message &&
      Toast.show({
        type: 'success',
        text1: message,
      });
  };

  const goToFollowedCommunityDetails = (
    follow: boolean,
    community_id: number,
    myCommunity: boolean,
  ) => {
    if (follow || myCommunity) {
      navigation.navigate(ScreenNames.FollowedCommunityDetails, {community_id});
    } else {
      Toast.show({
        type: 'info',
        text1: 'Please follow community first',
      });
    }
  };

  const editCommunityHandler = (data: any) => {
    navigation.navigate(ScreenNames.AddNewPost, {
      createCommunity: true,
      editCommunity: true,
      data,
    });
  };

  const searchHandler = React.useCallback(
    async (key: string, loader: boolean = true) => {
      try {
        loader && setShowSkeleton(true);
        const response = await GetApiWithToken(
          `${endPoint?.communityList}${key}`,
          token,
        );
        if (response?.data?.status) {
          pagination.currentPage === 1
            ? setCommunityList(response?.data?.data?.data)
            : setCommunityList(preData => [
                ...preData,
                ...response?.data?.data?.data,
              ]);
          pagination.currentPage =
            response?.data?.data?.pagination?.currentPage + 1;
          pagination.lastPage = response?.data?.data?.pagination?.lastPage;
          pagination.loader = false;
        }
      } catch (err: any) {
        console.log('err in routine search', err?.message);
      } finally {
        setShowSkeleton(false);
        setPaginationLoader(false);
      }
    },
    [],
  );

  const renderData = (item: any) => {
    // console.log(item?.item?.my_community)
    return (
      <CommunityListItem
        onClick={(value: boolean, message: string) => {
          followinHandler(value, message);
        }}
        isFollow={item?.item?.follow}
        id={item?.item?.id}
        myCommunity={item?.item?.my_community}
        headerHeading={item?.item?.name}
        // headerButtonText={item?.item?.follow ? 'Unfollow' : 'Follow'}
        planPrice={`${item?.item?.plan_price_currency?.toUpperCase()} ${
          item?.item?.plan_monthly_price
        }/month`}
        planName={item?.item?.plan_name}
        memberCount={item?.item?.member_follow_count}
        memberImages={item?.item?.member_image}
        images={[item?.item?.image[0]?.image]}
        // images={[item?.item?.posted_by_image]}
        totalPost={item?.item?.post_count}
        showEditButton={item?.item?.my_community}
        showDeleteButton={item?.item?.my_community}
        editButtonHandler={() => {
          editCommunityHandler(item?.item);
        }}
        showFollowButton={!item?.item?.my_community}
      />
    );
  };

  const handlePagination = () => {
    if (
      saerchValue &&
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader &&
      Array.isArray(communityList) &&
      communityList?.length % 10 === 0
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      searchHandler(
        `?search=${saerchValue}&&page=${pagination.currentPage}`,
        false,
      );
    } else if (
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader &&
      Array.isArray(communityList) &&
      communityList?.length % 10 === 0
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      searchHandler(`?page=${pagination.currentPage}`, false);
    }
  };
  return (
    <>
      <View style={styles.mainContainer}>
        <HomeHeader />
        <View style={styles.subContainer}>
          {/* <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={shouldRefresh}
                onRefresh={onRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: responsiveHeight(12)}}> */}
          {/* upper section */}

          {/* {tabContainer} */}

          {/* searchbar */}
          {/* {searchBar} */}

          {/* community list */}
          <View
            style={{
              flex: 1,
              width: '100%',
              paddingBottom: responsiveHeight(7),
            }}>
            {showSkeleton ? (
              <SkeletonContainer />
            ) : (
              <FlatList
                data={communityList}
                renderItem={renderData}
                ListHeaderComponent={() => (
                  <>
                    {tabContainer}
                    {searchBar}
                    {communityList?.length === 0 && noDataFound}
                  </>
                )}
                keyExtractor={(_, index) => index?.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handlePagination}
                ListFooterComponent={() =>
                  paginationLoader ? (
                    <ActivityIndicator
                      size="large"
                      color={globalStyles.themeBlue}
                      style={{marginTop: responsiveHeight(2)}}
                    />
                  ) : null
                }
                style={{height: responsiveHeight(80)}}
                refreshControl={
                  <RefreshControl
                    refreshing={shouldRefresh}
                    onRefresh={onRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: responsiveHeight(5)}}
              />
            )}
          </View>
          {/* </ScrollView> */}
        </View>
      </View>
      {modal && (
        <CommunityModal
          heading="New Community Requires
Admin Approval"
          text="You Will Receive An Email Notification If This Community Is Been Accepted Or Rejected From The Admin Within 24 To 48 Hrs"
          buttonText="Close"
          modalHandler={() => {
            setModal(false);
          }}
        />
      )}
    </>
  );
};

export default Community;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  subContainer: {
    flex: 1,
    width: responsiveWidth(95),
  },
  rejectedCommunityContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    ...globalStyles.shadowStyle,
  },
  globalSearchIcon: {
    height: responsiveHeight(6),
    width: responsiveHeight(6),
  },
  rejectedCommunityTextContainer: {
    justifyContent: 'space-between',
    marginLeft: responsiveWidth(1),
  },
  communityAndMessageBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
    width: '100%',
  },
  communityContainer: {
    width: '30%',
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: responsiveWidth(2),
    shadowColor: globalStyles.lightGray,
    paddingHorizontal: responsiveWidth(2),
  },
  img: {
    marginTop: responsiveHeight(1),
    height: responsiveHeight(6),
    width: responsiveWidth(10),
  },
  text: {
    marginTop: responsiveHeight(1),
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
  },
  number: {
    marginTop: responsiveHeight(0.5),
    color: globalStyles.themeBlue,
    fontSize: responsiveFontSize(2.6),
    fontWeight: '500',
    paddingBottom: responsiveHeight(1),
    textAlignVertical: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
    height: responsiveFontSize(7),
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  search: {
    height: '100%',
    width: '60%',
    borderRadius: responsiveWidth(2),
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
  },
  noDataFoundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(5),
  },
  noUserFoundImage: {
    height: responsiveHeight(10),
    width: responsiveWidth(20),
  },
  noUserFound: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '400',
    textAlign: 'center',
    color: 'black',
  },
});
