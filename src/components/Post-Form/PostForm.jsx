import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "../index";
import RTE from "../RTE";
import { useSelector, useDispatch } from "react-redux";
import { fetchPostAsync } from "../../store/postSlice";
import service from "../../appwrite/configuration";

export default function PostForm({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        featuredimage: post?.featuredimage || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (post?.$id) {
      dispatch(fetchPostAsync(post.$id)).then((response) => {
        const postData = response.payload;
        console.log("postdata", postData);
        if (postData) {
          setValue("title", postData.title);
          setValue("slug", postData.$id);
          setValue("featuredimage", postData.featuredimage);
          setValue("content", postData.content);
          setValue("status", postData.status);
        }
      });
    }
  }, [dispatch, post, setValue]);

  const submit = async (data) => {
    setIsSubmitting(true);

    if (post) {
      const file = data.featuredimage[0]
        ? await service.uploadFile(data.featuredimage[0])
        : null;

      if (file) {
        service.deleteFile(post.featuredimage);
      }

      const dbPost = await service.updatePost(post.$id, {
        ...data,
        featuredimage: file ? file.$id : undefined,
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file = await service.uploadFile(data.featuredimage[0]);

      if (file) {
        const fileId = file.$id;
        data.featuredimage = fileId;
        const dbPost = await service.createPost({
          ...data,
          userId: userData.$id,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
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
        {post && post.featuredimage && (
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
