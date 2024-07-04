import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "../index";
import RTE from "../RTE";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../store/postSlice";
import service from "../../appwrite/configuration";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    try {
      setIsSubmitting(true);
      let fileId;
      if (data.featuredimage[0]) {
        const file = await service.uploadFile(data.featuredimage[0]);
        fileId = file.$id;
      }

      const postData = {
        ...data,
        featuredimage: fileId,
        userId: userData.$id,
      };

      if (post) {
        dispatch(updatePost({ postId: post.$id, postData })).then((result) => {
          if (result.type === "posts/updatePost/fulfilled") {
            navigate(`/post/${result.payload.$id}`);
          } else {
            throw new Error("Failed to update post.");
          }
        });
      } else {
        dispatch(createPost(postData)).then((result) => {
          if (result.type === "posts/createPost/fulfilled") {
            navigate(`/post/${result.payload.$id}`);
          } else {
            throw new Error("Failed to create post.");
          }
        });
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]/g, "")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("featuredimage", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={service.getFilePreview(post.featuredimage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              Submitting...
              <div className="ml-2 spinner-border text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : post ? (
            "Update"
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
