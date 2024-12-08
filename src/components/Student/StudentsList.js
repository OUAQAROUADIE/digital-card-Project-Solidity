
       
        import React, { useState, useEffect } from "react";
        import { ethers } from "ethers";
        import { Web3Provider } from '@ethersproject/providers';

        // Liste des étudiants
        const StudentsList = () => {
          const [students, setStudents] = useState([]);
          const [loading, setLoading] = useState(true);
          const [account, setAccount] = useState(null);
          const [contract, setContract] = useState(null);
        
          useEffect(() => {
            const initEthereum = async () => {
              if (window.ethereum) {
                // Créer un fournisseur Ethereum via MetaMask
                const provider = new Web3Provider(window.ethereum); // Using Web3Provider directly
                await provider.send("eth_requestAccounts", []); // Demander l'autorisation de MetaMask
                const signer = provider.getSigner();
                setAccount(await signer.getAddress()); // Récupérer l'adresse du portefeuille connecté
        
                // Adresse et ABI de votre contrat
                const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
               const contractABI = [
                  // Ajoutez ici l'ABI complète de votre contrat
                  "function getAllStudents() public view returns (tuple(uint256 id, string memory nom, string memory prenom, string memory dateDeNaissance, string memory codeMassar, string memory photo, string memory statutAcademique, string memory experiencesProfessionnelles)[] memory)"
                ];
        
                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                setContract(contract);
        
                // Charger les étudiants
                await fetchStudents(contract);
              } else {
                alert("Veuillez installer MetaMask.");
              }
            };
        
            // Fonction pour récupérer les étudiants depuis la blockchain
            const fetchStudents = async (contract) => {
              try {
                console.log("Récupération des étudiants...");
                const allStudents = await contract.getAllStudents(); // Appel de getAllStudents
                if (!allStudents || allStudents.length === 0) {
                  console.log("Aucun étudiant trouvé.");
                  setStudents([]);
                } else {
                  setStudents(allStudents); // Sauvegarder les étudiants récupérés
                }
              } catch (error) {
                console.error("Erreur lors de la récupération des étudiants :", error);
                alert("Erreur lors de la récupération des étudiants : " + error.message);
              } finally {
                setLoading(false); // Stopper le chargement
              }
            };
        
            initEthereum(); // Initialiser Ethereum et charger les étudiants
          }, []);
        
          return (
            <div>
              <h1>Liste des étudiants</h1>
              {loading ? (
                <p>Chargement des étudiants...</p> // Afficher un message de chargement
              ) : (
                <ul>
                  {students.map((student, index) => (
                    <li key={index}>
                      <h3>{student.nom} {student.prenom}</h3>
                      <p>Date de naissance: {student.dateDeNaissance}</p>
                      <p>Code Massar: {student.codeMassar}</p>
                      <p>Photo: <img src={student.photo} alt="Photo" width="100" /></p>
                      <p>Statut académique: {student.statutAcademique}</p>
                      <p>Expériences professionnelles: {student.experiencesProfessionnelles}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        };
        
        export default StudentsList;
        