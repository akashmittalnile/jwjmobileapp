import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  RefreshControl,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import CommentTab from '../../components/Tab/CommentTab';
import BorderBtn from '../../components/Button/BorderBtn';
import {
  PostApiWithToken,
  endPoint,
  GetApiWithToken,
  DeleteApi,
} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/MainNavigation';
import {reloadHandler} from '../../redux/ReloadScreen';
import ScreenNames from '../../utils/ScreenNames';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import DeleteModal from '../../components/Modal/DeleteModal';

type AllCommentsRoutes = RouteProp<RootStackParamList, 'AllComments'>;

let deleteId: number;
const AllComments = () => {
  const inputRef = React.useRef<TextInput>(null);
  const {params} = useRoute<AllCommentsRoutes>();
  const dispatch = useAppDispatch();
  const followedCommunityPost = useAppSelector(
    state => state.reload.FollowedCommunityPost,
  );
  const followedCommunityDetails = useAppSelector(
    state => state.reload.FollowedCommunityDetails,
  );
  const token = useAppSelector(state => state.auth.token);
  const [replyingTo, setReplyingTo] = React.useState<{
    name: string;
    id: number;
  }>({name: '', id: 0});
  const [replying, setReplying] = React.useState<boolean>(false);
  const [comment, setComment] = React.useState<string>('');
  const [loader, setLoader] = React.useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
  const [data, setData] = React.useState<any[]>([]);
  const [reload, setReload] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<{
    editing: boolean;
    id: number | undefined;
  }>({editing: false, id: undefined});
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    getAllComments();
  }, [reload]);

  const onRefresh = () => {
    setRefreshing(true);
    getAllComments();
  };

  const editHandler = (obj: {comment: string; id: number}) => {
    setIsEditing({editing: true, id: obj.id});
    setComment(obj.comment);
    inputRef.current?.focus();
  };

  const getAllComments = async () => {
    setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(
        `${endPoint.post}/${params?.id}`,
        token,
      );
      if (response?.data?.status) {
        const temp = [];
        const data = response?.data?.data?.comments;
        for (let i = 0; i < data?.length; i++) {
          console.log(data[i]);
          temp.push(
            <CommentTab
              key={i}
              id={data[i]?.comment_id}
              replyHandler={replyingHandler}
              comment={data[i]?.comment}
              name={data[i]?.posted_by_user_name}
              date={data[i]?.posted_date}
              imageUri={data[i]?.posted_by_profile_image}
              style={{marginBottom: responsiveHeight(1)}}
              editHandler={editHandler}
              deleteHandler={showDeleteModalHandler}
              isEdit={data[i]?.my_comment}
              isDelete={data[i]?.my_comment}
            />,
          );
          if (data[i]?.reply?.length > 0) {
            const _temp = data[i]?.reply?.map((item: any, index: number) => (
              <CommentTab
                key={index}
                id={item?.reply_id}
                replyHandler={replyingHandler}
                comment={item?.reply_comment}
                name={item?.reply_posted_by_user_name}
                date={item?.reply_posted_date}
                imageUri={item?.reply_posted_by_profile_image}
                style={{marginBottom: responsiveHeight(1)}}
                isReplied={true}
                editHandler={editHandler}
                deleteHandler={showDeleteModalHandler}
                isEdit={item?.reply_my_comment}
                isDelete={item?.reply_my_comment}
              />
            ));
            temp?.push(_temp);
          }
        }
        setData(temp);
      }
    } catch (err: any) {
      console.log('err in post details', err.message);
    } finally {
      setRefreshing(false);
      setShowSkeleton(false);
    }
  };

  const showDeleteModalHandler = (id: number) => {
    deleteId = id;
    setShowDeleteModal(value => !value);
  };

  const deleteHandler = async () => {
    setDeleteLoader(true);
    try {
      const resp = await DeleteApi(
        `${endPoint.postCommentDelete}?id=${deleteId}`,
        token,
      );
      if (resp?.data?.status) {
        dispatch(
          reloadHandler({
            [ScreenNames.FollowedCommunityPost]: !followedCommunityPost,
            [ScreenNames.FollowedCommunityDetails]: !followedCommunityDetails,
          }),
        );
      }
      Toast.show({
        type: resp?.data?.status ? 'success' : 'error',
        text1: resp?.data?.message,
      });
    } catch (err: any) {
      console.log('err in delete comment', err?.message);
    } finally {
      setDeleteLoader(false);
      setShowDeleteModal(value => !value);
      setReload(value => !value);
    }
  };

  const dismisreplyingText = () => {
    if (isEditing.editing) {
      setIsEditing({editing: false, id: undefined});
    } else {
      setReplying(false);
      setReplyingTo({name: '', id: 0});
    }
    Keyboard.dismiss();
    setComment('');
  };

  const replyingHandler = (id: number, name: string) => {
    inputRef.current?.focus();
    setReplyingTo({name, id});
    setReplying(true);
  };

  const commentHandler = async () => {
    setLoader(true);
    try {
      let data;
      if (!isEditing.editing) {
        data = replying
          ? {
              id: params?.id,
              is_reply: replying ? 1 : 0,
              reply_id: replyingTo?.id,
              comment,
              type: 1,
            }
          : {
              id: params?.id,
              is_reply: replying ? 1 : 0,
              comment,
              type: 1,
            };
      } else {
        data = {
          comment_id: isEditing.id,
          comment,
        };
      }
      const response = await PostApiWithToken(
        isEditing.editing ? endPoint.postCommentEdit : endPoint.postComment,
        data,
        token,
      );
      if (response?.data?.status) {
        dispatch(
          reloadHandler({
            [ScreenNames.FollowedCommunityPost]: !followedCommunityPost,
            [ScreenNames.FollowedCommunityDetails]: !followedCommunityDetails,
          }),
        );
        Keyboard.dismiss();
        setReplying(false);
        setReplyingTo({id: 0, name: ''});
        setComment('');
        setReload(value => !value);
        if (isEditing.editing) {
          setIsEditing({editing: false, id: undefined});
        }
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err in comment', err?.message);
    } finally {
      setLoader(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="All Comments" notificationButton={false} />
        </View>
        {/* <ScrollView> */}
        <View style={styles.subContainer}>
          <ScrollView
            contentContainerStyle={{
              alignItems: 'flex-end',
              paddingBottom: responsiveHeight(25),
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}>
            {showSkeleton ? (
              <SkeletonContainer />
            ) : data?.length > 0 ? (
              data
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: responsiveHeight(20),
                  width: '100%',
                }}>
                <Image
                  source={require('../../assets/Icons/no-data-found.png')}
                  resizeMode="contain"
                  style={{
                    height: responsiveHeight(15),
                    width: responsiveWidth(30),
                  }}
                />
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.5),
                    fontWeight: '500',
                    color: 'black',
                  }}>
                  No comments found
                </Text>
              </View>
            )}
            {/* <CommentTab
              id={2}
              replyHandler={replyingHandler}
              comment=" Impressive! Though it seems the drag feature could be improved. But
          overall it looks incredible. You’ve nailed the design and the
          responsiveness at various breakpoints works really well."
              name="Amyrobson"
              date="1 month ago"
              imageUri={userIconPath}
              style={{marginBottom: responsiveHeight(1)}}
              isReplied={true}
            /> */}
          </ScrollView>
        </View>
        <View style={styles.commentBox}>
          {(replying || isEditing.editing) && (
            <View style={styles.replying}>
              <View>
                {replying && (
                  <Text
                    style={
                      styles.replyingText
                    }>{`Replying to ${replyingTo?.name}`}</Text>
                )}
                {isEditing.editing && (
                  <Text style={styles.replyingText}>Editing</Text>
                )}
              </View>
              <View>
                <TouchableOpacity
                  style={styles.replyingBtntouch}
                  onPress={dismisreplyingText}>
                  <Image
                    source={require('../../assets/Icons/cancel.png')}
                    resizeMode="contain"
                    style={styles.replyingBtn}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={styles.comment}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: '100%',
                width: '95%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  paddingBottom: responsiveHeight(3),
                }}>
                <TextInput
                  ref={inputRef}
                  value={comment}
                  onChangeText={text => {
                    setComment(text);
                  }}
                  style={styles.textInput}
                  placeholder="What's on your mind"
                  placeholderTextColor="gray"
                />
                <BorderBtn
                  loader={loader}
                  disable={comment?.length === 0}
                  containerStyle={styles.commentBtn}
                  buttonText={
                    replying
                      ? 'Reply'
                      : isEditing?.editing
                      ? 'Update'
                      : 'Comment'
                  }
                  onClick={commentHandler}
                />
              </View>
            </View>
          </View>
        </View>
        {/* </ScrollView> */}
      </View>
      {showDeleteModal && (
        <DeleteModal
          title="Are you sure you want to delete this comment?"
          loader={deleteLoader}
          cancelButtonHandler={showDeleteModalHandler}
          confirmButtonHandler={deleteHandler}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default AllComments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: responsiveHeight(2),
    // height: responsiveHeight(7),
    backgroundColor: globalStyles.themeBlue,
  },
  subContainer: {
    paddingTop: responsiveHeight(1.5),
    width: responsiveWidth(95),
  },
  commentBox: {
    position: 'absolute',
    bottom: 0,
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
  },
  comment: {
    paddingVertical: responsiveHeight(2),
    width: responsiveWidth(100),
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
  },
  textInput: {
    flex: 6,
    paddingHorizontal: responsiveWidth(5),
    height: '100%',
    backgroundColor: 'white',
    color: 'black',
  },
  commentBtn: {
    flex: 2,
    height: responsiveHeight(5),
    elevation: 3,
  },
  replying: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(5),
    width: responsiveWidth(100),
    backgroundColor: globalStyles.veryLightGray,
  },
  replyingText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
    color: globalStyles.themeBlue,
  },
  replyingBtntouch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyingBtn: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
