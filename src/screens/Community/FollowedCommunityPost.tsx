import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  useNavigation,
  RouteProp,
  useRoute,
  useIsFocused,
} from '@react-navigation/native';
import {globalStyles} from '../../utils/constant';
import RenewPlan from '../../components/Plan/RenewPlan';
import IconButton from '../../components/Button/IconButton';
import heartPath from '../../assets/Icons/heart.png';
import heartBluePath from '../../assets/Icons/heart-blue.png';
import messagePath from '../../assets/Icons/message-blue.png';
import message2Path from '../../assets/Icons/messages-2.png';
import ScreenNames from '../../utils/ScreenNames';
import {RootStackParamList} from '../../navigation/MainNavigation';
import {
  GetApiWithToken,
  PostApiWithToken,
  endPoint,
} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import ImageSlider from '../../components/Slider/ImageSlider';
import ImageSkeleton from '../../components/Skeleton/ImageSkeleton';
import Toast from 'react-native-toast-message';
import FastImage from 'react-native-fast-image';
import userIcon from '../../assets/Icons/user.png';
import moment from 'moment';
import {all} from 'axios';
import {reloadHandler} from '../../redux/ReloadScreen';

const heartPathIcon = Image.resolveAssetSource(heartPath).uri;
const heartBluePathIcon = Image.resolveAssetSource(heartBluePath).uri;
const messagePathIcon = Image.resolveAssetSource(messagePath).uri;
const message2PathIcon = Image.resolveAssetSource(message2Path).uri;

type FollowedCommunityPostRouteProps = RouteProp<
  RootStackParamList,
  'FollowedCommunityPost'
>;

