import {View, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Calendar} from 'react-native-calendars';
import Container from '../../components/Container/Container';
import HorizontalCalendarStrip from '../../components/Calendar/HorizontalCalendarStrip';
import BorderBtn from '../../components/Button/BorderBtn';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import MessageTab from '../../components/Message/MessageTab';
import userIcon from '../../assets/Images/user-2.png';
import {GetApiWithToken, endPoint} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import {firebase} from '@react-native-firebase/firestore';

const tempArray = [
  {title: 'Show all'},
  {title: 'Christian Group'},
  {title: 'Church Group'},
];

const Messages = () => {
  const token = useAppSelector(state => state.auth.token);
  const [date, setDate] = React.useState<Date>(new Date());
  const [users, setUsers] = React.useState<any[]>([]);
  const [selectedButton, setSelectedButton] = React.useState<string>(
    tempArray[0].title,
  );

  React.useEffect(() => {
    getUserList();
  }, []);

  // React.useEffect(() => {
  //   getUnreadMessage();
  // }, []);

  // const getUnreadMessage = async () => {
  //   try {
  //     firebase
  //       .firestore()
  //       .collection('chats')
  //       .doc('4445')
  //       .collection('messages')
  //       ?.orderBy('createdAt', 'desc')
  //       .onSnapshot((snapshot: any) => {
  //         console.log('unread', snapshot?._docs);
  //       });
  //   } catch (err: any) {
  //     console.log('err in unread message', err?.message);
  //   }
  // };

  const getUserList = async () => {
    try {
      const response = await GetApiWithToken(endPoint.userList, token);
      if (response?.data?.status) {
        setUsers(response?.data?.data);
      }
    } catch (err: any) {
      console.log('err in message', err?.message);
    }
  };

  const dateHandler = (date: string) => {
    setDate(new Date(date));
  };

  const clickHandler = (title: string) => {
    setSelectedButton(title);
  };

  const renderAllButtons = tempArray.map((item, index) => (
    <BorderBtn
      key={index.toString()}
      buttonText={item.title}
      onClick={() => {
        clickHandler(item.title);
      }}
      containerStyle={{
        ...styles.button,
        backgroundColor:
          selectedButton === item.title ? globalStyles.themeBlue : 'white',
      }}
      buttonTextStyle={{
        color: selectedButton === item.title ? 'white' : 'black',
      }}
    />
  ));

  return (
    <Container headerText="Messages">
      <HorizontalCalendarStrip
        selected={date.toLocaleString()}
        onSelectDate={date => {
          dateHandler(date);
        }}
      />

      {/* buttons */}
      <View style={styles.buttonContainer}>{renderAllButtons}</View>

      {/* messages */}
      <View style={styles.messageContainer}>
        {users?.length > 0 &&
          users?.map((item: any, index) => (
            <MessageTab
              key={index}
              id={item?.id}
              groupName="Christian Group"
              name={item?.user_name}
              time="12:03pm"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit ..."
              profileIconUri={item?.profile}
              style={styles.messageStyle}
            />
          ))}
      </View>
    </Container>
  );
};

export default Messages;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    marginTop: responsiveHeight(0.7),
    height: responsiveHeight(4),
    width: 'auto',
    paddingHorizontal: responsiveWidth(3),
    marginRight: responsiveWidth(1.5),
    ...globalStyles.shadowStyle,
  },
  messageContainer: {
    marginTop: responsiveHeight(1.2),
  },
  messageStyle: {
    marginBottom: responsiveHeight(1.2),
  },
});
