import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react"; // Import icons for better visuals
import axios from "axios";

export default function AddCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // SUCCESS MODAL STATE
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      console.warn("Failed to parse user:", err);
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
      if (file) formData.append("file", file);

      await axios.post("http://localhost:3001/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Show success modal
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/allcourses");
      }, 1500);

    } catch (err) {
      console.error("Add course failed:", err);
      alert("Failed to add course.");
    } finally {
      setLoading(false);
    }
  };

  if (!isInstructor) {
    return (
        <div className="p-8 bg-gray-100 min-h-screen text-center flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-700">You must be an instructor to create a new course.</p>
            <button
                onClick={() => navigate("/allcourses")}
                className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
            >
                <ArrowLeft size={20} /> Go to All Courses
            </button>
        </div>
    );
  }

  return (
    <div className="relative">

      {/* MAIN CONTENT (blurs when modal is open) */}
      <div className={showSuccessModal ? "blur-sm transition-all duration-300" : "transition-all duration-300"}>
        <div className="p-8 bg-gray-50 min-h-screen">

          {/* Form Container */}
          <div className="max-w-4xl mx-auto">
            
            {/* Header and Action Button */}
            <div className="flex justify-between items-center mb-10 border-b pb-4 border-indigo-200">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                 Create New Course
              </h1>
              
              <button
                type="submit"
                form="addCourseForm"
                disabled={loading}
                // Submission button uses Green 600 (consistent with Assignments submit button)
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover:shadow-2xl transform hover:-translate-y-0.5 duration-200 ease-in-out text-white px-6 py-3 rounded-xl shadow-lg transition disabled:opacity-50 disabled:bg-gray-500"
              >
                {loading ? "Adding Course..." : "Publish Course"}
              </button>
            </div>

            {/* Form */}
            <form
              id="addCourseForm"
              onSubmit={handleSubmit}
              // Card style uses white background, subtle shadow, and a branded border top (Indigo)
              className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border-t-8 border-indigo-600"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Course Title</label>
                <input
                  type="text"
                  // Input styles focused on blue ring (consistent with theme)
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to React Development"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  rows="5"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Provide a detailed description of the course content and objectives."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Upload Course File (e.g., PDF, Slides, Video)
                </label>
                <input
                  type="file"
                  // Custom file input style for branding
                  className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-3 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-150"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <p className="text-xs text-gray-500 mt-2">Maximum file size 50MB. Only one file per course.</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* --- SUCCESS MODAL --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center transform transition-all duration-300 scale-100 border-t-4 border-green-600">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Course Added</h2>
            <p className="text-gray-600 mt-2">Course {title} has been created successfully.</p>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/allcourses");
              }}
              className="mt-6 px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              View All Courses
            </button>
          </div>
        </div>
      )}

    </div>
  );
}