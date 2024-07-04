import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  followedCommunity: 0,
  sharedRoutines: 0,
  unSeenMessage: 0,
  notificationCount: 0
};

export const TrackNumbersSlice = createSlice({
  name: 'reloadScreen',
  initialState,
  reducers: {
    followedCommunityHandler: (state, action) => ({
      ...state,
      ...action?.payload,
    }),
    shareRoutinesHandler: (state, action) => ({...state, ...action?.payload}),
    numberHandler: (state, action) => ({...state, ...action?.payload}),
    notificationCounter: (state, action) => ({...state, ...action?.payload}),
  },
});

export const {followedCommunityHandler, shareRoutinesHandler, numberHandler,notificationCounter} =
  TrackNumbersSlice.actions;
