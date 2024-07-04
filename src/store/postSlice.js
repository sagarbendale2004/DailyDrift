import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "../appwrite/configuration";

// Thunks for async actions
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await service.getPosts([]);
  return response.documents;
});

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData) => {
    const response = await service.createPost(postData);
    return response;
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, postData }) => {
    const response = await service.updatePost(postId, postData);
    return response;
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    await service.deletePost(postId);
    return postId;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // You can add non-async actions here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.$id === action.payload.$id
        );
        state.posts[index] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.$id !== action.payload);
      });
  },
});

export default postSlice.reducer;
