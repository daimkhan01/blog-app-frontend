import React, { useState } from "react";
import { createPost } from "../utils/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required.");
      toast.error("Title and content are required.");
      return;
    }

    if (!token) {
      setError("You must be logged in to create a post.");
      toast.error("You must be logged in to create a post.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createPost(formData, token);
      toast.success("Post created successfully!");
      setFormData({ title: "", content: "" });
      navigate("/posts");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 bg-opacity-80 px-4">
      <div className="max-w-lg sm:max-w-xl lg:max-w-2xl w-full bg-white shadow-lg rounded-lg p-6 sm:p-8 mt-10">
        {error && (
          <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>
        )}
        {success && (
          <p className="text-green-500 mb-4 text-center font-semibold">
            {success}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 text-center mb-6 sm:mb-8">
          Create Post
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105"
              placeholder="Enter post title"
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105 resize-none h-24 sm:h-32"
              placeholder="Enter post content"
            ></textarea>
          </div>
          <button
            type="submit"
            className={`bg-blue-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition duration-300 ease-in-out ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
        <div className="flex justify-end mt-4 sm:mt-6">
          <Link
            to="/posts"
            className="text-blue-600 font-semibold underline hover:text-blue-800 transition duration-300 ease-in-out"
          >
            Back to posts
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
