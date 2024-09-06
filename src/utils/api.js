import axios from "axios";

const API_URL = "http://localhost:4000/api";
axios.defaults.baseURL = API_URL;

// Sign Up
export const signUp = async (userData) => {
  try {
    const response = await axios.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Sign up error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Sign up failed");
  }
};

// Login
export const login = async (userData) => {
  try {
    const response = await axios.post("/auth/login", userData);
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Login failed");
  }
};

// Create Post
export const createPost = async (postData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    const response = await axios.post("/posts", postData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Create post error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to create post");
  }
};

// Get All Posts
export const getPosts = async (page, pageSize, searchTerm) => {
  try {
    const response = await axios.get("/posts", {
      params: {
        page,
        pageSize,
        search: searchTerm,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get posts error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to fetch posts");
  }
};

// Get Post By ID
export const getPostById = async (postId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`/posts/${postId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get post by ID error:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Failed to fetch post");
  }
};

// Update Post
export const updatePost = async (postId, postData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    const response = await axios.put(`/posts/${postId}`, postData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Update post error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to update post");
  }
};

// Delete Post
export const deletePost = async (postId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    const response = await axios.delete(`/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Delete post error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to delete post");
  }
};

// Get Posts By User
export const getPostsByUser = async (userId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    const response = await axios.get(`/posts/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get posts by user error:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Failed to fetch posts by user");
  }
};
