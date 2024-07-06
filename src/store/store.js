import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../store/authSlice";
import postsReducer from "../store/postSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsReducer,
  },
});

export default store;
