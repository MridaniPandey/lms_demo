import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import axios from "axios";

export default function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [user, setUser] = useState(null);

  // Load user
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

  // Fetch all assignments
  useEffect(() => {
    axios
      .get("http://localhost:3001/assignments")
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error("Error fetching assignments:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;

    try {
      await axios.delete(`http://localhost:3001/assignments/${id}`);
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete assignment.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Assignments</h1>

        {user?.role?.toLowerCase() === "instructor" && (
          <button
            onClick={() => navigate("/assignments/add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          >
            <PlusCircle size={20} /> Add Assignment
          </button>
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assignments.length === 0 ? (
          <p className="text-gray-500">No assignments available yet.</p>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 flex flex-col justify-between border-l-4 border-blue-500"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {assignment.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {assignment.description}
                </p>

                {/* DEADLINE */}
                {assignment.deadline && (
                  <p className="mt-2 text-sm text-sky-950 font-semibold">
                    Deadline: {new Date(assignment.deadline).toLocaleString()}
                  </p>
                )}

                {/* LINK */}
                {assignment.link && (
                  <a
                    href={assignment.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
                  >
                    View Link
                  </a>
                )}

                {/* FILES */}
                {assignment.files && assignment.files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {assignment.files.map((file, index) => (
                      <a
                        key={index}
                        href={`http://localhost:3001/${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition"
                      >
                        {file.split("/").pop()}
                      </a>
                    ))}
                  </div>
                )}

                {/* CREATED AT */}
                {assignment.createdAt && (
                  <p className="mt-2 text-gray-400 text-sm">
                    Created on:{" "}
                    {new Date(assignment.createdAt).toLocaleString()}
                  </p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="mt-4 flex flex-wrap gap-3">
                {/* STUDENT BUTTON */}
                {user?.role?.toLowerCase() === "student" && (
                  <button className="bg-teal-900 text-white px-4 py-2 rounded-md hover:bg-teal-800 transition">
                    Upload files
                  </button>
                )}

                {/* INSTRUCTOR BUTTONS */}
                {user?.role?.toLowerCase() === "instructor" && (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/assignments/edit/${assignment.id}`)
                      }
                      className="bg-teal-900 text-white px-4 py-2 rounded-md hover:bg-teal-950 transition"
                    >
                      Edit
                    </button>

                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="bg-teal-900 text-white px-4 py-2 rounded-md hover:bg-teal-950 transition"
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
