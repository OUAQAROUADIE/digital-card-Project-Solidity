import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { create } from 'ipfs-http-client';

const ipfs = create({
  host: 'api.pinata.cloud',
  port: 5001,
  protocol: 'https',
  headers: {
    pinata_api_key: '',
    pinata_secret_api_key: ''
  }
});

function UpdateAttestationsPage({ studentId }) {
  const [contract, setContract] = useState(null);
  const [stageFile, setStageFile] = useState(null);
  const [schoolFile, setSchoolFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const web3Provider = new Web3Provider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const signer = web3Provider.getSigner();

        const studentManagementAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
        const studentManagementABI = [
          "function updateStudentAttestations(uint256 _id, string memory _stageAttestationHash, string memory _schoolAttestationHash) public"
        ];

        const contract = new ethers.Contract(studentManagementAddress, studentManagementABI, signer);
        setContract(contract);
      } else {
        alert("Please install MetaMask.");
      }
    };

    connectWallet();
  }, []);

  const uploadToIPFS = async (file) => {
    try {
      const added = await ipfs.add(file);
      return added.path;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'stage') {
      setStageFile(file);
    } else {
      setSchoolFile(file);
    }
  };

  const updateAttestations = async (e) => {
    e.preventDefault();
    if (!contract || !studentId) return;

    setLoading(true);
    try {
      let stageHash = '';
      let schoolHash = '';

      if (stageFile) {
        stageHash = await uploadToIPFS(stageFile);
      }
      if (schoolFile) {
        schoolHash = await uploadToIPFS(schoolFile);
      }

      const tx = await contract.updateStudentAttestations(
        studentId,
        stageHash,
        schoolHash
      );
      await tx.wait();
      alert("Attestations updated successfully");
    } catch (error) {
      console.error("Error updating attestations:", error);
      alert("Error updating attestations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h3>Update Student Attestations</h3>
      </div>
      <div className="card-body">
        <form onSubmit={updateAttestations}>
          <div className="mb-3">
            <label className="form-label">Stage Attestation</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => handleFileChange(e, 'stage')}
              accept=".pdf,.doc,.docx"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">School Attestation</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => handleFileChange(e, 'school')}
              accept=".pdf,.doc,.docx"
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Uploading...
              </span>
            ) : (
              'Update Attestations'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default  UpdateAttestationsPage ;