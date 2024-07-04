import {PermissionsAndroid, Platform} from 'react-native';
import {store} from '../redux/Store';
import {authHandler} from '../redux/Auth';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';


export const isValidDateHandler = (dateString: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }
  var parts = dateString.split('-');
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var day = parseInt(parts[2], 10);
  if (year < 1000 || year > 3000 || month == 0 || month > 12) {
    return false;
  }
  var isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  var daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  const temp = day > 0 && day <= daysInMonth[month - 1];
  if (temp) {
    const currentDate = new Date();
    const dateObject = new Date(dateString);
    return dateObject <= currentDate ? true : false;
  } else {
    return false;
  }
};

export const USMobileNumberFormatHandler = (_mobile: string) => {
  let cleanNumber = _mobile?.replace(/\D/g, '');
  let formattedNumber;
  if (cleanNumber?.length > 6) {
    formattedNumber = `(${cleanNumber?.slice(0, 3)}) ${cleanNumber?.slice(
      3,
      6,
    )}-${cleanNumber?.slice(6)}`;
  } else if (cleanNumber?.length > 3) {
    formattedNumber = `(${cleanNumber?.slice(0, 3)}) ${cleanNumber?.slice(
      3,
      6,
    )}`;
  } else {
    formattedNumber = cleanNumber;
  }

  return formattedNumber;
};

export const daysSorting = (days: string[], data: any[]) => {
  if (data?.length > 0) {
    const temp: any[] = [null, null, null, null, null, null, null];
    data?.forEach(item => {
      const str = days.findIndex(ele => ele == item);
      if (str >= 0) {
        temp[str] = item;
      }
    });
    const result = temp?.filter(item => item);
    return result;
  }
};

export const navigationRefHandler = () => {
  store.dispatch(authHandler(''));
};

export const triggerNotification = async (
  title: string = '',
  message: string = '',
  isSchedule: boolean = false,
  scheduleTime: string = '',
) => {
  try {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid?.request(
        PermissionsAndroid?.PERMISSIONS?.POST_NOTIFICATIONS,
      );
      if (result === PermissionsAndroid?.RESULTS?.GRANTED) {
        PushNotification.createChannel(
          {
            channelId: 'default-channel-id',
            channelName: 'Default Channel',
            channelDescription: 'A default channel',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          (created: boolean) => {
            if (created) {
              console.log('Channel created successfully');
            } else {
              console.log('Channel already exists or creation failed');
            }
          },
        );

        if (isSchedule) {
          PushNotification.localNotificationSchedule({
            channelId: 'default-channel-id',
            title,
            message,
            date: scheduleTime ? new Date(scheduleTime) : new Date(),
            allowWhileIdle: true,
            repeatTime: 1,
            background: true,
          });
        } else {
          PushNotification.localNotification({
            channelId: 'default-channel-id',
            title,
            message,
            allowWhileIdle: true,
            background: true,
          });
        }
      } else {
        console.log('Notification permission not granted:', result);
      }
    } else {
      PushNotificationIOS.addNotificationRequest({
        id: '1',
        title,
        body: message,
      });
    }
  } catch (err: any) {
    console.log('Error in notification handling:', err.message);
  }
};
