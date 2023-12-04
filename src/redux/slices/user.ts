import { createSlice } from "@reduxjs/toolkit";

interface UserProps {
  name: string;
  picture: string;
  email: string;
}

interface IUser {
  token: string;
  user: UserProps | null;
}

const initialState: IUser = {
  token: "",
  user: null,
};

interface Payload {
  token?: string;
  user?: UserProps | null;
}

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    initUser: (state, { payload }: { payload: Payload }) => {
      state.token = payload.token || state.token;
      state.user = payload.user || state.user;
    },
  },
});

export const { initUser } = user.actions;

export default user.reducer;
