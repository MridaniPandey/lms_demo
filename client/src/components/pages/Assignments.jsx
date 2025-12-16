import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Edit, FileText, UploadCloud, X, Send, Users, CheckCircle, Clock } from "lucide-react";
import axios from "axios";

export default function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [user, setUser] = useState(null);

  // DELETE MODAL STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // FILE UPLOAD STATES
  const [showUpload, setShowUpload] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const fileInputs = useRef({});

  // SUBMISSIONS MODAL STATES
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  // Load user
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
      console.warn("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all assignments
  useEffect(() => {
    axios
      .get("http://localhost:3001/assignments")
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error("Error fetching assignments:", err));
  }, []);

  const isInstructor = user?.role?.toLowerCase() === "instructor";
  const isStudent = user?.role?.toLowerCase() === "student";

  // Handle delete confirmation (Reverted to simple logic)
  const handleConfirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handle actual delete (Reverted)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/assignments/${id}`);
      setAssignments(assignments.filter((a) => a.id !== id));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete assignment.");
    }
  };

  // Student submission upload (Reverted)
  const handleUpload = async (assignmentId) => {
    const files = selectedFiles[assignmentId];
    if (!files || files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", user.id);

    try {
      await axios.post("http://localhost:3001/submissions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Submission uploaded successfully!");
      setShowUpload({ ...showUpload, [assignmentId]: false });
      setSelectedFiles({ ...selectedFiles, [assignmentId]: [] });
      if (fileInputs.current[assignmentId]) {
        fileInputs.current[assignmentId].value = "";
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload submission. You may have already submitted.");
    }
  };

  // Instructor: View submissions (Reverted to original fetch logic)
  const viewSubmissions = async (assignmentId, title) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/submissions/assignment/${assignmentId}`
      );
          console.log("Submissions data:", res.data); // <-- Add this line

      // Store raw submissions data
      setSubmissions(res.data);
      setCurrentAssignment(title);
      setShowSubmissionsModal(true);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      alert("Failed to fetch submissions.");
    }
  };


  return (
    <div className="relative min-h-screen bg-gray-50">
      <div
        className={
          showDeleteModal || showSubmissionsModal
            ? "blur-sm transition-all duration-300"
            : "transition-all duration-300"
        }
      >
        <div className="p-8 max-w-6xl mx-auto">
          {/* --- Header (Reverted) --- */}
          <div className="flex justify-between items-center mb-10 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Assignments
            </h1>

            {isInstructor && (
              <button
                onClick={() => navigate("/assignments/add")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
              >
                <PlusCircle size={20} /> New Assignment
              </button>
            )}
          </div>
          
          {/* --- Assignment Grid (Reverted) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map(assignment => {
              // console.log("Assignment:", assignment); 
                const deadlineDate = new Date(assignment.deadline);
                const isLate = deadlineDate < new Date();
                const deadlineString = deadlineDate.toLocaleString();

                return (
                    <div 
                        key={assignment.id} 
                        className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between border border-gray-200"
                    >
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h2>
                            <p className="text-gray-600 mb-3 line-clamp-3">{assignment.description}</p>
                            
                            <div className={`flex items-center text-sm font-medium p-2 rounded-lg ${isLate ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                <Clock size={16} className="mr-2" /> 
                                <span>{isLate ? 'Deadline Passed:' : 'Due Date:'} {deadlineString}</span>
                            </div>
                            {/* ✅ LINK & FILE — VISIBLE TO BOTH */}
  <div className="flex gap-2 mt-3">
    {assignment.link && (
      <a
        href={assignment.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
      >
        <Send size={16} /> View Link
      </a>
    )}

    {assignment.files && assignment.files.length > 0 &&(
      <a
        href={`http://localhost:3001/uploads/${assignment.files[0]}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition text-sm font-medium"
      >
        <FileText size={16} /> View Assignment File
      </a>
    )}
  </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            {/* INSTRUCTOR ACTIONS */}
                            {isInstructor && (
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => navigate(`/assignments/edit/${assignment.id}`)} className="flex-1 flex items-center justify-center gap-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-medium"> 
                                        <Edit size={16} /> Edit 
                                    </button>
                                    <button onClick={() => handleConfirmDelete(assignment.id)} className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"> 
                                        <Trash2 size={16} /> Delete 
                                    </button>
                                    <button onClick={() => viewSubmissions(assignment.id, assignment.title)} className="w-full mt-2 flex items-center justify-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"> 
                                        <Users size={16} /> View Submissions
                                    </button>
                                </div>
                            )}

                            {/* STUDENT ACTIONS */}
                            {isStudent && (
                                <>
                                    {/* Link and File buttons
                                    <div className="flex gap-2 mb-3">
                                        {assignment.link && (
                                            <a href={assignment.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-medium">
                                                <Send size={16} /> View Link
                                            </a>
                                        )}
                                        {/* {assignment.file && (
                                            <a href={`http://localhost:3001/uploads/${assignment.file}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition text-sm font-medium">
                                                <FileText size={16} /> Download File
                                            </a>
                                        )} */}
                                   
                                    
                                    {/* Upload Button */}
                                    <button
                                        onClick={() => setShowUpload({ ...showUpload, [assignment.id]: !showUpload[assignment.id] })}
                                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
                                        disabled={isLate}
                                    >
                                        <UploadCloud size={20} /> 
                                        {isLate ? "Deadline Passed" : "Submit Assignment"}
                                    </button>

                                    {/* Upload Form Area */}
                                    {showUpload[assignment.id] && (
                                        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <input
                                                type="file"
                                                multiple
                                                ref={el => fileInputs.current[assignment.id] = el}
                                                onChange={(e) => setSelectedFiles({ ...selectedFiles, [assignment.id]: e.target.files })}
                                                className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-700"
                                            />
                                            <button 
                                                onClick={() => handleUpload(assignment.id)}
                                                className="mt-3 w-full flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                            >
                                                <Send size={16} /> Final Upload
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
          </div>
          
          {assignments.length === 0 && (
            <div className="text-center py-10">
                <h2 className="text-xl font-bold text-gray-700">No Assignments Found</h2>
            </div>
          )}

        </div>
      </div>

      {/* --- Delete Modal (Reverted) --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this assignment?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* --- SUBMISSIONS MODAL (Reverted to original List View) --- */}
      {/* --- SUBMISSIONS MODAL (Table View) --- */}
{showSubmissionsModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="text-xl font-bold text-gray-800">Submissions for: {currentAssignment}</h3>
        <button onClick={() => setShowSubmissionsModal(false)} className="text-gray-500 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>
      </div>

      {submissions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No submissions received yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2">S.No</th>
              <th className="border border-gray-300 px-3 py-2">Student Name</th>
              <th className="border border-gray-300 px-3 py-2">Assignment Title</th>
              <th className="border border-gray-300 px-3 py-2">Files Uploaded</th>
              <th className="border border-gray-300 px-3 py-2">Submitted Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, index) => (
              <tr key={sub.id || index} className="even:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-3 py-2">{sub.studentFullName}</td>
                <td className="border border-gray-300 px-3 py-2">{currentAssignment}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {sub.files && sub.files.length > 0 ? (
                    sub.files.map((file, i) => (
                      <div key={i}>
                        <a
                          href={`http://localhost:3001/uploads/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <FileText size={16} /> {file}
                        </a>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No file</span>
                  )}
                </td>
                 <td className="border border-gray-300 px-3 py-2">
          {sub.submittedAt? new Date(sub.submittedAt).toLocaleString() : "N/A"}
        </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => setShowSubmissionsModal(false)}
          className="w-full px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}