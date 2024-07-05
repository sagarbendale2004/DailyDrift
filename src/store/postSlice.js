import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "../appwrite/configuration";

// Async thunk action to fetch a post by slug
export const fetchPostAsync = createAsyncThunk(
  "posts/fetchPost",
  async (slug, { rejectWithValue }) => {
    try {
      const post = await service.getPost(slug);
      return post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk action to delete a post by ID
export const deletePostAsync = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const status = await service.deletePost(postId);
      if (status) {
        return postId;
      } else {
        throw new Error("Failed to delete post.");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk action to create a new post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ formData, userId }, { rejectWithValue }) => {
    try {
      const post = await service.createPost(formData, userId);
      return post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk action to update an existing post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, formData, userId }, { rejectWithValue }) => {
    try {
      const post = await service.updatePost(postId, formData, userId);
      return post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
    // Additional reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPostAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts.push(action.payload);
      })
      .addCase(fetchPostAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deletePostAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = state.posts.filter((post) => post.$id !== action.payload);
      })
      .addCase(deletePostAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updatePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.posts.findIndex(
          (post) => post.$id === action.payload.$id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
