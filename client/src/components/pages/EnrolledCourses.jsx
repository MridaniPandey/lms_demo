import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, CheckCircle } from "lucide-react";

export default function EnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://localhost:3001/enrollments/student/${user.id}`
      );

      setEnrolledCourses(res.data);
    } catch (err) {
      console.error(err?.message || err); // remove :any
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);


  // ----------------- Loading State -----------------
  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading enrolled courses...</p>
      </div>
    );
  }

  // ----------------- Error State -----------------
  if (error) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  // ----------------- Empty State -----------------
  if (enrolledCourses.length === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-b pb-4">
          My Enrolled Courses
        </h1>
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-semibold text-gray-600">
            You are not currently enrolled in any courses.
          </p>
        </div>
      </div>
    );
  }

  // ----------------- Main UI -----------------
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-b pb-4 border-gray-300">
          My Enrolled Courses
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-8 border-blue-500 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {course.title || "Untitled Course"}
                </h2>

                <p className="text-gray-600 text-sm mt-2">
                  {course.description || "No description"}
                </p>

                {(course.assignment || course.createdAt) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {course.assignment && (
                      <p className="text-gray-700 text-sm font-medium">
                        <strong>Assignment:</strong> {course.assignment}
                      </p>
                    )}

                    {course.createdAt && (
                      <p className="text-gray-500 text-xs mt-1">
                        Created on:{" "}
                        {new Date(course.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {course.filePath && (
                <a
                  href={`http://localhost:3001/uploads/${course.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 mt-6 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  <FileText size={18} /> Access Course Material
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
