import React, { useState, useEffect } from "react";
import { getPostById, deletePost, getPostsByUser } from "../utils/api";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal/ConfirmationModal";
import { useAuth } from "./context/AuthContext";

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);

        if (data.user_id) {
          const relatedData = await getPostsByUser(data.user_id);
          setRelatedPosts(relatedData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleEdit = () => {
    if (!user) {
      toast.error("You must be logged in to edit a post.");
      return;
    }
    navigate(`/posts/edit/${postId}`);
  };

  const handleDelete = () => {
    if (!user) {
      toast.error("You must be logged in to delete a post.");
      return;
    }
    setPostToDelete(postId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePost(postToDelete, localStorage.getItem("token"));
      toast.success("Post deleted successfully!");
      navigate("/posts");
    } catch (error) {
      setError(error.message);
      toast.error("Failed to delete the post.");
    } finally {
      setIsModalOpen(false);
      setPostToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-400 to-red-500">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const userInitial = post?.user?.name?.charAt(0).toUpperCase() || "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-400 to-red-500 pt-16 px-4">
      <div className="relative bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl h-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 sm:-left-2 sm:top-1/2 sm:-translate-y-1/2 sm:transform bg-gradient-to-r from-red-400 to-orange-400 rounded-full w-24 h-24 sm:w-48 sm:h-48 flex items-center justify-center">
          <span className="text-2xl sm:text-4xl font-bold text-white">
            {userInitial}
          </span>
        </div>

        {/* Content */}
        <div className="mt-10 sm:mt-0 sm:ml-48">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {post ? (
            <>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                {post.title}
              </h1>
              <p className="text-gray-700 mb-4 w-full max-w-xl">
                {post.content}
              </p>
              <p className="text-gray-500 mb-12">
                Posted by: <strong>{post.user?.name || "Unknown User"}</strong>
              </p>
              {user?.id === post.user_id && (
                <div className="flex flex-col space-y-4 mb-8">
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEdit}
                      className="bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              <Link
                to="/posts"
                className="bg-gradient-to-r from-red-500 to-orange-400 text-white px-10 py-3 rounded-full hover:from-red-600 hover:to-orange-500 transition duration-300 ease-in-out"
              >
                Back to posts
              </Link>
            </>
          ) : (
            <p className="text-gray-600 text-center">Post not found.</p>
          )}
        </div>
      </div>

      {/* Related Posts Section */}
      <div className="w-full px-4 sm:px-8 mt-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Related Posts ...
        </h2>
        {relatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/posts/${relatedPost.id}`}
                className="bg-white bg-opacity-80 border border-transparent hover:border-gray-300 rounded-lg p-4 overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {relatedPost.title}
                </h2>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {relatedPost.content}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No related posts available.</p>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
}

export default PostDetail;
