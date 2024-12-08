import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentManagement from './components/StudentManagement';
import AddStudentPage from './components/Student/AddStudentPage';
import UpdateStudentPage from './components/Student/UpdateStudentPage';
import VerifyStudentPage from './components/Entreprise/VerifyStudentPage';
import StudentsList from './components/Student/StudentsList';




function App() {
  return (
    <Router>
    <div className="App">
      <h1>Student Management</h1>
      <Routes>
        <Route path="/add-student" element={<AddStudentPage />} />
        <Route path="/update-student" element={<UpdateStudentPage />} />
        <Route path="/verify-student" element={<VerifyStudentPage />} />
        <Route path="/all-student" element={<StudentsList />} />

        
      </Routes>
    </div>
  </Router>
  );
}

export default App;
