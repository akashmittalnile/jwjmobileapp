import {DarkTheme} from '@react-navigation/native';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface userDetailsProps {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  mobile: string;
  cca2: string;
  profileImage: string;
  adminProfileImage: string;
  currentPlan: string;
  userName: string;
  ratingSubmit: boolean;
  showLogoutModal: boolean;
  showReviewModal: boolean;
  homeScreenLoader: boolean;
  darkTheme: boolean;
}

const initialState = {
  id: '',
  name: '',
  email: '',
  countryCode: '',
  mobile: '',
  cca2: '',
  profileImage: '',
  currentPlan: {name: '', price: '', plan_timeperiod: ''},
  userName: '',
  ratingSubmit: false,
  showLogoutModal: false,
  showReviewModal: false,
  homeScreenLoader: false,
  darkTheme: false,
  adminProfileImage: '',
};

export const userDetailsSlice = createSlice({
  name: 'userDetailsSlice',
  initialState,
  reducers: {
    userDetailsHandler: (
      state,
      action: PayloadAction<Partial<userDetailsProps>>,
    ) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const {userDetailsHandler} = userDetailsSlice.actions;
