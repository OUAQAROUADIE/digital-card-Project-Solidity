// UpdateStudentPage.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { Save, UserCog } from 'lucide-react';


function UpdateStudentPage({ initialStudent }) {
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    prenom: '',
    statutAcademique: '',
    experiencesProfessionnelles: '',
  });
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [statutAcademique, setStatutAcademique] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (initialStudent) {
      setFormData({
        id: initialStudent.id,
        nom: initialStudent.nom,
        prenom: initialStudent.prenom,
        statutAcademique: initialStudent.statutAcademique,
        experiencesProfessionnelles: initialStudent.experiencesProfessionnelles,
      });
    }
  }, [initialStudent]);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const web3Provider = new Web3Provider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const signer = web3Provider.getSigner();
        setProvider(web3Provider);

        const studentManagementAddress = "";
        const studentManagementABI = [
          "function updateStudent(uint256 _id, string memory _nom, string memory _prenom, string memory _statutAcademique, string memory _experiencesProfessionnelles) public",
          "function getStudent(uint256 _id) public view returns (tuple(uint256 id, string nom, string prenom, string dateDeNaissance, string codeMassar, string photo, string statutAcademique, string experiencesProfessionnelles, string stageAttestationHash, string schoolAttestationHash))"
        ];

        const contract = new ethers.Contract(studentManagementAddress, studentManagementABI, signer);
        setContract(contract);
      } else {
        alert("Please install MetaMask.");
      }
    };

    connectWallet();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateStudent = async (e) => {
    e.preventDefault();
    if (!contract) return;
    setIsSubmitting(true);
    try {
      const _tx = await contract.updateStudent(
        formData.id,
        formData.nom,
        formData.prenom,
        formData.statutAcademique,
        formData.experiencesProfessionnelles
      );
      const tx = await _tx.getTransaction();
  
      const receipt = await tx.wait();
      alert("Student updated successfully", receipt);
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Error updating student");
    }finally{
            setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
    <div className="card shadow-lg border-0">
      <div className="card-header bg-primary bg-gradient text-white py-3">
        <div className="d-flex align-items-center">
          <UserCog size={24} className="me-2" />
          <h3 className="mb-0">Update Student Information</h3>
        </div>
      </div>
      <div className="card-body p-4 bg-light">
        <form onSubmit={updateStudent} className="row g-4">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label fw-bold text-secondary">
                Student ID
              </label>
              <input
                type="text"
                className="form-control form-control-lg bg-white"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label fw-bold text-secondary">
                Nom
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Entrer le nom"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label fw-bold text-secondary">
                Prénom
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                placeholder="Entrer le prénom"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label fw-bold text-secondary">
                Statut Académique
              </label>
              <select 
                className="form-select form-select-lg"
                value={statutAcademique}
                onChange={(e) => setStatutAcademique(e.target.value)}
              >
                <option value="">Sélectionner le statut</option>
                <option value="Première année">Première année</option>
                <option value="Deuxième année">Deuxième année</option>
                <option value="Troisième année">Troisième année</option>
                <option value="Diplômé">Diplômé</option>
              </select>
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
              <label className="form-label fw-bold text-secondary">
                Expériences Professionnelles
              </label>
              <textarea
                className="form-control"
                name="experiencesProfessionnelles"
                value={formData.experiencesProfessionnelles}
                onChange={handleInputChange}
                rows="5"
                placeholder="Décrivez les expériences professionnelles..."
                style={{ resize: 'vertical', minHeight: '120px' }}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex justify-content-end mt-4">
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-lg me-2"
                onClick={() => window.history.back()}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg px-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save size={20} className="me-2" />
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <style jsx>{`
      .card {
        border-radius: 12px;
        overflow: hidden;
      }
      
      .form-control, .form-select {
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 0.75rem 1rem;
        transition: all 0.2s ease-in-out;
      }
      
      .form-control:focus, .form-select:focus {
        border-color: #86b7fe;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
      }
      
      .form-control:disabled {
        background-color: #f8f9fa;
        opacity: 0.8;
      }
      
      .btn {
        border-radius: 8px;
        padding: 0.75rem 1.5rem;
        font-weight: 500;
        transition: all 0.2s ease-in-out;
      }
      
      .btn-primary {
        background: linear-gradient(45deg, #0d6efd, #0b5ed7);
        border: none;
      }
      
      .btn-primary:hover {
        background: linear-gradient(45deg, #0b5ed7, #0a58ca);
        transform: translateY(-1px);
      }
      
      .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
      
      .card-header {
        border-bottom: 1px solid rgba(0,0,0,0.125);
      }
      
      .form-label {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    `}</style>
  </div>
);
}

export default UpdateStudentPage;