const FollowedCommunityPost = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const dispatch = useAppDispatch();
  const reload = useAppSelector(state => state.reload);
  const token = useAppSelector(state => state.auth.token);
  const planDetails = useAppSelector(state => state.userDetails.currentPlan);
  const {params} = useRoute<FollowedCommunityPostRouteProps>();
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
  const [allPlans, setAllPlans] = React.useState<any[]>([]);
  const [data, setData] = React.useState<{
    title: string;
    description: string;
    created_at: string;
    posted_by_user_name: string;
    posted_by_profile: string;
    image: string[];
    comment_count: number;
    likes_count: number;
    is_liked: number;
  }>({
    title: '',
    description: '',
    created_at: '',
    posted_by_user_name: '',
    posted_by_profile: '',
    image: [],
    comment_count: 0,
    likes_count: 0,
    is_liked: 0,
  });

  React.useEffect(() => {
    focused && getPostDetails();
  }, [focused]);

  React.useEffect(() => {
    getPlanHandler();
  }, []);

  const userName =
    data?.posted_by_user_name?.length > 0
      ? data?.posted_by_user_name?.toUpperCase()[0] +
        data?.posted_by_user_name
          ?.toLowerCase()
          ?.substring(1, data?.posted_by_user_name?.length)
      : '';

  const getPostDetails = async () => {
    setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(
        `${endPoint.post}/${params?.postId}`,
        token,
      );
      if (response?.data?.status) {
        setData(response?.data?.data);
      }
    } catch (err: any) {
      console.log('err in post details', err.message);
    } finally {
      setShowSkeleton(false);
    }
  };

  const getPlanHandler = async () => {
    try {
      const response = await GetApiWithToken(endPoint.plans, token);
      if (response?.data?.status) {
        setAllPlans(response?.data.data);
      }
    } catch (err: any) {
      console.log('err in notification plans', err?.message);
    }
  };

  // const userNameSignTemp = data?.posted_by_user_name
  //   ? data?.posted_by_user_name?.split(' ')
  //   : [];
  // const userNameSign =
  //   userNameSignTemp.length > 0 ? userNameSignTemp[0][0] : '';

  const commentHandler = () => {
    navigation.navigate(ScreenNames.AllComments, {id: params?.postId});
  };

  const messageHandler = () => {
    navigation.navigate(ScreenNames.Chat);
  };

  const likeUnlikeHandler = async () => {
    try {
      const response = await PostApiWithToken(
        endPoint.LikeUnlike,
        {id: params?.postId, type: 1},
        token,
      );
      if (response?.data?.status) {
        dispatch(
          reloadHandler({
            [ScreenNames.FollowedCommunityDetails]:
              !reload?.FollowedCommunityDetails,
          }),
        );
        getPostDetails();
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('error in like', err?.message);
    }
  };

  const renewPlanHandler = (item: any) => {
    navigation.navigate(ScreenNames.Payment, {
      data: {
        ...item,
        selected_plan: planDetails?.plan_timeperiod === 'Yearly' ? 1 : 0,
      },
    });
  };

  const onRefresh = () => {
    getPostDetails();
  };

  return (
    <Container
      headerText={data?.title || ''}
      style={styles.container}
      scrollViewContentContainerStyle={{height: responsiveHeight(84)}}
      onRefreshHandler={onRefresh}>
      <View style={styles.followedCommunityImageContainer}>
        {showSkeleton ? (
          <ImageSkeleton
            height={responsiveHeight(25)}
            width={responsiveWidth(95)}
          />
        ) : (
          Array.isArray(data?.image) &&
          data?.image?.length > 0 && (
            <ImageSlider
              data={data?.image?.map((item: any) => item?.image)}
              imageStyle={{width: responsiveWidth(95)}}
            />
          )
        )}
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.titleSignContainer}>
          {data?.posted_by_profile ? (
            <FastImage
              source={{
                uri: data?.posted_by_profile,
                priority: FastImage.priority.high,
              }}
              style={{
                height: responsiveHeight(5),
                width: responsiveHeight(5),
                borderRadius: responsiveWidth(5),
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
                borderRadius: responsiveWidth(5),
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            // <Text style={styles.titleSign}>{userNameSign}</Text>
          )}
        </View>
        <Text style={styles.title}>{userName}</Text>
        <View style={styles.headerDateContainer}>
          <Text style={styles.date}>
            {' '}
            {moment(data?.created_at, 'DD MMM, YYYY hh:mm A').format(
              'MMM DD, YYYY',
            ) +
              ' ' +
              moment(data?.created_at, 'DD MMM, YYYY hh:mm A').format(
                'hh:mm A',
              )}
          </Text>
        </View>
      </View>
      <Text style={styles.postHeading}>{data?.title}</Text>
      <Text style={styles.postDetails}>{data?.description}</Text>

      {/* renew plan */}
      {/* <View style={styles.renewPlanContainer}>
        {allPlans?.map((item: any, index: number) => {
          if (planDetails?.name != item?.name) {
            return (
              <RenewPlan
                Key={index.toString()}
                planName={item?.name}
                planPrice={
                  planDetails?.plan_timeperiod === 'Yearly'
                    ? item?.anually_price === 0
                      ? 'FREE'
                      : `$${item?.anually_price}/Year`
                    : item?.monthly_price === 0
                    ? 'FREE'
                    : `$${item?.monthly_price}/Month`
                }
                buttonText={
                  planDetails?.plan_timeperiod === 'Yearly'
                    ? Number(item?.anually_price) > Number(planDetails.price)
                      ? 'Upgrade'
                      : 'Downgrade'
                    : Number(item?.monthly_price) > Number(planDetails.price)
                    ? 'Upgrade'
                    : 'Downgrade'
                }
                style={styles.renewPlan}
                onClick={() => {
                  renewPlanHandler(item);
                }}
              />
            );
          }
        })}
      </View> */}
      <View style={styles.buttonContainer}>
        <IconButton
          text={`${data?.likes_count} Likes`}
          iconUri={data?.is_liked ? heartBluePathIcon : heartPathIcon}
          style={styles.iconButton}
          onPress={likeUnlikeHandler}
          textStyle={styles.buttonTextStyle}
        />
        <IconButton
          text={`${data?.comment_count} ${
            data?.comment_count > 1 ? 'Comments' : 'Comment'
          }`}
          iconUri={messagePathIcon}
          style={styles.iconButton}
          onPress={commentHandler}
          textStyle={styles.buttonTextStyle}
        />
        {/* <IconButton
          text="Messages"
          iconUri={message2PathIcon}
          style={styles.iconButton}
          onPress={messageHandler}
          textStyle={styles.buttonTextStyle}
        /> */}
      </View>
    </Container>
  );
};

export default FollowedCommunityPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  followedCommunityImageContainer: {
    marginTop: responsiveHeight(1.5),
    height: responsiveHeight(25),
    width: '100%',
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  postImageContainer: {
    marginBottom: responsiveHeight(1.5),
    height: responsiveHeight(17),
    width: '100%',
    ...globalStyles.shadowStyle,
  },
  followedCommunityImage: {
    height: '100%',
    width: '100%',
    borderRadius: responsiveWidth(2),
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
    backgroundColor: '#EFF1FE',
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
  postHeading: {
    marginTop: responsiveHeight(1.2),
    width: '100%',
    paddingHorizontal: responsiveWidth(3),
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  postDetails: {
    marginTop: responsiveHeight(1),
    width: '100%',
    paddingHorizontal: responsiveWidth(3),
    color: 'black',
    opacity: 0.8,
    fontSize: responsiveFontSize(1.5),
    fontWeight: '400',
    letterSpacing: 0.7,
    lineHeight: responsiveHeight(2.3),
  },
  renewPlanContainer: {
    alignItems: 'center',
    width: '100%',
  },
  renewPlan: {
    marginTop: responsiveHeight(1.2),
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  iconButton: {
    height: responsiveHeight(3.5),
    borderWidth: responsiveWidth(0.2),
    borderColor: globalStyles.themeBlue,
    // width: '32%',
    width: '48%'
  },
  buttonTextStyle: {
    fontSize: responsiveFontSize(1.3),
    color: 'black',
    opacity: 0.8,
  },
});
