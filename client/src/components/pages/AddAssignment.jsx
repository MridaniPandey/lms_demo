import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddAssignment() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState(""); // for URL
  const [deadline, setDeadline] = useState(""); // for deadline
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      }
    } catch (err) {
      console.warn("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  }, [navigate]);

  const isInstructor = user?.role?.toLowerCase() === "instructor";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isInstructor) {
      alert("Only instructors can add assignments.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", desc);
      formData.append("link", link);
      formData.append("deadline", deadline);
      if (file) formData.append("files", file);

      await axios.post("http://localhost:3001/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Assignment Added Successfully!");
      navigate("/assignments");
    } catch (err) {
      console.error(
        "Add assignment failed:",
        err.response ? err.response.data : err.message
      );
      alert("Failed to add assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add New Assignment</h1>
        {isInstructor && (
          <button
            type="submit"
            form="addAssignmentForm"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Assignment"}
          </button>
        )}
      </div>

      {/* Form */}
      <form
        id="addAssignmentForm"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md space-y-6 max-w-3xl mx-auto"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
            rows="4"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload File</label>
          <input
            type="file"
            className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Link / URL</label>
          <input
            type="url"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Deadline</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
      </form>
    </div>
  );
}
