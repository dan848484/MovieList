import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TokenState {
  token: string;
  expire?: number;
}

const initialState: TokenState = { token: "" };

export const tokenSlice = createSlice({
  name: "token",
  initialState: initialState,
  reducers: {
    setToken: (state, action: PayloadAction<TokenState>) => {
      state.token = action.payload.token;
      state.expire = action.payload.expire;
    },
  },
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
