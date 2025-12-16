import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import folder from "../../assets/folder.png";
import assignment from "../../assets/assignment.png";
import collaboration from "../../assets/collaboration.png";
import student from "../../assets/student.png";
import lms from "../../assets/lms.png";

const Homepage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Safely get user from localStorage
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
  

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <header className="relative bg-linear-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 py-24 flex flex-col md:flex-row items-center md:justify-between">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Empower Learning with <span className="text-yellow-300">SmartLMS</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-100">
              Create, manage, and track courses effortlessly. A complete LMS designed for instructors and students alike.
            </p>

            <div className="flex gap-4">
              {/* Get Started */}
              <button className="bg-yellow-300 text-gray-900 font-semibold px-6 py-3 rounded shadow hover:shadow-lg transition">
                Get Started
              </button>

              {/* All Courses */}
              <button
                onClick={() => navigate("/allcourses")}
                className="bg-blue-600 text-white font-semibold px-6 py-3 rounded shadow hover:shadow-lg transition"
              >
                All Courses
              </button>
            </div>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0 relative">
            <img
              src={lms}
              alt="LMS Illustration"
              className="rounded-xl shadow-2xl -rotate-3"
            />
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <img
            src={student}
            alt="Students Learning"
            className="rounded-xl shadow-xl"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose SmartLMS?</h2>
          <p className="text-gray-700 mb-4">
            SmartLMS streamlines the entire learning process, helping instructors manage courses and students track their progress seamlessly.
          </p>
          <p className="text-gray-700">
            Engage your learners with interactive lessons, multimedia content, and real-time feedback. Simplify course creation and boost productivity.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition transform cursor-pointer">
              <img src={folder} alt="Feature 1" className="mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">Course Management</h3>
              <p className="text-gray-600">
                Create, edit, and organize courses with a smooth and intuitive interface.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition transform cursor-pointer">
              <img src={assignment} alt="Feature 2" className="mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">Assignments & Grades</h3>
              <p className="text-gray-600">
                Track student performance and grade assignments efficiently.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition transform cursor-pointer">
              <img src={collaboration} alt="Feature 3" className="mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">
                Engage learners with quizzes, videos, and collaborative tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Buttons Section */}
      {user && (
        <section className="container mx-auto px-6 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Quick Access</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => navigate("/allcourses")}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded shadow hover:shadow-lg transition"
            >
              All Courses
            </button>

            <button
              onClick={() => navigate("/assignments")}
              className="bg-green-600 text-white font-semibold px-6 py-3 rounded shadow hover:shadow-lg transition"
            >
              Assignments
            </button>

            {user.role?.toLowerCase() === "student" && (
              <button
                onClick={() => navigate("/enrolled-courses")}
                className="bg-purple-600 text-white font-semibold px-6 py-3 rounded shadow hover:shadow-lg transition"
              >
                Enrolled Courses
              </button>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-indigo-600 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-2">&copy; {new Date().getFullYear()} SmartLMS. All rights reserved.</p>
          <p className="text-gray-200">Made with ❤️ for educators and learners.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
