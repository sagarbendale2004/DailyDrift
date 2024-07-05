// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Container from "../components/Container/Container";
import PostForm from "../components/Post-Form/PostForm";
import { useDispatch } from "react-redux";
import { createPost } from "../store/postSlice";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const [newPost, setNewPost] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreatePost = async (postData) => {
    try {
      const createdPost = await dispatch(createPost(postData)).unwrap();
      setNewPost(createdPost);
      navigate(`/post/${createdPost.$id}`); // Redirect to the new post's page after creation
    } catch (error) {
      console.error("Failed to create post: ", error);
    }
  };

  return (
    <div className="py-8">
      <Container>
        <PostForm onSubmit={handleCreatePost} post={newPost} />
      </Container>
    </div>
  );
}

export default AddPost;
