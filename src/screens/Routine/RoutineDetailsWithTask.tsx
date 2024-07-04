import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import RoutineListItemDetails from '../../components/Routine/RoutineListItemDetails';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation, RouteProp, useRoute} from '@react-navigation/native';
import {globalStyles} from '../../utils/constant';
import ScreenNames from '../../utils/ScreenNames';
import {RootStackParamList} from '../../navigation/MainNavigation';
import {GetApiWithToken, endPoint} from '../../services/Service';
import {useAppSelector, useAppDispatch} from '../../redux/Store';
import {reloadHandler} from '../../redux/ReloadScreen';
import Toast from 'react-native-toast-message';
import UserListModal from '../../components/Modal/UserListModal';
import SharedRoutineUserlistModal from '../../components/Modal/SharedRoutineUserlistModal';
import {DeleteApi} from '../../services/Service';
import DeleteModal from '../../components/Modal/DeleteModal';

type RoutineDetailsWithTaskParams = RouteProp<
  RootStackParamList,
  'RoutineDetailsWithTask'
>;

const RoutineDetailsWithTask = () => {
  const token = useAppSelector(state => state.auth.token);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const reload = useAppSelector(state => state.reload);
  const {params} = useRoute<RoutineDetailsWithTaskParams>();
  const [data, setData] = React.useState<any>();
  const [showListModal, setShowListModal] = React.useState<boolean>(false);
  const [showSharedUserList, setShowSharedUserList] =
    React.useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeletemodal] = React.useState<boolean>(false);

  React.useEffect(() => {
    getData();
  }, [reload.RoutineDetailsWithTask]);
  const getData = async () => {
    try {
      const response = await GetApiWithToken(
        `${endPoint.RoutineDetails}/${params?.id}`,
        token,
      );
      if (response?.data?.status) {
        setData(response?.data?.data);
      }
      if (!response?.data?.status) {
        response?.data?.message &&
          Toast.show({
            type: 'error',
            text1: response?.data?.message,
          });
      }
    } catch (err: any) {
      console.log('err in routine details', err?.message);
    }
  };

  const editRoutineHandler = () => {
    navigation.navigate(ScreenNames.AddNewRoutine, {
      edit: true,
      data,
      goalId: data?.category_id,
    });
  };

  const shareBtnHandler = () => {
    setShowListModal(value => !value);
  };

  const _showSharedUserListHandler = () => {
    setShowSharedUserList(value => !value);
  };

  const deleteButtonHandler = async () => {
    setShowDeletemodal(true);
  };

  const _deleteButtonHandler = async () => {
    setDeleteLoader(true);
    try {
      const response = await DeleteApi(
        `${endPoint.DeleteRoutine}?id=${params?.id}`,
        token,
      );
      if (response?.data?.status) {
        dispatch(
          reloadHandler({
            [ScreenNames.Routine]: !reload.Routine,
            [ScreenNames.Home]: !reload.Home,
            [ScreenNames.SharedRoutine]: !reload.SharedRoutine,
          }),
        );
        Toast.show({
          type: response?.data?.status ? 'success' : 'error',
          text1: response?.data?.message,
        });
        navigation.goBack();
      }
    } catch (err: any) {
      console.log('err in deleting routine', err?.message);
    } finally {
      setDeleteLoader(false);
      setShowDeletemodal(true);
    }
  };
  console.log(params, data?.createdBy);
  return (
    <>
      <Container
        headerText="Routine Details"
        scrollViewContentContainerStyle={{paddingBottom: responsiveHeight(8)}}>
        <RoutineListItemDetails
          myRoutine={data?.my_routine}
          id={params?.id}
          headerText={data?.category_name}
          headerDate={data?.date}
          imageUri={data?.category_logo}
          descriptionHeading={data?.name}
          description={data?.description}
          // routineType={data?.routinetype}
          routineType={
            data?.created_by === 'shared' ? 'Shared Routine' : 'Private Rouitne'
          }
          totalShare={data?.sharingList?.length}
          showShareButton={true}
          shareButtonHandler={shareBtnHandler}
          editButtonHandler={editRoutineHandler}
          showSharedUserList={true}
          showSharedUserListHandler={_showSharedUserListHandler}
          shareMemberList={data?.sharingList}
          deleteHandler={deleteButtonHandler}
        />
      </Container>
      {showListModal && (
        <UserListModal
          disableModalHandler={shareBtnHandler}
          routineId={params?.id}
        />
      )}
      {showSharedUserList && (
        <SharedRoutineUserlistModal
          disableModalHandler={_showSharedUserListHandler}
          routineId={params?.id}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          confirmButtonHandler={_deleteButtonHandler}
          cancelButtonHandler={() => {
            setShowDeletemodal(false);
          }}
          title="Are you sure you want to delete this routine?"
          loader={deleteLoader}
        />
      )}
    </>
  );
};

export default RoutineDetailsWithTask;

const styles = StyleSheet.create({
  commentButtonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  commentHeadingText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    opacity: 0.6,
  },
  commentButton: {
    height: responsiveHeight(5),
    width: responsiveWidth(30),
  },
  commentButtonTextStyle: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
  },
  commentsContainer: {
    alignItems: 'flex-end',
  },
  commentTab: {
    marginTop: responsiveHeight(1.25),
  },
  noComments: {
    marginTop: responsiveHeight(1.2),
    paddingTop: responsiveHeight(1.5),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  noCommentsImage: {
    height: responsiveHeight(8),
    width: responsiveHeight(8),
  },
  noCommentsText: {
    marginTop: responsiveHeight(1.5),
    fontSize: responsiveFontSize(1.8),
    color: 'black',
    fontWeight: '400',
  },
  wrapper: {
    alignItems: 'flex-start',
    marginTop: responsiveHeight(2),
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(3),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  heading: {
    width: '100%',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
  image: {
    height: responsiveHeight(4),
    width: responsiveFontSize(4),
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    width: '100%',
  },
  meditationText: {
    backgroundColor: 'white',
    color: globalStyles.themeBlue,
    marginLeft: responsiveWidth(1),
    fontWeight: '500',
  },
  text: {
    backgroundColor: globalStyles.themeBlue,
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
    marginLeft: responsiveWidth(3),
    fontWeight: '500',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  icon: {
    height: responsiveHeight(2),
    width: responsiveFontSize(2),
  },
  dateTimeText: {
    color: 'black',
    opacity: 0.8,
    marginLeft: responsiveWidth(2),
  },
  commentTabStyle: {
    marginTop: responsiveHeight(1),
    borderWidth: responsiveWidth(0.1),
    borderColor: globalStyles.lightGray,
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
});
