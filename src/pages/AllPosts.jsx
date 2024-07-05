// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostAsync, deletePostAsync } from "../store/postSlice";
import Container from "../components/Container/Container";
import PostCard from "../components/PostCard";

function AllPosts() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.status === "loading");
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    dispatch(fetchPostAsync());
  }, [dispatch]);

  const handleDelete = (postId) => {
    dispatch(deletePostAsync(postId));
  };

  return (
    <div className="w-full py-8">
      <Container>
        {loading ? (
          <p className="text-center">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            Failed to load posts. Please try again later.
          </p>
        ) : (
          <div className="flex flex-wrap">
            {posts.map((post) => (
              <div
                key={post.$id}
                className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                <PostCard {...post} onDelete={() => handleDelete(post.$id)} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
