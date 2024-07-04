import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import React, {useCallback, useRef} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import Header from '../../components/Header/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import DocumentPicker from 'react-native-document-picker';
import ChatSection from '../../components/Chat/ChatSection';
import {globalStyles} from '../../utils/constant';
import {firebase} from '@react-native-firebase/firestore';
import {RootStackParamList} from '../../navigation/MainNavigation';
import {useAppSelector} from '../../redux/Store';
import uuid from 'react-native-uuid';
import {PostApiWithToken, endPoint} from '../../services/Service';
import {useDispatch} from 'react-redux';
import {numberHandler} from '../../redux/TrackNumbers';
import moment from 'moment';

type ChatRouteParams = RouteProp<RootStackParamList, 'Chat'>;

const timeHandler = (timestamp: any) => {
  if (timestamp) {
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const _temp = date.toLocaleString()?.split(',')[1]?.trim()?.split(':');
    const trimTemp = [..._temp[2]?.trim()];
    const period =
      trimTemp[trimTemp?.length - 2] + trimTemp[trimTemp?.length - 1];
    const time = `${_temp[0]}:${_temp[1]} ${period}`;
    return `${moment(date).format('MMM D, YYYY')} ${time}`;
  }
  return '';
};

const Chat = () => {
  // const {params} = useRoute<ChatRouteParams>();
  const dispatch = useDispatch();
  const token = useAppSelector(state => state.auth.token);
  const userData = useAppSelector(state => state.userDetails);
  const flatlistRef = React.useRef<FlatList<any>>(null);
  const [chat, setChat] = React.useState<string>('');
  const [file, setFile] = React.useState(undefined);
  const [ok, setOk] = React.useState<boolean>(false);
  const [chatArray, setChatArray] = React.useState<
    {
      text: string;
      createdAt: string;
      senderId: string;
      _id: string;
    }[]
  >([]);

  React.useEffect(() => {
    setOk(true);
    seenMessageHandler();
  }, []);

  React.useEffect(() => {
    if (chatArray?.length > 0 && ok) {
      flatlistRef?.current?.scrollToIndex({
        animated: false,
        index: chatArray?.length - 1,
      });
    }
  }, [ok, chatArray]);

  React.useEffect(() => {
    let unsubscribe: any;
    const fetchData = async () => {
      unsubscribe = await chatSnapshot();
    };
    fetchData();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const seenMessageHandler = async () => {
    try {
      const response = await PostApiWithToken(endPoint.seenMessage, {}, token);
      if (response?.data?.status) {
        dispatch(numberHandler({unSeenMessage: 0}));
      }
    } catch (err: any) {
      console.log('err in seen message', err?.message);
    }
  };

  const chatSnapshot = async () => {
    try {
      // const temp = firebase
      //   ?.firestore()
      //   .collection('jwj_chats')
      //   .doc(`1-${userData?.id}`)
      //   .collection('messages')
      //   ?.orderBy('createdAt', 'desc');
      const unsubscribe = firebase
        ?.firestore()
        .collection('jwj_chats')
        .doc(`1-${userData?.id}`)
        .collection('messages')
        ?.orderBy('createdAt', 'desc')
        ?.onSnapshot((snapshot: any) => {
          if (!ok) {
            getChatData(snapshot?._docs);
          } else {
            setChatArray((preData: any[]) => [
              {
                createdAt: timeHandler(snapshot?._docs[0]?._data?.createdAt),
                senderId: snapshot?._docs[0]?._data?.sendBy,
                text: snapshot?._docs[0]?._data?.text,
                _id: snapshot?._docs[0]?._data?._id,
              },
              ...preData,
            ]);
            setChat('');
            flatlistRef?.current?.scrollToEnd();
          }
        });
      return unsubscribe;
    } catch (err: any) {
      console.log('err in chat snapshot', err?.message);
    }
  };

  const getChatData = async (data: []) => {
    if (data?.length === 0) {
      return;
    }
    try {
      const arr = data?.map((item: any) => {
        const time = timeHandler(item?._data?.createdAt);
        return {
          text: item?._data?.text,
          createdAt: time,
          senderId: item?._data?.sendBy,
          _id: item?._data?._id,
        };
      });
      if (arr?.length > 0) {
        setChatArray(arr);
      }
    } catch (err: any) {
      console.log('err in getting chat', err);
    }
  };

  const sendChatHandler = async () => {
    const msg = chat;
    const messageId = uuid.v4();
    try {
      setChat('');
      await firebase
        ?.firestore()
        .collection('jwj_chats')
        .doc(`1-${userData?.id}`)
        ?.collection('messages')
        .add({
          text: msg,
          // image: image,
          sendBy: userData?.id,
          sendto: 1,
          adminName: 'JourneyWithJournals',
          userName: userData?.userName,
          user: {
            _id: userData?.id,
          },
          _id: messageId,
          createdAt: new Date(),
        });
      chat && (await PostApiWithToken(endPoint.chatRecord, {msg}, token));
    } catch (err: any) {
      console.log('err in sending text', err?.message);
    }
  };

  const chatHandler = (chat: string) => {
    setChat(chat);
  };

  const documentPicker = useCallback(async () => {
    try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('result', result);
    } catch (err: any) {
      console.log('document picker err', err.message);
    }
  }, []);

  const renderChat = ({item, index}: {item: any; index: number}) => {
    return (
      <ChatSection
        key={index}
        userName={
          item?.senderId == userData?.id
            ? userData?.userName
              ? userData?.userName
              : 'You'
            : 'Admin'
        }
        chat={item?.text}
        own={item?.senderId == userData?.id ? true : false}
        time={item?.createdAt}
      />
    );
  };
  return (
    <View style={styles.conatiner}>
      <View style={styles.headerContainer}>
        <ImageBackground
          source={require('../../assets/Icons/maskGroup-2.png')}
          resizeMode="cover"
          style={styles.chatImage}
        />
        <Header title="Chats" notificationButton={false} />
        <Text style={styles.text}>You need help? Let’s chat.</Text>
      </View>

      {/* chats */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          bounces={false}
          scrollEnabled={chatArray?.length === 0 ? false : true}>
          <View style={styles.chatContainer}>
            {chatArray?.length > 0 ? (
              <FlatList
                keyboardShouldPersistTaps="always"
                inverted={true}
                ref={flatlistRef}
                data={chatArray}
                renderItem={renderChat}
                keyExtractor={(_, index) => index.toString()}
                bounces={false}
                contentContainerStyle={styles.flatlist}
                getItemLayout={(data, index) => ({
                  length: 0,
                  offset: 0 * index,
                  index,
                })}
              />
            ) : (
              <View style={styles.noChatContainer}>
                <Image
                  source={require('../../assets/Icons/no-data-found.png')}
                  resizeMode="contain"
                  style={{
                    height: responsiveHeight(15),
                    width: responsiveWidth(25),
                  }}
                />
                <Text
                  style={{
                    fontSize: responsiveFontSize(3),
                    textAlign: 'center',
                    color: 'black',
                  }}>
                  No messages yet
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        {/* message send section */}
        <View style={styles.sendMessageContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={chat}
              style={styles.textInput}
              onChangeText={chatHandler}
              placeholder="Type message"
              placeholderTextColor="gray"
            />
            <TouchableOpacity style={styles.touch} onPress={documentPicker}>
              <Image
                source={require('../../assets/Icons/attached.png')}
                resizeMode="contain"
                style={styles.attachedFiles}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sendButtonContainer}>
            <TouchableOpacity
              onPress={sendChatHandler}
              style={{
                ...styles.sendButtonTouch,
                backgroundColor:
                  chat.length > 0
                    ? globalStyles.themeBlue
                    : globalStyles.lightGray,
              }}
              disabled={chat.length === 0}>
              <Image
                source={require('../../assets/Icons/send.png')}
                resizeMode="contain"
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    position: 'relative',
    height: responsiveHeight(18),
    backgroundColor: globalStyles.themeBlue,
    borderWidth: 1,
  },
  chatImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
  },
  text: {
    marginTop: responsiveHeight(5),
    width: '100%',
    color: 'white',
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
    opacity: 0.7,
  },
  chatContainer: {
    height: responsiveHeight(75),
  },
  flatlist: {
    paddingBottom: responsiveHeight(2),
  },
  sendMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    paddingHorizontal: '3%',
    height: responsiveHeight(8),
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(6.5),
    width: responsiveWidth(77),
    borderRadius: responsiveHeight(5),
    elevation: 2,
    shadowColor: 'rgba(137, 137, 137, .25)',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    height: '100%',
    width: '80%',
    paddingHorizontal: '5%',
    fontSize: responsiveFontSize(1.8),
    letterSpacing: 0.8,
    color: 'black',
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingRight: responsiveWidth(4),
  },
  attachedFiles: {
    height: responsiveHeight(3),
    width: responsiveWidth(6),
  },
  sendButtonContainer: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
    overflow: 'hidden',
  },
  sendButtonTouch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  sendIcon: {
    height: responsiveHeight(2),
    width: responsiveWidth(5),
  },
  noChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
