import {createSlice} from '@reduxjs/toolkit';

interface Goal {
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

export const goalSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    goalDataHandler: (state, action) => action.payload,
  },
});

export const {goalDataHandler} = goalSlice.actions;
