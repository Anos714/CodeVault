import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../utils/Auth";
import { Eye, EyeOff } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../../store/thunks/auth.thunks";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const handleRegisterSubmit = async (data) => {
    const toastId = toast.loading("Registering user...");
    try {
      const response = await dispatch(registerUser(data)).unwrap();

      toast.success(response.msg || "Registration Successful!", {
        id: toastId,
      });
      navigate("/snippets");
    } catch (error) {
      toast.error(error.message || "Registration failed", { id: toastId });
    }
  };

  const inputStyles =
    "block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-200";
  const errorStyles = "mt-2 text-xs text-red-400";
  const iconStyles =
    "h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-xl bg-[#090d22] p-8 shadow-lg ring-1 ring-white/10 sm:p-10">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join us to start your journey
          </p>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(handleRegisterSubmit)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-200">
                Username
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="johndoe123"
                  className={`${inputStyles} ${
                    errors.username
                      ? "ring-red-500 focus:ring-red-500"
                      : "ring-gray-700 focus:ring-indigo-500 hover:ring-gray-600"
                  }`}
                  {...register("username")}
                />
                {errors.username && (
                  <p className={errorStyles}>{errors.username.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-200">
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`${inputStyles} ${
                    errors.email
                      ? "ring-red-500 focus:ring-red-500"
                      : "ring-gray-700 focus:ring-indigo-500 hover:ring-gray-600"
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className={errorStyles}>{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-200">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputStyles} pr-10 ${
                    errors.password
                      ? "ring-red-500 focus:ring-red-500"
                      : "ring-gray-700 focus:ring-indigo-500 hover:ring-gray-600"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className={iconStyles} />
                  ) : (
                    <Eye className={iconStyles} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className={errorStyles}>{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-200">
                Confirm Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputStyles} pr-10 ${
                    errors.confirmPassword
                      ? "ring-red-500 focus:ring-red-500"
                      : "ring-gray-700 focus:ring-indigo-500 hover:ring-gray-600"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className={iconStyles} />
                  ) : (
                    <Eye className={iconStyles} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className={errorStyles}>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
