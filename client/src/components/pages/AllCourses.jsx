import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import axios from "axios";

export default function AllCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
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
      }
    } catch (err) {
      console.warn("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  // Fetch courses
  useEffect(() => {
    axios
      .get("http://localhost:3001/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`http://localhost:3001/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete course. Make sure backend allows deletion without auth.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Courses</h1>

        {user?.role?.toLowerCase() === "instructor" && (
          <button
            onClick={() => navigate("/courses/add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          >
            <PlusCircle size={20} /> Add Course
          </button>
        )}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <p className="text-gray-500">No courses available yet.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  {course.title || "Untitled Course"}
                </h2>

                <p className="text-gray-500 mt-2">
                  {course.description || "No description"}
                </p>

                {course.assignment && (
                  <p className="mt-2 text-gray-600">
                    <strong>Assignment:</strong> {course.assignment}
                  </p>
                )}

                {course.createdAt && (
                  <p className="mt-2 text-gray-400 text-sm">
                    Created on: {new Date(course.createdAt).toLocaleString()}
                  </p>
                )}

                {course.filePath && (
                  <a
                    href={`http://localhost:3001/${course.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline block mt-3"
                  >
                    View File
                  </a>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap gap-3">
                {user?.role?.toLowerCase() === "student" && (
                  
                <button className="bg-teal-900 text-white px-4 py-2 rounded-md">
                  Enroll in Course
                </button>
                )}

                {user?.role?.toLowerCase() === "instructor" && (
                  <>
                    <button
                      onClick={() => navigate(`/courses/edit/${course.id}`)}
                      className="bg-teal-900 text-white px-4 py-2 rounded-md"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(course.id)}
                      className="bg-teal-900 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
