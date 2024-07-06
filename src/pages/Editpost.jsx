// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPostAsync } from "../store/postSlice";
import Container from "../components/Container/Container";
import PostCard from "../components/PostCard";

function Post() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) =>
    state.posts.posts.find((p) => p.slug === slug)
  );
  const status = useSelector((state) => state.posts.status);

  useEffect(() => {
    if (slug && status === "idle") {
      dispatch(fetchPostAsync(slug));
    }
  }, [slug, dispatch, status]);

  return (
    <div className="py-8">
      <Container>{post ? <PostCard {...post} /> : <p>Loading...</p>}</Container>
    </div>
  );
}

export default Post;
