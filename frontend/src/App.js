import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";

import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import TpoCompanyDetails from "./pages/TpoCompanyDetails";   // ⭐ FIX

import TpoPlaced from "./pages/Tpoplaced"; 
import TpoAbout  from "./pages/Tpoabout";

import Profile from "./pages/Profile";
import StudentSuggestions   from "./pages/StudentSuggestions";    // ✅ TPO view


// import ResumeUpload from "./pages/ResumeUpload";
import UploadStudents from "./pages/UploadStudents";

import TpoDashboard from "./pages/TpoDashboard";
import TpoCompanies from "./pages/TpoCompanies";

import ForgotPassword from "./pages/ForgotPassword";
import Resume from "./pages/Resume";
import Resources from "./pages/Resources";
import TpoStudents from "./pages/TpoStudents";

import Announcements from "./pages/Announcements";
import TpoAnnouncements from "./pages/TpoAnnouncements";

import ProtectedRoute from "./components/ProtectedRoute";

import TpoApplications from "./pages/TpoApplications";
import StudentChatbot from "./pages/StudentChatbot";

import AddStudent from "./pages/AddStudent";


import "bootstrap/dist/css/bootstrap.min.css";


/* ───────── Admin Guard (TPO / HOD only) ───────── */
function AdminRoute({ children }) {

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/admin-login" replace />;

  if (user.role !== "tpo" )
    return <Navigate to="/dashboard" replace />;

  return children;
}


function App() {

  return (

    <Router>

      <Routes>

        {/* ───────── Public Routes ───────── */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/chatbot" element={<StudentChatbot />} />

        {/* ───────── Student Routes ───────── */}

        <Route path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route
          path="/companies"
          element={<ProtectedRoute><Companies /></ProtectedRoute>}
        />

        {/* ⭐ Student Company Details */}
        <Route
          path="/company/:id"
          element={<ProtectedRoute><CompanyDetails /></ProtectedRoute>}
        />

        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        <Route path="/suggestions"
          element={<ProtectedRoute><StudentSuggestions /></ProtectedRoute>} />

        <Route
          path="/resume"
          element={<ProtectedRoute><Resume /></ProtectedRoute>}
        />

        {/* <Route
          path="/resume-upload"
          element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>}
        /> */}

        <Route
          path="/resources"
          element={<ProtectedRoute><Resources /></ProtectedRoute>}
        />
        <Route path="/admin/add-student" element={<AddStudent />} />

        {/* ───────── Admin / TPO Routes ───────── */}

        <Route
path="/admin/applications"
element={<AdminRoute><TpoApplications/></AdminRoute>}
/>

        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/tpo-dashboard"
          element={<AdminRoute><TpoDashboard /></AdminRoute>}
        />

        <Route path="/admin/placed"
          element={<AdminRoute><TpoPlaced /></AdminRoute>} />

        <Route
          path="/upload-students"
          element={<AdminRoute><UploadStudents /></AdminRoute>}
        />
        <Route path="/admin/students"
          element={<AdminRoute><TpoStudents /></AdminRoute>} />

        {/* ───────── TPO Sub Pages ───────── */}

        <Route
          path="/admin/students"
          element={<AdminRoute><UploadStudents /></AdminRoute>}
        />

        {/* ⭐ Company Management Page */}
        <Route
          path="/admin/companies"
          element={<AdminRoute><TpoCompanies /></AdminRoute>}
        />

        {/* ⭐ TPO Company Details */}
        <Route
          path="/admin/companies/:id"
          element={<AdminRoute><TpoCompanyDetails /></AdminRoute>}
        />

         <Route path="/admin/about"
          element={<AdminRoute><TpoAbout /></AdminRoute>} />

        

        <Route
          path="/admin/placed"
          element={<AdminRoute><TpoDashboard /></AdminRoute>}
        />


        {/* ───────── Fallback ───────── */}

        <Route path="*" element={<Navigate to="/" replace />} />

        <Route
path="/announcements"
element={<ProtectedRoute><Announcements/></ProtectedRoute>}
/>

<Route
path="/admin/announcements"
element={<AdminRoute><TpoAnnouncements/></AdminRoute>}
/>

      </Routes>

    </Router>

  );
}

export default App;