import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../utils/Auth";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const handleLoginSubmit = async (data) => {
    console.log("Form Submitted:", data);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-[#090d22] p-8 shadow-lg ring-1 ring-white/10 sm:p-10">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(handleLoginSubmit)}
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-200"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-200
                    ${
                      errors.email
                        ? "ring-red-500 focus:ring-red-500"
                        : "ring-gray-700 focus:ring-indigo-500 hover:ring-gray-600"
                    }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-red-400" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-200"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-200 
                    ${
                      errors.password
                        ? "ring-red-500 focus:ring-red-500"
                        : "ring-gray-700 focus:ring-indigo-500 hover:ring-gray-600"
                    }`}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-2 text-xs text-red-400" role="alert">
                    {errors.password.message}
                  </p>
                )}
                <div className="absolute right-3 top-3">
                  <button onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
