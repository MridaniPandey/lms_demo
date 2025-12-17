import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, FileText, CheckCircle, Edit, Trash2 } from "lucide-react";
import axios from "axios";

export default function AllCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);


  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3001/courses");
        setCourses(res.data.filter((c) => !c.isDeleted));
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false); //  ensures loading is removed for everyone
      }
    };

    fetchCourses();
  }, []);

  // Fetch enrolled courses (students only)
  useEffect(() => {
    if (!user || user.role.toLowerCase() !== "student") return;

    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/enrollments/student/${user.id}`
        );
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  // Enroll in a course
  const handleEnroll = async (course) => {
    if (!user) return;

    try {
      await axios.post(`http://localhost:3001/enrollments`, {
        studentId: user.id,
        courseId: course.id,
      });
      setEnrolledCourses([...enrolledCourses, course]);
    } catch (err) {
      console.error("Enroll failed:", err);
      alert("Failed to enroll in course.");
    }
  };

  // Delete course (instructor only)
// Delete course (instructor only)
const handleDelete = async (id) => {
  try {
    const res = await axios.delete(`http://localhost:3001/courses/${id}`);

    if (res.status === 200 || res.status === 204) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setEnrolledCourses((prev) => prev.filter((c) => c.id !== id));
      setShowDeleteModal(false);
      setDeleteId(null);
    } else {
      alert("Failed to delete course.");
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete course.");
  }
};



  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b pb-4 border-gray-300">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            All Courses
          </h1>

          {user?.role?.toLowerCase() === "instructor" && (
            <button
              onClick={() => navigate("/courses/add")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 duration-200 ease-in-out"
            >
              <PlusCircle size={20} /> Add Course
            </button>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-md">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-600">
                No courses available yet.
              </p>
            </div>
          ) : (
            courses.map((course) => {
              // console.log("Course filePath:", course.filePath);

              const isEnrolled = enrolledCourses.some((c) => c.id === course.id);

              return (
                <div
                  key={course.id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-8 border-indigo-500 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {course.title || "Untitled Course"}
                    </h2>

                    <p className="text-gray-600 mb-4 text-sm">
                      {course.description || "No description"}
                    </p>

                    {(course.assignment || course.createdAt) && (
                      <div className="mb-4 pt-2 border-t border-gray-100">
                        {course.assignment && (
                          <p className="text-gray-700 text-sm font-medium">
                            <strong>Assignment:</strong> {course.assignment}
                          </p>
                        )}
                        {course.createdAt && (
                          <p className="mt-1 text-gray-500 text-xs">
                            Created on: {new Date(course.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    {course.filePath && (
                      <>
                        {user?.role?.toLowerCase() === "instructor" || isEnrolled ? (
                          <a
                            href={`http://localhost:3001/uploads/${course.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition"
                          >
                            <FileText size={16} /> View Course File
                          </a>
                        ) : (
                          <p className="mt-3 text-sm text-red-600 font-semibold bg-red-50 p-2 rounded-lg">
                            Enroll in course to view the file content.
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    {user?.role?.toLowerCase() === "student" && (
                      <button
                        onClick={() => handleEnroll(course)}
                        disabled={isEnrolled}
                        className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 ${
                          isEnrolled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <CheckCircle size={18} /> Enrolled
                          </>
                        ) : (
                          "Enroll in Course"
                        )}
                      </button>
                    )}

                    {user?.role?.toLowerCase() === "instructor" && (
                      <>
                        <button
                          onClick={() => navigate(`/courses/edit/${course.id}`)}
                          className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
  onClick={() => {
    setDeleteId(course.id);
    setShowDeleteModal(true);
  }}
  className="flex-1 flex items-center justify-center gap-1 
             bg-red-600 text-white px-4 py-2 rounded-lg 
             hover:bg-red-700 transition text-sm font-medium"
>
  <Trash2 size={16} /> Delete
</button>


                        

                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center 
                  bg-black/30 backdrop-blur-sm p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Confirm Deletion
      </h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this course?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => handleDelete(deleteId)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
