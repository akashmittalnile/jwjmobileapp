/* eslint-disable prettier/prettier */
import {configureStore} from '@reduxjs/toolkit';
import {InternetSlice} from './NoInternetSlice';
import {AuthSlice} from './Auth';
import {userDetailsSlice} from './UserDetails';
import {moodSlice} from './MoodData';
import {goalSlice} from './GoalList';
import {ReloadScreenSlice} from './ReloadScreen';
import {TrackNumbersSlice} from './TrackNumbers';
import {ImageViewerSlice} from './ImageViewerSlice';
import {SplashScreenSlice} from './SplashScreenHandler';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

export const store = configureStore({
  reducer: {
    internet: InternetSlice.reducer,
    auth: AuthSlice.reducer,
    userDetails: userDetailsSlice.reducer,
    mood: moodSlice.reducer,
    reload: ReloadScreenSlice.reducer,
    goal: goalSlice.reducer,
    TrackNumber: TrackNumbersSlice.reducer,
    ImageViewer: ImageViewerSlice.reducer,
    splash: SplashScreenSlice.reducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
