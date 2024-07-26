// export const baseURL = 'https://niletechinnovations.com/projects/journey/api/';
export const baseURL = 'http://3.144.121.102/api/';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {navigationRefHandler} from '../utils/Method';

export const endPoint = {
  register: 'register',
  sendOtp: 'send-otp',
  verifyOtp: 'verify-otp',
  login: 'login',
  logout: 'logout',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
  changePassword: 'change-password',
  otpVerfication: 'otp-verfication',
  mood: 'mood',
  home: 'home',
  submitRating: 'submit-rating',
  plans: 'plans',
  updateProfile: 'update-profile',
  profile: 'profile',
  createCommunity: 'create-community',
  searchCriteria: 'search-criteria?name=',
  createJournal: 'create-journal',
  journals: 'journals',
  editJournal: 'edit-journal',
  deleteJournal: 'delete-journal',
  communityList: 'community-list',
  journalsDetails: 'journal/',
  followUnfollow: 'follow-unfollow',
  community: 'community/',
  createPost: 'create-post',
  moodCapture: 'mood-capture',
  post: 'post',
  moodCalender: 'mood-calender',
  createRoutine: 'create-routine',
  routineCategory: 'routine-category',
  routine: 'routine',
  search: 'search',
  RoutineDetails: 'routine-detail',
  LikeUnlike: 'like-unlike-post',
  MyCommunity: 'my-community-list',
  deletCommunity: 'delete-community',
  DeletePost: 'delete-post',
  DeleteRoutine: 'delete-routine',
  DeleteCriteria: 'delete-criteria',
  createCriteria: '',
  EditRoutine: 'edit-routine',
  EditPost: 'edit-post',
  createTask: 'create-task',
  postComment: 'post-comment',
  postCommentEdit: 'post-comment-edit',
  postCommentDelete: 'post-comment-delete',
  notifications: 'notifications',
  editCommunity: 'edit-community',
  userList: 'users-list',
  shareRoutine: 'share-routine',
  createQuery: 'create-query',
  queryList: 'query-list',
  shareRoutineList: 'share-routine-list',
  chatRecord: 'chat-record',
  chatImage: 'chat-image',
  unseenMessageCount: 'unseen-message-count',
  seenMessage: 'seen-message',
  followedCommunity: 'followed-community',
  buyPlan: 'buy-plan',
  buyPlanIos: 'ios-buy-plan',
  buyFreePlan: 'buy-free-plan',
  addCard: 'add-card',
  cardList: 'card-list',
  clearNotifications: 'clear-notifications',
  notificationCount: 'notification-count',
  notificationSeen: 'notification-seen',
  buyJournalPdf: 'buy-journal-pdf',
  journalPdf: 'journal-pdf',
  policies: 'policies'
};

const loginHandler = async (message: string) => {
  try {
    Toast.show({
      type: 'error',
      text1: message,
    });
    await AsyncStorage.clear();
    navigationRefHandler();
  } catch (err: any) {
    console.log('err for invalid token', err?.message);
  }
};

const convertJsonToFormData = (data: any) => {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key]) && key == 'file') {
      for (let i = 0; i < data[key].length; i++) {
        formData.append('file[]', {
          uri: data[key][i].uri,
          name: data[key][i].filename,
          type: data[key][i].type,
        });
      }
    } else if (Array.isArray(data[key]) && key == 'deleteFile') {
      for (let i = 0; i < data[key].length; i++) {
        formData.append('deletefile[]', data[key][i]);
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
};

export const PostApi = async (endPoint: string, data: any) => {
  try {
    const formData = convertJsonToFormData(data);
    console.log('formdata', formData);
    const response = await fetch(`${baseURL}${endPoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    const resp = await response?.json();
    console.log(resp);
    return {data: resp};
  } catch (err: any) {
    console.log('err in postApi', err.message);
  }
};

// export const PostApi = async (endPoint: string, data: any) => {
//   try {
//     const formData = convertJsonToFormData(data);
//     console.log('formdata', formData);
//     const response = await axios.post(`${baseURL}${endPoint}`, formData);
//     return response;
//   } catch (error: any) {
//     console.log('err in postApi', error.message);
//   }
// };

export const PostApiWithToken = async (
  endPoint: string,
  data: any,
  token: string,
) => {
  try {
    let formData;
    if (Object.keys(data).length === 0) {
      formData = data;
    } else {
      formData = convertJsonToFormData(data);
    }
    console.log('formdata', formData);
    const response = await fetch(`${baseURL}${endPoint}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    // console.log(`1- here is your endpoint (${endPoint}) response`);
    const resp = await response?.json();
    if (response?.status === 401) {
      loginHandler(resp?.message);
    }
    return {data: resp};
  } catch (err: any) {
    console.log('err in postApi', err?.message);
  }
};

// export const PostApiWithToken = async (
//   endPoint: string,
//   data: any,
//   token: string,
// ) => {
//   try {
//     const formData = convertJsonToFormData(data);
//     // console.log('data', data);
//     console.log('formdata', formData);
//     const response = await axios.post(`${baseURL}${endPoint}`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response;
//   } catch (err: any) {
//     console.log('err in postApi', err?.message);
//   }
// };

export const GetApi = async (endPoint: string) => {
  try {
    const response = await fetch(`${baseURL}${endPoint}`);
    const resp = await response?.json();
    return {data: resp};
  } catch (err: any) {
    console.log('err in GetApi', err.message);
  }
};

// export const GetApi = async (endPoint: string) => {
//   try {
//     const response = await axios.get(`${baseURL}${endPoint}`);
//     return response;
//   } catch (err: any) {
//     console.log('err in GetApi', err.message);
//   }
// };

export const GetApiWithToken = async (endPoint: string, token: any) => {
  try {
    const response = await fetch(`${baseURL}${endPoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resp = await response?.json();
    if (response?.status === 401) {
      loginHandler(resp?.message);
    }
    return {data: resp};
  } catch (err: any) {
    console.log('err in GetApi', err.message);
  }
};

// export const GetApiWithToken = async (
//   endPoint: string,
//   token: any,
//   count: number = 0,
// ) => {
//   try {
//     console.log('enter', endPoint)
//     const response = await axios.get(`${baseURL}${endPoint}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       timeout: 10000,
//     });
//     return response;
//   } catch (err: any) {
//     if (err?.code === 'ECONNABORTED' && count < 2) {
//       GetApiWithToken(endPoint, token, count++);
//     } else {
//       console.log('err in GetApi', err.message, err?.code);
//     }
//   }
// };

export const DeleteApi = async (endPoint: string, token: string) => {
  try {
    const response = await fetch(`${baseURL}${endPoint}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resp = await response?.json();
    return {data: resp};
  } catch (err: any) {
    console.log('err in postApi', err?.message);
  }
};
