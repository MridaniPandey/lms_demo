import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditAssignment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Load user
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
        for (let file of newFiles) {
          formData.append("files", file);
        }
      }

      await axios.patch(`http://localhost:3001/assignments/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Assignment updated successfully!");
      navigate("/assignments");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update assignment.");
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) return <p className="p-8">Loading assignment...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Assignment</h1>

        <button
          type="submit"
          form="editAssignmentForm"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Form */}
      <form
        id="editAssignmentForm"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md space-y-6 max-w-3xl mx-auto"
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
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
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
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
            required
          ></textarea>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Deadline</label>
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
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Link */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Reference Link</label>
          <input
            type="text"
            value={assignment.link || ""}
            onChange={(e) =>
              setAssignment({ ...assignment, link: e.target.value })
            }
            placeholder="https://example.com"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Files */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload New Files</label>
          <input
            type="file"
            multiple
            onChange={(e) => setNewFiles([...e.target.files])}
            className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50"
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
      </form>
    </div>
  );
}
