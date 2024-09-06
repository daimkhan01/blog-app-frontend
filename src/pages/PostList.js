import React, { useState, useEffect } from "react";
import { getPosts } from "../utils/api";
import { Link } from "react-router-dom";
import Pagination from "../components/pagination/Pagination";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 9;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = JSON.parse(atob(token.split(".")[1]));
      setLoggedInUserId(user.id);
    }

    const fetchPosts = async () => {
      try {
        const data = await getPosts(currentPage, pageSize, searchTerm);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Posts</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          {loggedInUserId && (
            <Link
              to="/posts/create"
              className="text-white bg-blue-600 font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Create Post
            </Link>
          )}
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Posts</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 p-3 sm:p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-105"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300"
                >
                  {loggedInUserId === post.user_id && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                  <h2 className="text-2xl font-bold text-gray-900">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 mt-2">{post.content}</p>
                  <p className="text-gray-500 mt-4">
                    Posted by: {post.user?.name}
                  </p>
                </Link>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          <p className="text-gray-600 text-center">No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default PostList;
