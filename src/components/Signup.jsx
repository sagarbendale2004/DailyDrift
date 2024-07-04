// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const create = async (data) => {
    setError("");
    setLoading(true);
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          dispatch(login(currentUser));
          navigate("/");
        }
      }
    } catch (error) {
      console.log("Error in Signup:", error);
      setError(error.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign Up for an Account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)} className="mt-6">
          <div className="space-y-4">
            <Input
              label="Name"
              placeholder="Enter your name"
              type="text"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className="text-red-600 mt-1 text-sm">{errors.name.message}</p>
            )}

            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "Email address must be a valid address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600 mt-1 text-sm">
                {errors.email.message}
              </p>
            )}

            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                  message:
                    "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-600 mt-1 text-sm">
                {errors.password.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full text-white py-3 text-lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
