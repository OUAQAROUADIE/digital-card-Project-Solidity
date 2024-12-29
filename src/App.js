import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentManagement from './components/StudentManagement';
import AddStudentPage from './components/Student/AddStudentPage';
import UpdateStudentPage from './components/Student/UpdateStudentPage';
import VerifyStudentPage from './components/Entreprise/VerifyStudentPage';
import StudentsList from './components/Student/StudentsList';
import Acceuil from './pages/acceuil'
import Dashboard from './pages/Dashboard'
import AddAttestationPage from './components/Student/AddAttestationPage';




function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/"  element={<Acceuil />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-student" element={<AddStudentPage />} />
        <Route path="/update-student" element={<UpdateStudentPage />} />
        <Route path="/verify-student" element={<VerifyStudentPage />} />
        <Route path="/all-student" element={<StudentsList />} />
        <Route path="/add-attestation" element={<AddAttestationPage />} />


        
      </Routes>
    </div>
  </Router>
  );
}

export default App;
