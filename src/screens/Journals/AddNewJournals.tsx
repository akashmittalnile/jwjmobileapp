import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  PermissionsAndroid,
  Vibration,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/MainNavigation';
import {baseURL} from '../../services/Service';
import {globalStyles} from '../../utils/constant';
import DisableIconTab from '../../components/Tab/DIsableIconTab';
import FormatInput from '../../components/CustomInput/FormatInput';
import textButtonIcon from '../../assets/Icons/pen.png';
import micButtonIcon from '../../assets/Icons/microphone.png';
import _micButtonIcon from '../../assets/Icons/microphone-white.png';
import svgMicBlue from '../../assets/Icons/mic-blue.svg';
import svgMicWhite from '../../assets/Icons/mic.svg';
import BorderBtn from '../../components/Button/BorderBtn';
import SpeakModal from '../../components/Modal/SpeakModal';
import UploadPicture from '../../components/Upload/UploadPicture';
import ScreenNames from '../../utils/ScreenNames';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import Tag from '../../components/Tag/Tag';
import {endPoint} from '../../services/Service';
import Toast from 'react-native-toast-message';
import {reloadHandler} from '../../redux/ReloadScreen';
import {moodColorHandler} from '../../utils/Method';
import Voice from '@react-native-voice/voice';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import AnimatedCircle from '../../components/AnimatedCircle/AnimatedCircle';
import SvgUri from 'react-native-svg-uri';

// const textButtonIconPath = Image.resolveAssetSource(textButtonIcon).uri;
// const micButtonIconPath = Image.resolveAssetSource(micButtonIcon).uri;
// const _micButtonIconPath = Image.resolveAssetSource(_micButtonIcon).uri;

type AddNewJournalsRouteProp = RouteProp<RootStackParamList, 'AddNewJournals'>;

let shouldKeyboardOffWithTags: any = true;
let myText: any = null;
let intervalId: any = null;

