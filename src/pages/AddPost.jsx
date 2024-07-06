// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Container from "../components/Container/Container";
import PostForm from "../components/Post-Form/PostForm";
import CheckUserData from "../components/CheckUserData"; // Temporary import for checking userData

function AddPost() {
  // eslint-disable-next-line no-unused-vars
  const [posts, setPosts] = useState([]);

  return (
    <div className="py-8">
      <Container>
        <PostForm setPosts={setPosts} />
        <CheckUserData /> {/* Check userData */}
      </Container>
    </div>
  );
}

export default AddPost;
