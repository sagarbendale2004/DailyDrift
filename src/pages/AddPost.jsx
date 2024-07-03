// eslint-disable-next-line no-unused-vars
import React from "react";
import Container from "../components/Container/Container";
import PostForm from "../components/Post-Form/PostForm";

function AddPost() {
  return (
    <div className="py-8">
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