const AddNewJournals = () => {
  const glowValue = useSharedValue(0);
  const navigation = useNavigation();
  const moodData = useAppSelector(state => state.mood);
  const token = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();
  const home = useAppSelector(state => state.reload.Home);
  const calendar = useAppSelector(state => state.reload.MoodCalendar);
  const {params} = useRoute<AddNewJournalsRouteProp>();
  const [mood, setMood] = React.useState<string>('');
  const [typeModal, setTypeModal] = React.useState<string>('write');
  const [title, setTitle] = React.useState<string>('');
  const [content, setContent] = React.useState<string>('');
  const [criteria, setCriteria] = React.useState<
    {id: number | string; name: string}[]
  >([]);
  const [showSpeakModal, setShowSpeakMoal] = React.useState<boolean>(false);
  const [profileImage, setProfileImage] = React.useState<{}[]>([]);
  const [err, setErr] = React.useState({
    title: false,
    content: false,
    profileImage: false,
    criteria: false,
  });
  const [loader, setLoader] = React.useState<boolean>(false);
  const [isCriteriaValid, setIsCriteriaValid] = React.useState<boolean>(false);
  const [removeImageId, setRemoveImageId] = React.useState<number[]>([]);
  const [shouldRefresh, setShouldRefresh] = React.useState<boolean>(false);
  const [reloadJournal, setReloadJournal] = React.useState<boolean>(false);
  const [recognizedText, setRecognizedText] = React.useState('');
  const [isListening, setIsListening] = React.useState<boolean>(false);

  React.useEffect(() => {
    // myText = value ? value : '';
    // if (!oldText) {
    //   setRecognizedText(value);
    // }
    // value && setOldText(value);
    // setRecognizedText(value ? value : '');
  }, []);

  React.useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    // Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechPartialResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  React.useEffect(() => {
    if (params?.data?.id) {
      setMood(params?.data?.mood_id);
      setTitle(params?.data?.title);
      setRecognizedText(params?.data?.content);
      // setContent(params?.data?.content);
      // setCriteria(params?.data?.search_criteria);
      const temp = params?.data?.images?.map((item: any) => ({
        id: item?.id,
        uri: item?.img_path,
      }));
      setProfileImage(temp);
    } else if (params?.mood) {
      setMood(params?.mood);
    }

    return () => {
      shouldKeyboardOffWithTags = null;
    };
  }, [params?.mood, reloadJournal]);
  // console.log(criteria);
  const moodHandler = (mood_id: string) => {
    setMood(mood_id);
  };

  const startAnimation = () => {
    glowValue.value = withTiming(
      1,
      {
        duration: 1500,
        easing: Easing.linear,
      },
      () => {
        glowValue.value = withTiming(0, {
          duration: 1500,
          easing: Easing.linear,
        });
      },
    );

    intervalId = setInterval(() => {
      glowValue.value = withTiming(glowValue.value === 0 ? 1 : 0, {
        duration: 1500,
        easing: Easing.linear,
      });
    }, 1500);
  };

  const stopAnimation = () => {
    if (intervalId) {
      glowValue.value = withTiming(0, {
        duration: 1500,
        easing: Easing.linear,
      });
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: glowValue.value,
      borderColor: `rgba(208, 240, 192, ${glowValue?.value})`,
    };
  });

  const onRefresh = () => {
    setReloadJournal(value => !value);
  };

  const moodTab = moodData.map((item, index) => (
    <DisableIconTab
      onPress={() => {
        moodHandler(item?.id);
      }}
      logo={item?.logo}
      key={index.toString()}
      text={item.name}
      disableButton={loader}
      // disbaleImage={mood === item?.id ? false : true}
      selected={mood === item?.id ? true : false}
      textStyle={{color: moodColorHandler(item.name)}}
    />
  ));

  const errStateHandler = (obj: {}) => {
    setErr(preState => ({
      ...preState,
      ...obj,
    }));
  };

  const titleHandler = (text: string) => {
    setTitle(text);
    err.title && errStateHandler({title: false});
  };

  const contentHandler = (text: string) => {
    setContent(text);
    err.content && errStateHandler({content: false});
  };

  const imagePicker = async (result: any) => {
    setProfileImage(result);
    err.profileImage && errStateHandler({profileImage: false});
  };

  const criteriaValidator = () => {
    if (params?.data?.id) {
      const oldCriteria = criteria?.filter((item: any) => item?.editable);
      const newCriteria = criteria?.filter((item: any) => !item?.editable);
      if (newCriteria?.length > 0) {
        return true;
      } else {
        if (params?.data?.search_criteria?.length === oldCriteria?.length) {
          errStateHandler({criteria: true});
          return false;
        } else {
          return true;
        }
      }
    } else {
      if (criteria?.length > 0) {
        return true;
      } else {
        errStateHandler({criteria: true});
        return false;
      }
    }
  };

  const saveButtonHandler = async () => {
    try {
      stopAnimation();
      setLoader(true);
      const isCriteriaTagValid = criteriaValidator();
      if (title && recognizedText && mood && isCriteriaTagValid) {
        let count = 0;
        const formData = new FormData();
        params?.data?.id && formData.append('id', params?.data?.id);
        formData.append('title', title);
        formData.append('content', recognizedText);
        formData.append('mood_id', mood);
        for (let i = 0; i < criteria?.length; i++) {
          if (params?.data?.id) {
            if (criteria[i]?.editable) {
              formData.append(`deletecriteria[]`, criteria[i]?.id);
              continue;
            }
          }
          if (criteria[i]?.id === criteria[i]?.name) {
            formData.append(`new_criteria[]`, criteria[i]?.name);
          } else {
            formData.append(`criteria[${count}]`, criteria[i]?.id);
            count++;
          }
        }
        // criteria.forEach((item: any, index: number) => {
        //   formData.append(`criteria[${index}]`, item?.id);
        // });
        if (params?.data?.id) {
          const temp = profileImage?.filter((item: any) => !item?.id);
          temp.forEach((item: any) => {
            formData.append(`file[]`, {
              uri: item?.uri,
              name: item?.filename,
              type: item?.mime,
            });
          });
          removeImageId?.forEach((item: number) => {
            formData.append(`deletefile[]`, item);
          });
        } else {
          profileImage.forEach((item: any) => {
            formData.append(`file[]`, {
              uri: item?.uri,
              name: item?.filename,
              type: item?.mime,
            });
          });
        }
        console.log(formData,baseURL);
        let response: any = await fetch(
          baseURL +
            `${
              params?.data?.id ? endPoint.editJournal : endPoint.createJournal
            }`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );
        console.log('response 1', response)
        response = await response.json();
        console.log('response 2', response)
        if (response?.status) {
          dispatch(
            reloadHandler({
              // [ScreenNames.Journals]: !journal,
              MoodCalendar: !calendar,
              [ScreenNames.Home]: !home,
            }),
          );
          Toast.show({
            type: 'success',
            text1: response?.message,
          });
          navigation.navigate(ScreenNames.JournalsInfo, {
            journalsId: response?.data?.id,
          });
        }
        if (!response?.status) {
          Toast.show({
            type: 'error',
            text1: response?.message || 'Error Occured',
          });
        }
      }
      if (!title) {
        errStateHandler({title: true});
      }
      if (!recognizedText) {
        errStateHandler({content: true});
      }
    } catch (err: any) {
      console.log('err in create journals', err.message);
    } finally {
      setLoader(false);
    }
  };

  const onTagFocus = () => {
    shouldKeyboardOffWithTags = false;
  };
  const onTagBlur = () => {
    shouldKeyboardOffWithTags = true;
  };

  const onSpeechStartHandler = async () => {
    myText = recognizedText;
    Vibration?.vibrate(70);
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid?.request(
        PermissionsAndroid?.PERMISSIONS.RECORD_AUDIO,
      );
      if (result === 'granted') {
        Voice.start('en-US', {partialResults: true});
      } else {
        console.log('failed', {result});
      }
    } else {
      Voice.start('en-US', {partialResults: true});
    }
  };

  const onSpeechStart = () => {
    startAnimation();
    setIsListening(true);
  };

  const onSpeechRecognized = () => {};

  const onSpeechEnd = () => {
    intervalId && stopAnimation();
    // setIsListening(false);
  };

  const onSpeechError = (error: any) => {};

  const onSpeechResults = (event: any) => {
    setRecognizedText(
      myText ? myText + ' ' + event?.value[0] : event?.value[0],
    );
    err?.content && setErr(preData => ({...preData, content: false}));
  };

  const stopListening = async () => {
    setTimeout(() => {
      myText = recognizedText;
    }, 200);
    intervalId && stopAnimation();
    setIsListening(false);

    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const speechToTextHandler = () => {
    if (intervalId) {
      stopListening();
    } else {
      onSpeechStartHandler();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      onTouchEnd={() => {
        console.log('click');
        Keyboard?.isVisible() &&
          shouldKeyboardOffWithTags &&
          Keyboard?.dismiss();
      }}>
      <>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Header
              title={params?.data?.id ? 'Edit Journals' : 'Add New Journals'}
              notificationButton={false}
              disableBackButton={loader}
            />
          </View>
          <View style={styles.subContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={true}
              keyboardShouldPersistTaps="always"
              refreshControl={
                <RefreshControl
                  refreshing={shouldRefresh}
                  onRefresh={onRefresh}
                />
              }>
              {/* mood */}
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{marginTop: responsiveHeight(1)}}
                keyboardShouldPersistTaps="always">
                {moodTab}
                {shouldRefresh && (
                  <ActivityIndicator
                    size="large"
                    color={globalStyles.themeBlue}
                  />
                )}
              </ScrollView>

              {/* journal title */}
              <View
                style={{
                  ...styles.titleContainer,
                  borderColor: err.title ? 'red' : globalStyles.borderColorBlue,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    Keyboard.dismiss();
                  }}
                  style={{borderWidth: 1}}>
                  <TextInput
                    value={title}
                    editable={!loader}
                    onChangeText={titleHandler}
                    placeholder="Journal Title"
                    placeholderTextColor={globalStyles.textGray}
                    style={styles.textInputStyle}
                  />
                </TouchableWithoutFeedback>
              </View>

              {/* input */}
              <View>
                <Animated.View
                  style={[
                    styles.titleContainer,
                    styles.box,
                    animatedStyle,
                    {borderColor: err?.content ? 'red' : 'transparent'},
                  ]}>
                  <TextInput
                    value={recognizedText}
                    editable={true}
                    onChangeText={(text: any) => {
                      setRecognizedText(text);
                      setErr(preData => ({...preData, content: false}));
                    }}
                    placeholder="Type Your Notes Here..."
                    placeholderTextColor={globalStyles.textGray}
                    style={[styles.textInputStyle, {width: '85%'}]}
                    multiline={true}
                  />
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: responsiveWidth(2),
                      height: responsiveHeight(6),
                      width: responsiveHeight(6),
                      borderRadius: responsiveHeight(3),
                      backgroundColor: intervalId
                        ? globalStyles.themeBlue
                        : 'white',
                      borderWidth: responsiveWidth(0.4),
                      borderColor: globalStyles.themeBlue,
                    }}
                    // onLongPress={onSpeechStartHandler}
                    // onPressOut={stopListening}
                    onPress={speechToTextHandler}>
                    {/* <Image
                      source={{uri: _micButtonIconPath}}
                      style={{
                        alignSelf: 'center',
                        height: responsiveHeight(3),
                        width: responsiveWidth(5),
                      }}
                      resizeMode="contain"
                    /> */}
                    <SvgUri
                      source={{
                        uri: Image.resolveAssetSource(
                          intervalId ? svgMicWhite : svgMicBlue,
                        )?.uri,
                      }}
                      height={responsiveHeight(3.5)}
                      width={responsiveHeight(3.5)}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      position: 'absolute',
                      top: responsiveWidth(2),
                      right: responsiveWidth(2),
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: responsiveWidth(4),
                      width: responsiveHeight(4),
                    }}>
                    {intervalId && <AnimatedCircle />}
                  </View>
                </Animated.View>
                {/* <FormatInput
                  value={content}
                  onChangeText={text => contentHandler(text)}
                  onClickBottomLeftButton={() => {
                    setTypeModal('write');
                  }}
                  onClickBottomRightButton={() => {
                    if (loader) {
                      return;
                    }
                    Keyboard?.dismiss();
                    setTypeModal('speak');
                    // setShowSpeakMoal(true);
                  }}
                  placeholder="Type Your Notes Here..."
                  textButtonText="Write"
                  micButtonText="Speak"
                  textButtunIcon={textButtonIconPath}
                  micButtonIcon={micButtonIconPath}
                  _micButtonIcon={_micButtonIconPath}
                  editable={!loader}
                  style={{
                    borderWidth: responsiveWidth(0.2),
                    borderColor: err.content
                      ? 'red'
                      : globalStyles.borderColorBlue,
                  }}
                /> */}
              </View>

              {/* upload picture */}
              <View style={styles.uploadImageContainer}>
                <UploadPicture
                  disable={loader}
                  uri={profileImage}
                  cropingDetails={{
                    height: responsiveHeight(17),
                    width: responsiveWidth(90),
                    cropping: true,
                  }}
                  multipleImage={true}
                  onClick={imagePicker}
                  style={{
                    borderWidth: responsiveWidth(0.2),
                    borderRadius: responsiveWidth(2),
                    borderColor: err.profileImage
                      ? 'red'
                      : globalStyles.borderColorBlue,
                  }}
                  placeholder="Upload Photos"
                  clickable={loader}
                  onRemoveInitialImage={(id: number) => {
                    setRemoveImageId(preData => [...preData, id]);
                  }}
                />
              </View>
              {/* search criteria */}
              <Tag
                disableButtons={loader}
                edit={params?.data?.id ? true : false}
                value={params?.data?.search_criteria}
                style={{borderColor: err.criteria ? 'red' : 'transparent'}}
                tagHandler={(tags: {}[], isValid?: boolean) => {
                  isValid && setIsCriteriaValid(true);
                  setCriteria(tags);
                  err.criteria && errStateHandler({criteria: false});
                }}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                onTagFocus={onTagFocus}
                onTagBlur={onTagBlur}
              />
              <View style={styles.saveButtonContainer}>
                <BorderBtn
                  disable={loader}
                  loader={loader}
                  buttonText={
                    params?.data?.id ? 'Update Journal' : 'Add New Journal'
                  }
                  onClick={saveButtonHandler}
                  containerStyle={{width: '100%'}}
                />
              </View>
            </ScrollView>
          </View>
        </View>
        {/* {typeModal !== 'write' && showSpeakModal && (
          <SpeakModal
            value={content}
            onPress={() => {}}
            disableModal={text => {
              contentHandler(text);
              setShowSpeakMoal(false);
            }}
          />
        )} */}
      </>
    </KeyboardAvoidingView>
  );
};

export default AddNewJournals;

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
    backgroundColor: globalStyles.themeBlue,
  },
  subContainer: {
    flex: 1,
    width: responsiveWidth(95),
    // paddingTop: responsiveHeight(1.5),
  },
  titleContainer: {
    marginTop: responsiveHeight(2),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(2),
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
    borderWidth: responsiveWidth(0.2),
    overflow: 'hidden',
  },
  textInputStyle: {
    height: '100%',
    width: '100%',
    paddingHorizontal: responsiveWidth(3),
    color: 'black',
  },
  wrapper: {
    marginTop: responsiveHeight(2),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    width: '100%',
  },
  uploadImageContainer: {},
  imagePickerTouch: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  img: {
    flex: 1,
    height: responsiveHeight(3),
    width: responsiveHeight(3),
  },
  saveButtonContainer: {
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(3),
  },
  box: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: responsiveHeight(15),
    borderRadius: 20,
    borderWidth: responsiveWidth(0.4),
    shadowColor: globalStyles.themeBlue,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 20,
  },
});
