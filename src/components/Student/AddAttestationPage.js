import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Upload, File } from 'lucide-react';
import { Web3Provider } from '@ethersproject/providers';

const PINATA_API_KEY = '';
const PINATA_API_SECRET = '';

const uploadToPinata = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  try {
    const response = await axios.post(pinataUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_API_SECRET,
      },
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error("Erreur Pinata:", error);
    throw error;
  }
};

function AddAttestationPage() {
  const [file, setFile] = useState(null);
  const [attestationType, setAttestationType] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contract, setContract] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        const web3Provider = new Web3Provider(window.ethereum);
        await web3Provider.send('eth_requestAccounts', []);
        const signer = web3Provider.getSigner();

        const contractABI = [
          "function addStageAttestation(uint256 _id, string memory _ipfsHash) public",
          "function addSchoolAttestation(uint256 _id, string memory _ipfsHash) public",
          "function studentExists(uint256 _id) public view returns (bool)"
        ];

        const contractAddress = "";
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
      }
    };

    initContract();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!file || !attestationType || !studentId) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    try {
      // Vérifier si l'étudiant existe
      const exists = await contract.studentExists(studentId);
      if (!exists) {
        throw new Error("L'étudiant n'existe pas");
      }

      const ipfsHash = await uploadToPinata(file);
      let _tx;
      
      if (attestationType === 'stage') {
        _tx = await contract.addStageAttestation(studentId, ipfsHash);
      } else {
        _tx = await contract.addSchoolAttestation(studentId, ipfsHash);
      }

      const tx = await _tx.getTransaction();
  
      const receipt = await tx.wait();
            alert('Attestation ajoutée avec succès');
      setFile(null);
      setAttestationType('');
      setStudentId('');
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-header bg-primary text-white">
        <h3 className="card-title mb-0">
          <File className="me-2" size={24} />
          Ajouter une Attestation
        </h3>
      </div>
      
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ID de l'Étudiant</label>
            <input
              type="number"
              className="form-control"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              placeholder="Entrer l'ID de l'étudiant"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Type d'Attestation</label>
            <select 
              className="form-select"
              value={attestationType}
              onChange={(e) => setAttestationType(e.target.value)}
              required
            >
              <option value="">Sélectionner le type</option>
              <option value="stage">Attestation de Stage</option>
              <option value="school">Attestation Scolaire</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Fichier d'Attestation</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          {errorMessage && (
            <div className="alert alert-danger mb-4">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="spinner-border spinner-border-sm me-2" role="status" />
            ) : (
              <>
                <Upload className="me-2" size={20} />
                Sauvegarder l'Attestation
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAttestationPage;