import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { 
  User, 
  Calendar, 
  FileText, 
  Camera, 
  Briefcase, 
  Award, 
  Upload 
} from 'lucide-react';
import AddAttestationPage from './AddAttestationPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddStudentPage() {
  // États existants
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const web3Provider = new Web3Provider(window.ethereum);
        await web3Provider.send('eth_requestAccounts', []);
        const signer = web3Provider.getSigner();
        setProvider(web3Provider);

        const studentManagementAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
        const studentManagementABI = [
          "function addStudent(uint256 _id, string memory _nom, string memory _prenom, string memory _dateDeNaissance, string memory _codeMassar, string memory _photo, string memory _statutAcademique, string memory _experiencesProfessionnelles) public",
        ];

        const contract = new ethers.Contract(studentManagementAddress, studentManagementABI, signer);
        setContract(contract);
      } else {
        alert('Please install MetaMask.');
      }
    };

    connectWallet();
  }, []);

  const addStudent = async () => {
    if (!studentId || !nom || !prenom || !dateDeNaissance || !codeMassar || !photo || !statutAcademique || !experiencesProfessionnelles) {
      alert('Veuillez remplir tous les champs');
      return;
    }
  
    if (contract) {
      try {
        setIsSubmitting(true);
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
  
        const receipt = await tx.wait();
  
        if (receipt.status === 1) {
          console.log('Transaction successful');
          alert('Étudiant ajouté avec succès');
        } else {
          console.error('Transaction failed', receipt);
          alert('Échec de l\'ajout de l\'étudiant');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
        alert(`Erreur: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white">
            <h2 className="card-title mb-0 d-flex align-items-center">
              <Award className="me-3" size={32} />
              Inscription Nouvel Étudiant
            </h2>
          </div>
          
          <div className="card-body p-5">
            <form>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    <User className="me-2 text-primary" size={20} />
                    Identifiant Étudiant
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="ID Étudiant" 
                    value={studentId} 
                    onChange={(e) => setStudentId(e.target.value)} 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    <FileText className="me-2 text-primary" size={20} />
                    Nom
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nom de famille" 
                    value={nom} 
                    onChange={(e) => setNom(e.target.value)} 
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    <FileText className="me-2 text-primary" size={20} />
                    Prénom
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Prénom" 
                    value={prenom} 
                    onChange={(e) => setPrenom(e.target.value)} 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    <Calendar className="me-2 text-primary" size={20} />
                    Date de Naissance
                  </label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dateDeNaissance} 
                    onChange={(e) => setDateDeNaissance(e.target.value)} 
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    <Award className="me-2 text-primary" size={20} />
                    Code Massar
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Code Massar" 
                    value={codeMassar} 
                    onChange={(e) => setCodeMassar(e.target.value)} 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    <Camera className="me-2 text-primary" size={20} />
                    Photo
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="URL de la photo" 
                    value={photo} 
                    onChange={(e) => setPhoto(e.target.value)} 
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    <Award className="me-2 text-primary" size={20} />
                    Statut Académique
                  </label>
                  <select 
                    className="form-select"
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
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    <Briefcase className="me-2 text-primary" size={20} />
                    Expériences Professionnelles
                  </label>
                  <textarea 
                    className="form-control" 
                    placeholder="Décrivez vos expériences professionnelles" 
                    value={experiencesProfessionnelles} 
                    onChange={(e) => setExperiencesProfessionnelles(e.target.value)} 
                  />
                </div>
              </div>

              <div className="text-center mt-4">
                <button 
                  onClick={addStudent} 
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg d-flex align-items-center justify-content-center mx-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="me-2" size={20} />
                      Ajouter l'Étudiant
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {studentId && (
          <div className="mt-5">
            <AddAttestationPage studentId={studentId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AddStudentPage;