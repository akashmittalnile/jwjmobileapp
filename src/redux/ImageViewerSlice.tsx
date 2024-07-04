import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  uri: '',
  showImageViewer: false,
};

export const ImageViewerSlice = createSlice({
  name: 'ImageViewerSlice',
  initialState,
  reducers: {
    showImageViewerHandler: (_, action) => ({
      uri: action?.payload?.uri,
      showImageViewer: action?.payload?.show,
    }),
  },
});

export const {showImageViewerHandler} = ImageViewerSlice.actions;
