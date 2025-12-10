import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [assignment, setAssignment] = useState("");
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
        navigate("/login"); // redirect if no user
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
      alert("Only instructors can add courses.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("assignment", assignment);
      if (file) formData.append("file", file);

      // No Authorization header needed
      await axios.post("http://localhost:3001/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Course Added Successfully!");
      navigate("/allcourses"); // redirect to courses page
    } catch (err) {
      console.error("Add course failed:", err);
      alert("Failed to add course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add New Course</h1>
        {isInstructor && (
          <button
            type="submit"
            form="addCourseForm"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Course"}
          </button>
        )}
      </div>

      {/* Form */}
      <form
        id="addCourseForm"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md space-y-6 max-w-3xl mx-auto"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">Course Title</label>
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
          <label className="block text-gray-700 font-medium mb-1">Assignments</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
            value={assignment}
            onChange={(e) => setAssignment(e.target.value)}
            placeholder="Assignment title or link"
          />
        </div>
      </form>
    </div>
  );
}
