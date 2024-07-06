// eslint-disable-next-line no-unused-vars
import React, { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "../index";
import RTE from "../RTE";
import { useSelector } from "react-redux";
import service from "../../appwrite/configuration";

export default function PostForm({ setPosts }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: "",
        slug: "",
        featuredimage: "",
        content: "",
        status: "",
        userId: "",
      },
    });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  const handleAdd = async (data) => {
    setIsSubmitting(true);

    try {
      // Upload the file
      const file = await service.uploadFile(data.featuredimage[0]);

      // Prepare the payload
      const payload = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        featuredimage: file.$id,
        status: data.status,
        userId: userData.$id,
      };

      console.log("Payload:", payload);

      // Create the post
      const response = await service.createPost(payload);

      // Update the posts state
      if (setPosts) {
        setPosts((prevState) => [response, ...prevState]);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Failed to submit post: ", error.message);
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

  useEffect(() => {
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
    <form onSubmit={handleSubmit(handleAdd)} className="flex flex-wrap">
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
          {...register("featuredimage", { required: true })}
        />
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={setPosts ? "bg-green-500" : undefined}
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
          ) : setPosts ? (
            "Update"
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
