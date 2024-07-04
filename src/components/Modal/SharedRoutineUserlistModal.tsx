import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import SearchBarWithInsideIcon from '../SearchBar/SearchBarWithInsideIcon';
import {globalStyles} from '../../utils/constant';
import UserListItem from './UserListItem';
import {GetApiWithToken, endPoint, baseURL} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import BorderBtn from '../Button/BorderBtn';
import ImageSkeletonContainer from '../Skeleton/ImageSkeletonContainer';
import Toast from 'react-native-toast-message';
import {reloadHandler} from '../../redux/ReloadScreen';
import ScreenNames from '../../utils/ScreenNames';

interface SharedRoutineUserlistModalProps {
  disableModalHandler: () => void;
  routineId: number;
}

let timeout: any;

const SharedRoutineUserlistModal: React.FC<SharedRoutineUserlistModalProps> = ({
  disableModalHandler,
  routineId,
}) => {
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload.RoutineDetailsWithTask);
  const dispatch = useAppDispatch();
  const [userList, setUserList] = React.useState<any[]>([]);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([]);
  const [loader, setLoader] = React.useState<boolean>(false);

  React.useEffect(() => {
    getUserList('');
  }, []);

  const getUserList = async (key: string) => {
    setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(
        `${endPoint.RoutineDetails}/${routineId}`,
        token,
      );
      if (response?.data?.status) {
        setUserList(response?.data?.data?.sharingList);
      }
    } catch (err: any) {
      console.log('err in userlist', err?.message);
    } finally {
      setShowSkeleton(false);
    }
  };

  const selectedUsersHandler = (id: number) => {
    return;
    // if (selectedUsers?.includes(id)) {
    //   const temp = selectedUsers?.filter((item: number) => item !== id);
    //   setSelectedUsers(temp);
    // } else {
    //   setSelectedUsers(arr => [...arr, id]);
    // }
  };

  const debounceHandler = (text: string) => {
    if (timeout) {
      clearInterval(timeout);
    }
    timeout = setTimeout(() => {
      getUserList(`${text}`);
    }, 400);
  };

  const renderUserList = userList?.map((item: any, index: number) => (
    <UserListItem
      clickable={false}
      key={`${index}${item?.id}`}
      id={item?.id}
      username={item?.share_to_user_name}
      profileImage={item?.share_to_user_profile}
      onClick={selectedUsersHandler}
    />
  ));

  const cancelModal = () => {
    disableModalHandler && disableModalHandler();
  };

  const convertToFormData = (data: any) => {
    const formData = new FormData();
    for (const key in data) {
      if (Array.isArray(data[key])) {
        for (let i = 0; i < data[key]?.length; i++) {
          formData?.append('user_id[]', data[key][i]);
        }
      } else {
        formData?.append(key, data[key]);
      }
    }
    return formData;
  };

  // const shareRoutineHandler = async () => {
  //   setLoader(true);
  //   try {
  //     const data = {
  //       id: routineId,
  //       selectedUsers,
  //     };
  //     const _formData = convertToFormData(data);
  //     const result: any = await fetch(`${baseURL}${endPoint.shareRoutine}`, {
  //       method: 'POST',
  //       body: _formData,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     const response = await result?.json();
  //     if (response?.status) {
  //       dispatch(
  //         reloadHandler({[ScreenNames.RoutineDetailsWithTask]: !reload}),
  //       );
  //       disableModalHandler();
  //     }
  //     Toast.show({
  //       type: response?.status ? 'success' : 'error',
  //       text1: response?.message,
  //     });
  //   } catch (err: any) {
  //     console.log('err in sharing routine', err?.message);
  //   } finally {
  //     setLoader(false);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.heading}>Shared Users</Text>
        {/* <SearchBarWithInsideIcon
          style={styles.search}
          onSearch={debounceHandler}
        /> */}
        <View style={styles.scrollviewContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            {!showSkeleton ? renderUserList : <ImageSkeletonContainer />}
          </ScrollView>
          {/* <BorderBtn
            loader={loader}
            disable={selectedUsers?.length === 0}
            buttonText="Share"
            onClick={shareRoutineHandler}
            containerStyle={styles.shareButton}
          /> */}
        </View>
        <TouchableOpacity style={styles.canceltouch} onPress={cancelModal}>
          <Image
            source={require('../../assets/Icons/cancel.png')}
            resizeMode="contain"
            style={styles.cancelIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SharedRoutineUserlistModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  subContainer: {
    position: 'relative',
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    width: '95%',
    backgroundColor: 'white',
    borderRadius: responsiveWidth(4),
  },
  heading: {
    marginBottom: responsiveHeight(1),
    fontSize: responsiveFontSize(2),
    color: 'black',
    letterSpacing: 0.8,
  },
  search: {
    marginTop: responsiveHeight(0.5),
    height: responsiveHeight(6),
    borderWidth: responsiveWidth(0.23),
    borderColor: globalStyles.lightGray,
  },
  scrollviewContainer: {
    height: responsiveHeight(60),
  },
  scrollView: {
    marginTop: responsiveHeight(1),
  },
  shareButton: {
    marginTop: responsiveHeight(1),
    width: '100%',
  },
  canceltouch: {
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveWidth(3),
  },
  cancelIcon: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
  },
});
