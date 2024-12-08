import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers'; // Corrected import

function StudentManagement() {
  const [student, setStudent] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [codeMassar, setCodeMassar] = useState('');
  const [photo, setPhoto] = useState('');
  const [statutAcademique, setStatutAcademique] = useState('');
  const [experiencesProfessionnelles, setExperiencesProfessionnelles] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const web3Provider = new Web3Provider(window.ethereum); // Using Web3Provider directly
        await web3Provider.send("eth_requestAccounts", []); // Request connection to MetaMask
        const signer = web3Provider.getSigner(); // Retrieve the signer
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
        alert("Veuillez installer MetaMask.");
      }
    };

    connectWallet();
  }, []);

  const addStudent = async () => {
    if (contract) {
      try {
        const tx = await contract.addStudent(
          studentId,
          nom,
          prenom,
          dateDeNaissance,
          codeMassar,
          photo,
          statutAcademique,
          experiencesProfessionnelles
        );
        await tx.wait(); // Wait for the transaction to be mined
        alert("Étudiant ajouté avec succès");
      } catch (error) {
        console.error(error);
        alert("Erreur lors de l'ajout de l'étudiant.");
      }
    }
  };

  const updateStudent = async () => {
    if (contract) {
      try {
        const tx = await contract.updateStudent(
          studentId,
          statutAcademique,
          experiencesProfessionnelles
        );
        await tx.wait(); // Wait for the transaction to be mined
        alert("Informations mises à jour avec succès");
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la mise à jour de l'étudiant.");
      }
    }
  };

  const getStudent = async () => {
    if (contract) {
      const studentData = await contract.getStudent(studentId);
      setStudent(studentData);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Gestion des étudiants</h2>

      {/* Section for Add and Update Student */}
      <div style={styles.section}>
        <h3>Ajouter ou Mettre à jour un étudiant</h3>
        <div style={styles.form}>
          <input type="text" placeholder="ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
          <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          <input type="text" placeholder="Date de Naissance" value={dateDeNaissance} onChange={(e) => setDateDeNaissance(e.target.value)} />
          <input type="text" placeholder="Code Massar" value={codeMassar} onChange={(e) => setCodeMassar(e.target.value)} />
          <input type="text" placeholder="Photo" value={photo} onChange={(e) => setPhoto(e.target.value)} />
          <input type="text" placeholder="Statut académique" value={statutAcademique} onChange={(e) => setStatutAcademique(e.target.value)} />
          <input type="text" placeholder="Expériences professionnelles" value={experiencesProfessionnelles} onChange={(e) => setExperiencesProfessionnelles(e.target.value)} />
        </div>
        <div>
          <button style={styles.button} onClick={addStudent}>Ajouter l'étudiant</button>
          <button style={styles.button} onClick={updateStudent}>Mettre à jour</button>
        </div>
      </div>

      {/* Section for Get and Verify Student */}
      <div style={styles.section}>
        <h3>Vérifier les informations de l'étudiant</h3>
        <div style={styles.form}>
          <input type="text" placeholder="ID de l'étudiant" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        </div>
        <button style={styles.button} onClick={getStudent}>Obtenir l'étudiant</button>

        {student && (
          <div style={styles.studentDetails}>
            <h4>Informations de l'étudiant:</h4>
            <p>ID: {student.id}</p>
            <p>Nom: {student.nom}</p>
            <p>Prénom: {student.prenom}</p>
            <p>Date de naissance: {student.dateDeNaissance}</p>
            <p>Code Massar: {student.codeMassar}</p>
            <p>Photo: {student.photo}</p>
            <p>Statut académique: {student.statutAcademique}</p>
            <p>Expériences professionnelles: {student.experiencesProfessionnelles}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Basic styling for the page
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '15px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  studentDetails: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e9f7e9',
    borderRadius: '5px',
  }
};

export default StudentManagement;
