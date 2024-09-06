import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostById, updatePost } from "../utils/api";
import { toast } from "react-toastify";

function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        setFormData({ title: data.title, content: data.content });
      } catch (error) {
        setError(error.message);
        toast.error("Failed to load post.");
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if title or content is empty
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required.");
      toast.error("Title and content cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to edit a post.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updatePost(postId, formData, token);
      toast.success("Post updated successfully!");
      navigate("/posts");
    } catch (error) {
      setError(error.message);
      toast.error("Failed to update the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 bg-opacity-80 px-4">
      <div className="max-w-lg sm:max-w-xl w-full bg-white shadow-lg rounded-lg p-6 sm:p-8 mt-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-6">
          Edit Post
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
              placeholder="Enter post title"
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105 resize-none h-24 sm:h-32"
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
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
        <div className="flex justify-end mt-4 sm:mt-6">
          <Link
            to="/posts"
            className="text-blue-500 font-semibold underline hover:text-blue-700 transition duration-300 ease-in-out"
          >
            Back to posts
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
