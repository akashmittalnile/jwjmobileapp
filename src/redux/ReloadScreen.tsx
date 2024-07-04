import {createSlice} from '@reduxjs/toolkit';
import MyCommunity from '../screens/Community/MyCommunity';

// interface ReloadScreenProps {
//   home: boolean;
//   routine: boolean;
//   journals: boolean;
//   community: boolean;
//   profile: boolean;
// }

const initialState = {
  Home: false,
  Routine: false,
  Journals: false,
  Community: false,
  Profile: false,
  FollowedCommunity: false,
  MoodCalendar: false,
  FollowedCommunityDetails: false,
  FollowedCommunityPost: false,
  MyCommunity: false,
  RoutineDetailsWithTask: false,
  Contact: false,
  Search: false,
  SharedRoutine: false,
};

export const ReloadScreenSlice = createSlice({
  name: 'reloadScreen',
  initialState,
  reducers: {
    reloadHandler: (state, action) => ({...state, ...action?.payload}),
  },
});

export const {reloadHandler} = ReloadScreenSlice.actions;
