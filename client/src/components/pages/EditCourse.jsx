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
    <div className="relative">
    <div className="p-8 bg-gray-50 min-h-screen ">
       <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10 border-b pb-4 border-indigo-200">
        <h1 className="text-3xl font-bold text-gray-800">Edit Course</h1>

        <button
          type="submit"
          form="editCourseForm"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover:shadow-2xl transform hover:-translate-y-0.5 duration-200 ease-in-out text-white px-6 py-3 rounded-xl shadow-lg transition disabled:opacity-50 disabled:bg-gray-500"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form
        id="editCourseForm"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border-t-8 border-indigo-600"
      >
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Course Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Upload File</label>
          <input
            type="file"
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-3 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-150"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
      </form>
      </div>
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
    </div>
  );
}
