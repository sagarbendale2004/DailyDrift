// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Container from "../components/Container/Container";
import PostCard from "../components/PostCard";
import service from "../appwrite/configuration";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    service.getPosts([]).then(
      (response) => {
        if (response) {
          setPosts(response.documents);
        }
        setLoading(false); // Turn off loading indicator
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false); // Ensure loading indicator is turned off on error
      }
    );
  }, []); // Dependency array is empty to run once on mount

  return (
    <div className="w-full py-8">
      <Container>
        {loading ? (
          <p className="text-center">Loading posts...</p>
        ) : (
          <div className="flex flex-wrap">
            {posts.map((post) => (
              <div
                key={post.$id}
                className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
