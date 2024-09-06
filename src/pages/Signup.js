import React, { useState } from "react";
import { signUp } from "../utils/api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await signUp(formData);
      toast.success("Signup successful!");
      console.log("User signed up:", data);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setError(error.message);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 px-4">
      <div className="flex flex-col-reverse items-center my-6 w-full sm:w-auto">
        <p className="text-xl sm:text-2xl w-full sm:w-4/5 text-gray-800 font-semibold leading-relaxed tracking-wide text-center my-4 mx-auto">
          Post App helps you connect and share with the people in your life.
        </p>
      </div>
      <div className="relative bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md transform hover:scale-105 transition-transform duration-300">
        <button
          onClick={() => navigate("/posts")}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FaTimes className="text-xl" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
          Signup
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-5">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4 sm:mb-5">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4 sm:mb-5 relative">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEye className="absolute top-12 right-4 text-lg text-gray-600" />
              ) : (
                <FaEyeSlash className="absolute top-12 right-4 text-lg text-gray-600" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
