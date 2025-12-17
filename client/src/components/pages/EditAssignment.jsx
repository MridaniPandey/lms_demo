import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock } from "lucide-react";

import axios from "axios";

export default function EditAssignment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
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

  // Fetch assignment data
  useEffect(() => {
    axios
      .get(`http://localhost:3001/assignments/${id}`)
      .then((res) => setAssignment(res.data))
      .catch((err) => {
        console.error("Failed to fetch assignment:", err);
        alert("Error loading assignment data");
        navigate("/assignments");
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role?.toLowerCase() !== "instructor") {
      alert("Only instructors can edit assignments.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", assignment.title);
      formData.append("description", assignment.description);
      formData.append("deadline", assignment.deadline || "");
      formData.append("link", assignment.link || "");

      if (newFiles.length > 0) {
        newFiles.forEach((file) => formData.append("files", file));
      }

      await axios.patch(`http://localhost:3001/assignments/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Show success popup
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/assignments");
      }, 1500);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update assignment.");
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) return <p className="p-8">Loading assignment...</p>;

  return (
    <div className="relative">
    <div className="p-8 bg-gray-50 min-h-screen ">
      <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Edit Assignment</h1>

        <button
          type="submit"
          form="editAssignmentForm"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover:shadow-2xl transform hover:-translate-y-0.5 duration-200 ease-in-out text-white px-6 py-3 rounded-xl shadow-lg transition disabled:opacity-50 disabled:bg-gray-500"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Form */}
      <form
        id="editAssignmentForm"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border-t-8 border-indigo-600"
      >
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Assignment Title</label>
          <input
            type="text"
            value={assignment.title}
            onChange={(e) =>
              setAssignment({ ...assignment, title: e.target.value })
            }
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-500  focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            value={assignment.description}
            onChange={(e) =>
              setAssignment({ ...assignment, description: e.target.value })
            }
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          ></textarea>
        </div>

        {/* Files */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload New Files</label>
          <input
            type="file"
            multiple
            onChange={(e) => setNewFiles([...e.target.files])}
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-3 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-150"
            />

          {/* Current files */}
          {assignment.files && assignment.files.length > 0 && (
            <div className="mt-2">
              <p className="text-gray-600 font-medium mb-1">Current Files:</p>
              <ul className="list-disc ml-5 text-blue-600">
                {assignment.files.map((file, index) => (
                  <li key={index}>
                    <a
                      href={`http://localhost:3001/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {file.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Link */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">External Link / URL (Optional)</label>
          <input
            type="text"
            value={assignment.link || ""}
            onChange={(e) =>
              setAssignment({ ...assignment, link: e.target.value })
            }
            placeholder="https://example.com"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Deadline */}
        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <label className=" text-pink-800 font-bold mb-2 flex items-center">
            <Clock size={20} className="mr-2"/> Set Submission Deadline (Required)
            </label>
          <input
            type="datetime-local"
            value={
              assignment.deadline
                ? new Date(assignment.deadline).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setAssignment({ ...assignment, deadline: e.target.value })
            }
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        

        
      </form>
      </div>
      {/* Success popup */}
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-300">
            <h2 className="text-green-700 font-bold text-lg">
              Assignment updated successfully!
            </h2>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
