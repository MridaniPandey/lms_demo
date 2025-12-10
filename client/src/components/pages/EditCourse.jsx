import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams(); // course ID from URL

  const [course, setCourse] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Get logged-in user
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch course data
  useEffect(() => {
    axios
      .get(`http://localhost:3001/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => {
        console.error("Failed to fetch course:", err);
        alert("Failed to load course data");
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
      formData.append("title", course.title);
      formData.append("desc", course.description);
      formData.append("assignment", course.assignment || "");
      if (file) formData.append("file", file);

      await axios.patch(`http://localhost:3001/courses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Course updated successfully!");
      navigate("/allcourses");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <p className="p-8">Loading course data...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
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

      {/* Form */}
      <form
        id="editCourseForm"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md space-y-6 max-w-3xl mx-auto"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">Course Title</label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
            placeholder="Enter course title"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
            placeholder="Enter course description"
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
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
          {course.filePath && (
            <p className="text-sm text-gray-500 mt-1">
              Current file:{" "}
              <a
                href={`http://localhost:3001/${course.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                View
              </a>
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Assignments</label>
          <input
            type="text"
            value={course.assignment || ""}
            onChange={(e) => setCourse({ ...course, assignment: e.target.value })}
            placeholder="Assignment title or link"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
          />
        </div>
      </form>
    </div>
  );
}
