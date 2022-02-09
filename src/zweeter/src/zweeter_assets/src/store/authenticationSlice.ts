import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 
export interface AuthState {
  loggedIn: boolean;
  principal: string;
  name: string;
  id: string;
}

const initialState: AuthState = {
  loggedIn: false,
  principal: "",
  name: "",
  id: "",
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ principal: string }>) => {
      state.loggedIn = true;
      state.principal = action.payload.principal;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.principal = "";
    },
    setInfo: (state, action: PayloadAction<{ name: string; id: string }>) => {
      state.name = action.payload.name;
      state.id = action.payload.id;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
