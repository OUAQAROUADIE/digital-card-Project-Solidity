// UpdateStudentPage.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers'; // Corrected import


function UpdateStudentPage() {
  const [studentId, setStudentId] = useState('');
  const [statutAcademique, setStatutAcademique] = useState('');
  const [experiencesProfessionnelles, setExperiencesProfessionnelles] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const web3Provider = new Web3Provider(window.ethereum); // Using Web3Provider directly
        await web3Provider.send("eth_requestAccounts", []);
        const signer = web3Provider.getSigner();
        setProvider(web3Provider);

        const studentManagementAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const studentManagementABI = [
          "function addStudent(uint256 _id, string memory _nom, string memory _prenom, string memory _dateDeNaissance, string memory _codeMassar, string memory _photo, string memory _statutAcademique, string memory _experiencesProfessionnelles) public",
          "function updateStudent(uint256 _id, string memory _statutAcademique, string memory _experiencesProfessionnelles) public",
          "function getStudent(uint256 _id) public view returns (tuple(uint256 id, string nom, string prenom, string dateDeNaissance, string codeMassar, string photo, string statutAcademique, string experiencesProfessionnelles))"
        ];

        const contract = new ethers.Contract(studentManagementAddress, studentManagementABI, signer);
        setContract(contract);
      } else {
        alert("Please install MetaMask.");
      }
    };

    connectWallet();
  }, []);

  const updateStudent = async () => {
    if (contract) {
      try {
        const tx = await contract.updateStudent(studentId, statutAcademique, experiencesProfessionnelles);
        await tx.wait();
        alert("Student updated successfully");
      } catch (error) {
        console.error(error);
        alert("Error updating student");
      }
    }
  };

  return (
    <div className="page-container">
      <h2>Update Student Information</h2>
      <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
      <input type="text" placeholder="Academic Status" value={statutAcademique} onChange={(e) => setStatutAcademique(e.target.value)} />
      <input type="text" placeholder="Professional Experience" value={experiencesProfessionnelles} onChange={(e) => setExperiencesProfessionnelles(e.target.value)} />
      <button onClick={updateStudent}>Update Student</button>
    </div>
  );
}

export default UpdateStudentPage;
