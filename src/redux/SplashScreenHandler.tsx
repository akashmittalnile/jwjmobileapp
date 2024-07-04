import {createSlice} from '@reduxjs/toolkit';

interface SplashScreenHandlerProps {
  isValid: boolean;
}

const initialValue: SplashScreenHandlerProps = {
  isValid: true,
};

export const SplashScreenSlice = createSlice({
  name: 'SplashScreenSlice',
  initialState: initialValue,
  reducers: {
    SplashScreenSliceHandler: (state, action) => {
      state.isValid = action.payload;
    },
  },
});

export const {SplashScreenSliceHandler} = SplashScreenSlice.actions;
