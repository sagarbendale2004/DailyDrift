// eslint-disable-next-line no-unused-vars
import React from "react";
import Service from "../appwrite/configuration";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredimage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img
            src={Service.getFilePreview(featuredimage)}
            alt={title}
            className="rounded-xl"
          />
        </div>
        <h2 className="font-bold text-xl">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
