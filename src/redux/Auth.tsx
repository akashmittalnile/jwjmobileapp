import {createSlice} from '@reduxjs/toolkit';

interface AuthProps {
  token: string;
}

const initialValue: AuthProps = {
  token: '',
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState: initialValue,
  reducers: {
    authHandler: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {authHandler} = AuthSlice.actions;
