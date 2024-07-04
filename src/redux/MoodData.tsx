import {createSlice} from '@reduxjs/toolkit';

interface MoodProps {
  id: string;
  logo: string;
  name: string;
}

const initialState = [
  {
    id: '',
    logo: '',
    name: '',
  },
];

export const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    moodDataHandler: (state, action) => action.payload,
  },
});

export const {moodDataHandler} = moodSlice.actions;
