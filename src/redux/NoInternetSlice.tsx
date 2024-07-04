/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../app/store';

interface CounterState {
    isInternetReachable: boolean,
}

const initialState: CounterState = {
    isInternetReachable: true,
};

export const InternetSlice = createSlice({
    name: 'Internet',
    initialState,
    reducers: {
        InternetInfoHandler: (state, action) => {
            state.isInternetReachable = action.payload;
        },
    },
});

export const { InternetInfoHandler } = InternetSlice.actions;
// export const selectCount = (state: RootState) => state.counter.value;