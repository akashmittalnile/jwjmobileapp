import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import {globalStyles} from '../../utils/constant';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import UploadPicture from '../../components/Upload/UploadPicture';
import BorderBtn from '../../components/Button/BorderBtn';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {PostApiWithToken, endPoint} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';
import {RootStackParamList} from '../../navigation/MainNavigation';
import {reloadHandler} from '../../redux/ReloadScreen';
import ScreenNames from '../../utils/ScreenNames';

interface errProps {
  title: boolean;
  description: boolean;
  file: boolean;
  tick: boolean;
}

interface fileProps {
  filename: string;
  type: string;
  uri: string;
}

type AddNewPostRouteProps = RouteProp<RootStackParamList, 'AddNewPost'>;

const deleteFileIdArray = [];

const AddNewPost = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {params} = useRoute<AddNewPostRouteProps>();
  const token = useAppSelector(state => state.auth.token);
  const followedCommunityDetails = useAppSelector(
    state => state.reload.FollowedCommunityDetails,
  );
  const community = useAppSelector(state => state.reload.Community);
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [profileImage, setProfileImage] = React.useState<fileProps[]>([]);
  const [isTCSelected, setIsTCSelected] = React.useState<boolean>(false);
  const [initialImage, setInitialImage] = React.useState<{}[]>([]);
  const [deleteFileIdArray, setdeleteFileIdArray] = React.useState<number[]>(
    [],
  );
  const [err, setErr] = React.useState<errProps>({
    title: false,
    description: false,
    file: false,
    tick: false,
  });
  const [loader, setLoader] = React.useState<boolean>(false);

  React.useEffect(() => {
    initialDataHandler();
  }, []);

  const initialDataHandler = () => {
    if (params?.editCommunity || params?.editPost) {
      editPostHandler();
    }
  };

  const editPostHandler = () => {
    const title = params?.data[params?.editCommunity ? 'name' : 'title'];
    const {description} = params?.data;
    const temp = params?.data?.image?.map((item: any) => ({
      uri: item?.image,
      id: item?.id,
    }));
    setInitialImage(temp);
    setProfileImage(temp);
    setTitle(title);
    setDescription(description);
    params?.editCommunity && setIsTCSelected(true);
  };

  const titleHandler = (text: string) => {
    setTitle(text);
    setErr(preData => ({
      ...preData,
      title: false,
    }));
  };

  const descriptionHandler = (text: string) => {
    setDescription(text);
    setErr(preData => ({
      ...preData,
      description: false,
    }));
  };

  const uploadImageHandler = (result: any) => {
    if (result?.message) {
      return;
    }
    setProfileImage(result);
    setErr(preData => ({
      ...preData,
      file: false,
    }));
  };

  const newPostHandler = async () => {
    setLoader(true);
    try {
      if (
        description &&
        profileImage.length > 0 &&
        title &&
        (params?.createCommunity || params?.editCommunity ? isTCSelected : true)
      ) {
        let data;
        if (params?.createCommunity) {
          if (params?.editCommunity) {
            data = {
              id: params?.data?.id,
              title,
              description,
            };
            const temp = profileImage?.filter((item: any) => !item?.id);
            if (temp?.length > 0) {
              data['file'] = temp;
            }
            if (deleteFileIdArray?.length > 0) {
              data['deleteFile'] = deleteFileIdArray;
            }
          } else {
            data = {
              title,
              description,
              file: profileImage,
            };
          }
        } else {
          if (params?.editPost) {
            data = {
              id: params?.data?.id,
              title,
              description,
            };
            const temp = profileImage?.filter((item: any) => !item?.id);
            if (temp?.length > 0) {
              data['file'] = temp;
            }
            if (deleteFileIdArray?.length > 0) {
              data['deleteFile'] = deleteFileIdArray;
            }
          } else {
            data = {
              title,
              description,
              file: profileImage,
              community_id: params?.community_id,
            };
          }
        }
        let _endpoint = '';
        if (params?.createCommunity) {
          if (params?.editCommunity) {
            _endpoint = endPoint?.editCommunity;
          } else {
            _endpoint = endPoint?.createCommunity;
          }
        } else {
          if (params?.editPost) {
            _endpoint = endPoint?.EditPost;
          } else {
            _endpoint = endPoint?.createPost;
          }
        }
        const response = await PostApiWithToken(_endpoint, data, token);
        if (response?.data?.status) {
          dispatch(
            reloadHandler({
              [ScreenNames.Community]: !community,
              [ScreenNames.FollowedCommunityDetails]: !followedCommunityDetails,
            }),
          );
          navigation.goBack();
        }
        Toast.show({
          type: response?.data?.status ? 'success' : 'error',
          text1: response?.data?.message,
        });
        return;
      }
      if (profileImage.length === 0) {
        setErr(preData => ({
          ...preData,
          file: true,
        }));
      }
      if (!title) {
        setErr(preData => ({
          ...preData,
          title: true,
        }));
      }
      if (!description) {
        setErr(preData => ({
          ...preData,
          description: true,
        }));
      }
      if (params?.createCommunity && !isTCSelected) {
        setErr(preData => ({
          ...preData,
          tick: true,
        }));
      }
    } catch (err: any) {
      console.log('err in creating community', err.message);
    } finally {
      setLoader(false);
    }
  };

  const onRemoveInitialImageHandler = (id: number) => {
    if (id) {
      setdeleteFileIdArray(preData => [...preData, id]);
    }
  };

  const termAndConditionHandler = () => {
    if (params?.createCommunity) {
      setIsTCSelected(value => !value);
      setErr(preData => ({
        ...preData,
        tick: false,
      }));
    }
  };

  const refreshHandler = () => {
    if (params?.editCommunity || params?.editPost) {
      editPostHandler();
    } else {
      setTitle('');
      setDescription('');
      setProfileImage([]);
      setIsTCSelected(false);
      setInitialImage([]);
      setdeleteFileIdArray([]);
      setErr({
        title: false,
        description: false,
        file: false,
        tick: false,
      });
      setLoader(false);
    }
  };

  return (
    <Container
      headerText={
        params?.createCommunity
          ? params?.editCommunity
            ? 'Edit Community'
            : 'Create New Community'
          : params?.editPost
          ? 'Edit Post'
          : 'Add New Post'
      }
      onRefreshHandler={refreshHandler}
      reloadOnScroll={true}>
      <TextInput
        value={title}
        style={{
          ...styles.title,
          borderColor: err.title ? 'red' : globalStyles.borderColorBlue,
        }}
        placeholder="Title"
        placeholderTextColor={globalStyles.midGray}
        onChangeText={titleHandler}
      />
      <TextInput
        value={description}
        style={{
          ...styles.description,
          borderColor: err.description ? 'red' : globalStyles.borderColorBlue,
        }}
        placeholder="Type Your Description Here…"
        placeholderTextColor={globalStyles.midGray}
        onChangeText={descriptionHandler}
        multiline
      />
      <UploadPicture
        uri={initialImage}
        cropingDetails={{
          height: responsiveHeight(17),
          width: responsiveWidth(90),
          cropping: true,
        }}
        style={{
          borderWidth: responsiveWidth(0.2),
          borderColor: err.file ? 'red' : globalStyles.borderColorBlue,
        }}
        onClick={file => {
          uploadImageHandler(file);
        }}
        placeholder={'Upload Photos'}
        multipleImage={true}
        onRemoveInitialImage={onRemoveInitialImageHandler}
      />

      {/* term & condition */}
      {params?.createCommunity && (
        <View style={styles.terms}>
          <View
            style={{
              ...styles.tickImageContainer,
              borderWidth: responsiveWidth(0.2),
              borderColor: err.tick ? 'red' : globalStyles.textGray,
              backgroundColor: isTCSelected
                ? globalStyles.themeBlue
                : 'transparent',
            }}>
            <TouchableOpacity
              style={styles.termTickTouch}
              onPress={termAndConditionHandler}>
              {isTCSelected && (
                <Image
                  source={require('../../assets/Icons/tick.png')}
                  resizeMode="contain"
                  style={styles.tickImage}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.termsTextContainer}>
            <Text style={styles.termText}>I accept</Text>
            <TouchableOpacity>
              <Text
                style={{
                  ...styles.termText,
                  color: globalStyles.themeBlue,
                  textDecorationLine: 'underline',
                }}>{` Terms and Conditions`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <BorderBtn
        loader={loader}
        buttonText={
          params?.createCommunity
            ? params?.editCommunity
              ? 'Update'
              : 'Save & Create Community'
            : params?.editPost
            ? 'Update'
            : 'Post'
        }
        onClick={newPostHandler}
        containerStyle={styles.button}
      />
    </Container>
  );
};

export default AddNewPost;

const styles = StyleSheet.create({
  title: {
    height: responsiveHeight(7),
    width: '100%',
    borderWidth: responsiveWidth(0.2),
    borderRadius: responsiveWidth(2),
    borderColor: globalStyles.borderColorBlue,
    ...globalStyles.shadowStyle,
    paddingHorizontal: responsiveWidth(3),
    fontSize: responsiveFontSize(1.6),
    color: 'black',
    fontWeight: '400',
    letterSpacing: 0.8,
  },
  description: {
    marginTop: responsiveHeight(1.6),
    height: responsiveHeight(18),
    width: '100%',
    borderWidth: responsiveWidth(0.2),
    borderRadius: responsiveWidth(2),
    borderColor: globalStyles.borderColorBlue,
    ...globalStyles.shadowStyle,
    paddingHorizontal: responsiveWidth(3),
    paddingTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.6),
    color: 'black',
    fontWeight: '400',
    letterSpacing: 0.8,
  },
  button: {
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(15),
    width: '100%',
  },
  terms: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  tickImageContainer: {
    height: responsiveHeight(2.5),
    width: responsiveHeight(2.5),
    borderRadius: 5,
    borderColor: globalStyles.textGray,
    overflow: 'hidden',
  },
  termTickTouch: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  tickImage: {
    height: responsiveHeight(1),
    width: responsiveHeight(1),
  },
  termsTextContainer: {
    flexDirection: 'row',
    marginLeft: responsiveWidth(2.4),
  },
  termText: {
    fontSize: responsiveFontSize(1.6),
    color: 'black',
  },
});
