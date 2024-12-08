import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { 
  User, 
  Calendar, 
  FileText, 
  Award, 
  Briefcase, 
  QrCode 
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

function VerifyStudentPage() {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(null);
  const [attestations, setAttestations] = useState({ stage: '', school: '' });
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const web3Provider = new Web3Provider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const signer = web3Provider.getSigner();
        setProvider(web3Provider);

        const studentManagementAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
        const studentManagementABI = [
          "function addStudent(uint256 _id, string memory _nom, string memory _prenom, string memory _dateDeNaissance, string memory _codeMassar, string memory _photo, string memory _statutAcademique, string memory _experiencesProfessionnelles) public",
          "function updateStudent(uint256 _id, string memory _statutAcademique, string memory _experiencesProfessionnelles) public",
          "function getStudent(uint256 _id) public view returns (tuple(uint256 id, string nom, string prenom, string dateDeNaissance, string codeMassar, string photo, string statutAcademique, string experiencesProfessionnelles))",
          "function getAttestations(uint256 _id) public view returns (string memory, string memory)"
        ];

        const contract = new ethers.Contract(studentManagementAddress, studentManagementABI, signer);
        setContract(contract);
      } else {
        alert("Please install MetaMask.");
      }
    };

    connectWallet();
  }, []);

  const getStudent = async () => {
    if (contract && studentId) {
      try {
        const studentData = await contract.getStudent(studentId);
        setStudent(studentData);
        
        const [stageAttestation, schoolAttestation] = await contract.getAttestations(studentId);
        setAttestations({
          stage: stageAttestation,
          school: schoolAttestation
        });
      } catch (error) {
        console.error(error);
        alert("Error fetching student data");
      }
    }
  };

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-primary text-white">
                <h2 className="text-center mb-0">Student Verification</h2>
              </div>
              <div className="card-body p-4">
                <div className="input-group mb-3">
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Enter Student ID" 
                    value={studentId} 
                    onChange={(e) => setStudentId(e.target.value)} 
                  />
                  <button 
                    className="btn btn-success" 
                    type="button" 
                    onClick={getStudent}
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>

            {student && (
              <div className="card professional-id-card shadow-lg">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">Professional Student ID</h3>
                  <QrCode size={30} />
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <div className="student-photo-container mb-3">
                        <img 
                          src={student.photo || '/api/placeholder/300/400'} 
                          alt="Student Profile" 
                          className="img-fluid rounded-lg shadow-sm"
                          style={{
                            maxWidth: '250px', 
                            maxHeight: '300px', 
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="professional-details">
                        <div className="detail-row d-flex align-items-center mb-2">
                          <User className="text-primary me-3" size={24} />
                          <div>
                            <small className="text-muted">Full Name</small>
                            <h5 className="mb-0">{student.nom} {student.prenom}</h5>
                          </div>
                        </div>

                        <div className="detail-row d-flex align-items-center mb-2">
                          <Calendar className="text-primary me-3" size={24} />
                          <div>
                            <small className="text-muted">Date of Birth</small>
                            <h5 className="mb-0">{student.dateDeNaissance}</h5>
                          </div>
                        </div>

                        <div className="detail-row d-flex align-items-center mb-2">
                          <FileText className="text-primary me-3" size={24} />
                          <div>
                            <small className="text-muted">Massar Code</small>
                            <h5 className="mb-0">{student.codeMassar}</h5>
                          </div>
                        </div>

                        <div className="detail-row d-flex align-items-center mb-2">
                          <Award className="text-primary me-3" size={24} />
                          <div>
                            <small className="text-muted">Academic Status</small>
                            <h5 className="mb-0">{student.statutAcademique}</h5>
                          </div>
                        </div>

                        <div className="detail-row d-flex align-items-center">
                          <Briefcase className="text-primary me-3" size={24} />
                          <div>
                            <small className="text-muted">Professional Experience</small>
                            <p className="mb-0">{student.experiencesProfessionnelles}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attestations Section */}
                <div className="card-footer bg-light">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="attestation-box">
                        <h6 className="text-muted">
                          <Award className="me-2" size={18} />
                          Stage Attestation
                        </h6>
                        <span className={`badge ${attestations.stage ? 'bg-success' : 'bg-warning'}`}>
                          {attestations.stage ? "Available" : "Not Available"}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="attestation-box">
                        <h6 className="text-muted">
                          <Award className="me-2" size={18} />
                          School Attestation
                        </h6>
                        <span className={`badge ${attestations.school ? 'bg-success' : 'bg-warning'}`}>
                          {attestations.school ? "Available" : "Not Available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyStudentPage;