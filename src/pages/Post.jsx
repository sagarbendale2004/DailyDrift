// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import Container from "../components/Container/Container";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const { slug } = useParams();

  const post = useSelector((state) =>
    state.posts.posts.find((post) => post.slug === slug)
  );
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData && post.userId === userData.$id;

  const onDeleteClick = async () => {
    try {
      if (!post) {
        console.error("No post data available for deletion.");
        return;
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <img
            src={post.featuredimage}
            alt={post.title}
            className="rounded-xl"
          />
          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={onDeleteClick}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
        <div className="browser-css">{parse(post.content)}</div>
      </Container>
    </div>
  ) : null;
}
