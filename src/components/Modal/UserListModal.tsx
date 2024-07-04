import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Keyboard,
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

interface UserListModalProps {
  disableModalHandler: () => void;
  routineId: number;
}

let timeout: any;

let pagination = {
  currentPage: 1,
  lastPage: 1,
  loader: false,
};

const UserListModal: React.FC<UserListModalProps> = ({
  disableModalHandler,
  routineId,
}) => {
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload);
  const dispatch = useAppDispatch();
  const [userList, setUserList] = React.useState<any[] | undefined>(undefined);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([]);
  const [loader, setLoader] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [paginationLoader, setPaginationLoader] =
    React.useState<boolean>(false);
  const [height, setHeight] = React.useState<number>(60);

  React.useEffect(() => {
    pagination = {
      currentPage: 1,
      lastPage: 1,
      loader: false,
    };
    getUserList('');
  }, []);

  React.useEffect(() => {
    const openKeyboardEvevnt = Keyboard.addListener('keyboardDidShow', () => {
      setHeight(25);
    });

    const closeKeyboardEvevnt = Keyboard.addListener('keyboardDidHide', () => {
      setHeight(60);
    });

    return () => {
      openKeyboardEvevnt.remove();
      closeKeyboardEvevnt.remove();
    };
  }, []);

  const getUserList = async (key: string, loader = true) => {
    loader && setShowSkeleton(true);
    let _endpoint;
    if (key) {
      _endpoint = `${endPoint.userList}${key}&routine_id=${routineId}&page=${pagination.currentPage}`;
    } else {
      _endpoint = `${endPoint.userList}?routine_id=${routineId}&page=${pagination.currentPage}`;
    }
    try {
      const response = await GetApiWithToken(_endpoint, token);
      if (response?.data?.status) {
        pagination.currentPage === 1
          ? setUserList(response?.data?.data?.data)
          : setUserList(preData => [...preData, ...response?.data?.data?.data]);
        pagination.currentPage =
          response?.data?.data?.pagination?.currentPage + 1;
        pagination.lastPage = response?.data?.data?.pagination?.lastPage;
        pagination.loader = false;
      }
    } catch (err: any) {
      console.log('err in userlist', err?.message);
    } finally {
      loader && setShowSkeleton(false);
      setPaginationLoader(false);
    }
  };

  const selectedUsersHandler = (id: number) => {
    if (selectedUsers?.includes(id)) {
      const temp = selectedUsers?.filter((item: number) => item !== id);
      setSelectedUsers(temp);
    } else {
      setSelectedUsers(arr => [...arr, id]);
    }
  };

  const debounceHandler = (text: string) => {
    if (timeout) {
      clearInterval(timeout);
    }
    timeout = setTimeout(() => {
      (pagination.currentPage = 1),
        (pagination.lastPage = 1),
        (pagination.loader = false);
      setSearch(text?.split('=')[1]);
      getUserList(`${text}`);
    }, 400);
  };

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

  const shareRoutineHandler = async () => {
    setLoader(true);
    try {
      const data = {
        id: routineId,
        selectedUsers,
      };
      const _formData = convertToFormData(data);
      const result: any = await fetch(`${baseURL}${endPoint.shareRoutine}`, {
        method: 'POST',
        body: _formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = await result?.json();
      if (response?.status) {
        dispatch(
          reloadHandler({
            [ScreenNames.RoutineDetailsWithTask]:
              !reload.RoutineDetailsWithTask,
            [ScreenNames.Routine]: !reload.Routine,
            [ScreenNames.Profile]: !reload.Profile,
          }),
        );
        disableModalHandler();
      }
      Toast.show({
        type: response?.status ? 'success' : 'error',
        text1: response?.message,
      });
    } catch (err: any) {
      console.log('err in sharing routine', err?.message);
    } finally {
      setLoader(false);
    }
  };

  const flatlistHeader = (
    <View style={styles.noDataFoundContainer}>
      <Image
        source={require('../../assets/Icons/no-data-found.png')}
        style={styles.noUserFoundImage}
        resizeMode="contain"
      />
      <Text style={styles.noUserFound}>No User Found</Text>
    </View>
  );

  const renderData = ({item}: {item: any}) => (
    <UserListItem
      selected={selectedUsers?.includes(item?.id)}
      id={item?.id}
      username={item?.user_name}
      profileImage={item?.profile}
      onClick={selectedUsersHandler}
    />
  );

  const handlePagination = () => {
    if (
      search &&
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      getUserList(`?name=${search}`, false);
    } else if (
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      getUserList('', false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.heading}>User List</Text>
        <SearchBarWithInsideIcon
          value={search}
          onClear={() => {
            pagination.currentPage = 1;
            pagination.lastPage = 1;
            pagination.loader = false;
            setSearch('');
            getUserList('');
          }}
          style={styles.search}
          onSearch={debounceHandler}
        />
        <View
          style={{
            ...styles.scrollviewContainer,
            height: responsiveHeight(height),
          }}>
          {showSkeleton ? (
            <ImageSkeletonContainer />
          ) : (
            <FlatList
              data={userList}
              ListHeaderComponent={
                userList?.length === 0 ? flatlistHeader : null
              }
              renderItem={renderData}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              onEndReached={handlePagination}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                paginationLoader ? (
                  <ActivityIndicator
                    color={globalStyles.themeBlue}
                    size="large"
                    style={{marginTop: responsiveHeight(2)}}
                  />
                ) : null
              }
            />
          )}
          <BorderBtn
            loader={loader}
            disable={selectedUsers?.length === 0}
            buttonText="Share"
            onClick={shareRoutineHandler}
            containerStyle={styles.shareButton}
          />
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

export default UserListModal;

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
    marginBottom: responsiveHeight(1),
    height: responsiveHeight(6),
    borderWidth: responsiveWidth(0.23),
    borderColor: globalStyles.lightGray,
  },
  scrollviewContainer: {
    overflow: 'hidden',
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
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
    textAlign: 'center',
    color: 'black'
  },
});
