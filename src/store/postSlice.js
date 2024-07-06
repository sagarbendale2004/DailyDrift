import { createSlice } from "@reduxjs/toolkit";
import service from "../appwrite/configuration";

const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postFetched: (state, action) => {
      const post = action.payload;
      const existingPost = state.posts.find((p) => p.slug === post.slug);
      if (existingPost) {
        Object.assign(existingPost, post);
      } else {
        state.posts.push(post);
      }
    },
  },
});

export const { postFetched } = postsSlice.actions;

export const fetchPostAsync = (slug) => async (dispatch) => {
  try {
    const response = await service.getPost(slug);
    dispatch(postFetched(response));
  } catch (error) {
    console.error("Failed to fetch post:", error);
  }
};

export default postsSlice.reducer;
