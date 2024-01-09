// 인증 관련 데이터 저장

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: {
    agreeCert: false,
    agreePrivacy: false,
    agreeThird: false,
  },
};

export const certSlice = createSlice({
  name: 'cert',
  initialState,
  reducers: {
    setCert: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setCert} = certSlice.actions;

export default certSlice.reducer;
