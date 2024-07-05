// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";
import service from "../appwrite/configuration";
import Button from "../components/Button";

function PostCard({ $id, title, featuredimage, content, onDelete }) {
  return (
    <div className="w-full bg-gray-100 rounded-xl p-4">
      <Link to={`/post/${$id}`}>
        <div className="w-full justify-center mb-4">
          <img
            src={service.getFilePreview(featuredimage)}
            alt={title}
            className="rounded-xl"
          />
        </div>
        <h2 className="font-bold text-xl">{title}</h2>
        <p className="text-sm">{content}</p>
      </Link>
      {onDelete && (
        <Button onClick={onDelete} className="mt-4 bg-red-500">
          Delete
        </Button>
      )}
    </div>
  );
}

export default PostCard;
