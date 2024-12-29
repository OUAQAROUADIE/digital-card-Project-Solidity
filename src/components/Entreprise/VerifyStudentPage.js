import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { User, Calendar, FileText, Award, Briefcase, QrCode, Search, Shield, ChevronDown, ChevronUp } from 'lucide-react';

const VerifyStudentPage = () => {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(null);
  const [stageAttestations, setStageAttestations] = useState([]);
  const [schoolAttestations, setSchoolAttestations] = useState([]);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);


  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const web3Provider = new Web3Provider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const signer = web3Provider.getSigner();
        setProvider(web3Provider);

        const studentManagementAddress = "0xCD8a1C3ba11CF5ECfa6267617243239504a98d90";
        const studentManagementABI = [
          "function getStudent(uint256 _id) public view returns (tuple(uint256 id, string nom, string prenom, string dateDeNaissance, string codeMassar, string photo, string statutAcademique, string experiencesProfessionnelles))",
          "function getStageAttestations(uint256 _id) public view returns (string[] memory)",
          "function getSchoolAttestations(uint256 _id) public view returns (string[] memory)"
        ];

        const contract = new ethers.Contract(studentManagementAddress, studentManagementABI, signer);
        setContract(contract);
      }
    };

    connectWallet();
  }, []);

  const getStudent = async () => {
    if (!contract || !studentId) return;
    
    setLoading(true);
    try {
      const studentData = await contract.getStudent(studentId);
      const [
        id, nom, prenom, dateDeNaissance, codeMassar, photo,
        statutAcademique, experiencesProfessionnelles
      ] = studentData;

      // Appel pour récupérer les attestations
      const stageAttestationsList = await contract.getStageAttestations(studentId);
      const schoolAttestationsList = await contract.getSchoolAttestations(studentId);

      setStudent({
        id, nom, prenom, dateDeNaissance, codeMassar, photo,
        statutAcademique, experiencesProfessionnelles
      });
      setStageAttestations(stageAttestationsList);
      setSchoolAttestations(schoolAttestationsList);
      console.log(stageAttestations)

      console.log(studentId)
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la récupération des données");
    } finally {
      setLoading(false);
    }
  };
  const AttestationsSection = ({ title, attestations, type }) => {
    const isExpanded = expandedSection === type;
    return (
      <div className="border rounded-lg">
        <button
          onClick={() => setExpandedSection(isExpanded ? null : type)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium">{title}</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {attestations.length}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-4 border-t bg-gray-50">
            {attestations.length > 0 ? (
              <div className="space-y-2">
                {attestations.map((hash, index) => (
                  <DocumentLink
                    key={index}
                    label={`${title} ${index + 1}`}
                    hash={hash}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Aucune attestation disponible</p>
            )}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vérification des Étudiants</h1>
          <p className="text-gray-600">Système de vérification basé sur la blockchain</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="max-w-xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Entrez l'ID de l'étudiant"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <button
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                onClick={getStudent}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Vérifier
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Student Card */}
        {student && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Carte Professionnelle</h2>
                  <p className="text-blue-100">ID: {studentId}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <QrCode className="w-8 h-8 text-blue-800" />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Photo Section */}
                <div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg mb-4">
                    <img
                      src={student.photo || "/api/placeholder/300/400"}
                      alt="Photo de l'étudiant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Code Massar</p>
                    <p className="text-lg font-mono text-gray-900">{student.codeMassar}</p>

                  </div>
                </div>

                {/* Details Section */}
                <div className="md:col-span-2 space-y-6">
                  <div className="grid gap-6">
                    <DetailItem icon={<User />} label="Nom Complet">
                      <span className="text-xl font-semibold">{`${student.nom} ${student.prenom}`}</span>
                    </DetailItem>

                    <DetailItem icon={<Calendar />} label="Date de Naissance">
                      {student.dateDeNaissance}
                    </DetailItem>

                    <DetailItem icon={<Award />} label="Statut Académique">
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {student.statutAcademique}
                      </span>
                    </DetailItem>

                    <DetailItem icon={<Briefcase />} label="Expérience Professionnelle">
                      <p className="text-gray-700">{student.experiencesProfessionnelles}</p>
                    </DetailItem>
                  </div>

                  {/* Documents Section */}
                  <div className="p-6 border-t">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Documents Officiels</h3>
            <div className="space-y-4">
              <AttestationsSection
                title="Attestations de Stage"
                attestations={stageAttestations}
                type="stage"
              />
              <AttestationsSection
                title="Attestations Scolaires"
                attestations={schoolAttestations}
                type="school"
              />
            </div>
          </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, children }) => (
  <div className="flex gap-3">
    <div className="flex-shrink-0 w-6 h-6 text-blue-600">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  </div>
);

const DocumentLink = ({ label, hash }) => (
  <a
    href={`https://gateway.pinata.cloud/ipfs/${hash}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
  >
    <FileText className="w-5 h-5 text-blue-600" />
    <span className="font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
  </a>
);

export default VerifyStudentPage;
