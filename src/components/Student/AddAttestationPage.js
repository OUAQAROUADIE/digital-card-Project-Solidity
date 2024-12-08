import React, { useState,useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { uploadToIPFS } from './ipfs'; // Assurez-vous d'avoir cette fonction d'upload

function AddAttestationPage({ studentId }) {
  // States pour les attestations
  const [attestationType, setAttestationType] = useState('');
  const [file, setFile] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const web3Provider = new Web3Provider(window.ethereum);
        await web3Provider.send('eth_requestAccounts', []); // Demande de connexion MetaMask
        const signer = web3Provider.getSigner();
        setProvider(web3Provider);

        const studentManagementAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // L'adresse de votre contrat
        const studentManagementABI = [
          "function addStageAttestation(uint256 _id, string memory ipfsHash) public",
          "function addSchoolAttestation(uint256 _id, string memory ipfsHash) public",
        ];

        const contract = new ethers.Contract(studentManagementAddress, studentManagementABI, signer);
        setContract(contract);
      } else {
        alert('Please install MetaMask.');
      }
    };

    connectWallet();
  }, []);

  const addAttestation = async () => {
    if (!file || !attestationType || !studentId) {
      alert('Please fill all fields and upload a file.');
      return;
    }

    try {
      const ipfsHash = await uploadToIPFS(file);
      console.log('File uploaded to IPFS:', ipfsHash);

      let tx;
      if (attestationType === 'stage') {
        tx = await contract.addStageAttestation(studentId, ipfsHash);
      } else if (attestationType === 'school') {
        tx = await contract.addSchoolAttestation(studentId, ipfsHash);
      } else {
        alert('Invalid attestation type');
        return;
      }

      await tx.wait();
      alert('Attestation added successfully!');
    } catch (error) {
      console.error('Error adding attestation:', error);
      alert('Failed to add attestation.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Attestation</h2>
      <div className="mb-3">
        <select className="form-select" value={attestationType} onChange={(e) => setAttestationType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="stage">Stage</option>
          <option value="school">School</option>
        </select>
      </div>
      <div className="mb-3">
        <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button className="btn btn-success" onClick={addAttestation}>Upload and Save Attestation</button>
    </div>
  );
}

export default AddAttestationPage;
