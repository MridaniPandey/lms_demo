import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);

  // Load user
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch course
  useEffect(() => {
    axios
      .get(`http://localhost:3001/courses/${id}`)
      .then((res) => {
        setTitle(res.data.title || "");
        setDesc(res.data.description || "");
      })
      .catch((err) => {
        console.error("Failed to fetch course:", err);
        alert("Error loading course data");
        navigate("/allcourses");
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role?.toLowerCase() !== "instructor") {
      alert("Only instructors can edit courses.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      if (file) formData.append("file", file);

      await axios.patch(`http://localhost:3001/courses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/allcourses");
      }, 1500);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Course</h1>

        <button
          type="submit"
          form="editCourseForm"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form
        id="editCourseForm"
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
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload File</label>
          <input
            type="file"
            className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
      </form>

      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-300">
            <h2 className="text-green-700 font-bold text-lg">
              Course updated successfully!
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
