import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";  //
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import AllCourses from "./components/pages/AllCourses";
import AddCourse from "./components/pages/AddCourse";
import EnrolledCourses from "./components/pages/EnrolledCourses";
 import Homepage from "./components/pages/Homepage";
 import EditCourse from "./components/pages/EditCourse";
 import Assignments from "./components/pages/Assignments";
 import AddAssignment from "./components/pages/AddAssignment";
 import EditAssignment from './components/pages/EditAssignment';

// import Profile from "./pages/Profile";
function App() {
   return (
    <Router>
      <Header />

      <Routes>
        <Route path="/login" element={<Login />} />
         
        <Route path="/register" element={<Register />} />
         <Route path="/homepage" element={<Homepage />} />
        <Route path="/allcourses" element={<AllCourses />} />
        <Route path="/courses/add" element={<AddCourse />} />
        <Route path="/enrolledcourses" element={<EnrolledCourses />} />

         <Route path="/courses/edit/:id" element={<EditCourse />} />
<Route path="/assignments" element={<Assignments />} />
<Route path="/assignments/add" element={<AddAssignment/>}/>
<Route path="/assignments/edit/:id" element={<EditAssignment />} />

        
       {/* <Route path="/" element={<Dashboard />} /> */}
        {/* <Route path="/profile" element={<Profile />} />
        Add the rest of your pages */} 
      </Routes>
    </Router>
  );
}

export default App;
