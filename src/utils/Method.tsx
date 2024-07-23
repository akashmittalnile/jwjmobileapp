import {Image, PermissionsAndroid, Platform} from 'react-native';
import {store} from '../redux/Store';
import {authHandler} from '../redux/Auth';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import maleIcon from '../assets/Icons/user.png';
import femaleIcon from '../assets/Icons/girl.png';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';

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
    console.log('1');
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

export const findTenure = (timePeriod: string) => {
  if (!timePeriod) {
    return '';
  }
  if (timePeriod?.toLowerCase() === 'monthly') {
    return '/Month';
  } else if (timePeriod?.toLowerCase() === 'yearly') {
    return '/Year';
  } else {
    return ' One-Time';
  }
};

export const moodColorHandler = (value: string | undefined) => {
  const _value = value?.toLowerCase();
  if (_value == 'happy') {
    return '#FFD800';
  } else if (_value == 'sad') {
    return 'gray';
  } else if (_value == 'angry' || _value == 'anger') {
    return 'red';
  } else if (_value == 'peaceful') {
    return '#4B9CD3';
  } else if (_value == 'blessed') {
    return 'green';
  } else if (_value == 'stressed') {
    return '#A52A2A';
  } else if (_value == 'overwhelmed') {
    return '#48496C';
  }

  return '#E0B8AC';
};

export const resolveProfileImage = (gender: string) => {
  if (gender?.toLowerCase() === 'male') {
    return Image.resolveAssetSource(maleIcon).uri;
  } else if (gender?.toLowerCase() === 'female') {
    return Image.resolveAssetSource(femaleIcon).uri;
  }
};

export const fetchPdf = (pdfLink: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      if (!pdfLink) {
        console.log('PDF link is missing.');
        return;
      }

      const {config, fs} = RNFetchBlob;
      const downloadDir =
        Platform.OS === 'ios' ? fs?.dirs.DocumentDir : fs?.dirs.DownloadDir;
      const fileName = pdfLink.substring(pdfLink.lastIndexOf('/') + 1);
      const path = `${downloadDir}/${fileName}.pdf`;

      const configfb = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: `Invoice.pdf`,
          path,
        },
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: 'Invoice.pdf',
        path,
      };

      const configOptions = Platform.select({
        ios: configfb,
        android: configfb,
      });

      const response = await RNFetchBlob.config(configOptions || {})?.fetch(
        'GET',
        pdfLink,
      );
      if (Platform.OS === 'ios') {
        await RNFetchBlob.fs.writeFile(configfb.path, response.data, 'base64');
        RNFetchBlob.ios.previewDocument(configfb.path);
        resolve(true);
      } else {
        resolve(true);
        console.log('file downloaded');
      }
    } catch (err: any) {
      reject(err);
      console.log('Error fetching PDF:', err.message);
      Toast.show({
        type: 'error',
        text1: 'Error downloading PDF',
      });
    }
  });
};

export const capitaliseFirstlatter = (_value: string) => {
  const value = _value?.trim();
  const valueArray = value?.split(' ');
  const result = valueArray
    ?.map((val: string) => val?.charAt(0)?.toUpperCase() + val?.slice(1))
    ?.join(' ');
  return result;
};
