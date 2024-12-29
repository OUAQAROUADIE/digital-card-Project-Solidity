import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Users,
  UserPlus,
  Settings,
  FileText,
  Shield,
  Trash2,
  Edit,
  Upload,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Web3Provider } from '@ethersproject/providers';
import AddStudentPage from '../components/Student/AddStudentPage';
import UpdateStudentPage from '../components/Student/UpdateStudentPage';
import AddAttestationPage from '../components/Student/AddAttestationPage'

const AdminDashboard = () => {
  const [provider, setProvider] = useState(null);
  const [contracts, setContracts] = useState({
    roleManager: null,
    studentManagement: null
  });
  const [activeSection, setActiveSection] = useState('students');
  const [activeView, setActiveView] = useState('list');
  const [adminForm, setAdminForm] = useState({ address: '' });
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminStatus, setAdminStatus] = useState('');

  // Addresses de vos contrats déployés
  const CONTRACT_ADDRESSES = {
    ROLE_MANAGER: '',
    STUDENT_MANAGEMENT: ''
  };

  // ABIs des contrats (à remplacer par vos ABIs réels)
  const ROLE_MANAGER_ABI = [  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "AdminAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "AdminRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "UserAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_admin",
        "type": "address"
      }
    ],
    "name": "addAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "addUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "isUser",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_admin",
        "type": "address"
      }
    ],
    "name": "removeAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  } ];
  const STUDENT_MANAGEMENT_ABI = [ {
    "inputs": [
      {
        "internalType": "address",
        "name": "_roleManagerAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "nom",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "prenom",
        "type": "string"
      }
    ],
    "name": "StudentAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "StudentDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "nom",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "prenom",
        "type": "string"
      }
    ],
    "name": "StudentUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_nom",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_prenom",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_dateDeNaissance",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_codeMassar",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_photo",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_statutAcademique",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_experiencesProfessionnelles",
        "type": "string"
      }
    ],
    "name": "addStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "deleteStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllStudents",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "nom",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "prenom",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "dateDeNaissance",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "codeMassar",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "photo",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "statutAcademique",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "experiencesProfessionnelles",
            "type": "string"
          }
        ],
        "internalType": "struct StudentManagement.Student[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getStudent",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "nom",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "prenom",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "dateDeNaissance",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "codeMassar",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "photo",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "statutAcademique",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "experiencesProfessionnelles",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "stageAttestationHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "schoolAttestationHash",
            "type": "string"
          }
        ],
        "internalType": "struct StudentManagement.Student",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "studentCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "studentIds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_nom",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_prenom",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_statutAcademique",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_experiencesProfessionnelles",
        "type": "string"
      }
    ],
    "name": "updateStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }];


  useEffect(() => {
    const connectBlockchain = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new Web3Provider(window.ethereum);

          await ethProvider.send("eth_requestAccounts", []);
          
          const signer = ethProvider.getSigner();
          setProvider(ethProvider);

          const roleManagerContract = new ethers.Contract(
            CONTRACT_ADDRESSES.ROLE_MANAGER, 
            ROLE_MANAGER_ABI, 
            signer
          );

          const studentManagementContract = new ethers.Contract(
            CONTRACT_ADDRESSES.STUDENT_MANAGEMENT, 
            STUDENT_MANAGEMENT_ABI, 
            signer
          );

          setContracts({
            roleManager: roleManagerContract,
            studentManagement: studentManagementContract
          });

          // Charger les étudiants
        } catch (error) {
          console.error("Erreur de connexion blockchain:", error);
          alert('Échec de la connexion à la blockchain');
        }
      } else {
        alert('Veuillez installer MetaMask');
      }
    };

    connectBlockchain();
  }, []);

  const fetchStudents = async (contract) => {
    try {
      setIsLoading(true);
      if (contract) {
        const fetchedStudents = await contract.getAllStudents();
        console.log(fetchedStudents);  // Log the raw data

        const formattedStudents = fetchedStudents.map(student => ({
          id: student.id.toString(),
          nom: student.nom,
          prenom: student.prenom,
          dateDeNaissance: student.dateDeNaissance,
          codeMassar: student.codeMassar,
          photo: student.photo,
          statutAcademique: student.statutAcademique,
          experiencesProfessionnelles: student.experiencesProfessionnelles,
          
        }));

        setStudents(formattedStudents);
      }
    } catch (error) {
      console.error("Erreur de récupération des étudiants:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddAdmin = async () => {
    const { address } = adminForm;
  
    try {
      const _tx = await contracts.roleManager.addAdmin(address);
      const tx = await _tx.getTransaction();
  
      const receipt = await tx.wait();
      setAdminStatus(`Admin added successfully: ${address}`);
      alert(`Admin ajouté avec succès: ${address}`); // Alerte après l'ajout
    } catch (error) {
      setAdminStatus(`Error adding admin: ${error.message}`);
      alert(`Erreur lors de l'ajout de l'admin: ${error.message}`); // Alerte en cas d'erreur
    }
  };
  
  const handleAdminAddressChange = (e) => {
    setAdminForm({ ...adminForm, address: e.target.value });
  };
  useEffect(() => {
    if (contracts.studentManagement) {
      fetchStudents(contracts.studentManagement);

      // Set up event listeners for contract events
      contracts.studentManagement.on("StudentAdded", (id, nom, prenom) => {
        console.log("New student added:", id, nom, prenom);
        fetchStudents(contracts.studentManagement);
      });

      contracts.studentManagement.on("StudentUpdated", (id, nom, prenom) => {
        console.log("Student updated:", id, nom, prenom);
        fetchStudents(contracts.studentManagement);
      });

      contracts.studentManagement.on("StudentDeleted", (id) => {
        console.log("Student deleted:", id);
        fetchStudents(contracts.studentManagement);
      });

      // Cleanup function to remove event listeners
      return () => {
        contracts.studentManagement.removeAllListeners("StudentAdded");
        contracts.studentManagement.removeAllListeners("StudentUpdated");
        contracts.studentManagement.removeAllListeners("StudentDeleted");
      };
    }
  }, [contracts.studentManagement]);
  const SidebarLink = ({ icon: Icon, text, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{text}</span>
    </button>
  );

  const renderStudentsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code Massar</th>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {students.map((student, index) => (
      <tr key={index} className="hover:bg-gray-50">
        <td className="px-4 py-4 text-sm text-lefttext-gray-900 text-left">{student.id}</td> {/* Aligné à droite */}
        <td className="px-4 py-1 text-sm text-left text-gray-900 ">{student.nom}</td>
        <td className="px-4 py-4 text-sm text-left text-gray-900">{student.prenom}</td>
        <td className="px-4 py-4 text-sm text-left text-gray-900">{student.codeMassar}</td>
        <td className="px-4 py-4 text-sm text-left font-medium space-x-2">
          <button
            onClick={() => {
              setSelectedStudent(student);
              setActiveView('update');
            }}
            className="text-blue-600 hover:text-blue-900"
          >
            <Edit size={16} />
          </button>
          
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      </div>
    );
  };

  const renderSection = () => {
    const content = {
      students: {
        list: (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Étudiants</h2>
              <button
                onClick={() => setActiveView('add')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Ajouter Étudiant
              </button>
            </div>
            {renderStudentsList()}
          </div>
        ),
        add: <AddStudentPage />,
        update: <UpdateStudentPage initialStudent={selectedStudent} />
      },
      admins: (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Admins</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Adresse Utilisateur</label>
                <input
                  type="text"
                  value={adminForm.address}
                  onChange={(e) => setAdminForm({ ...adminForm, address: e.target.value })}
                  placeholder="0x..."
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
  type="button"
  onClick={handleAddAdmin}  // Call the handleAddAdmin function
  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
  <UserPlus className="w-5 h-5 mr-2" />
  Ajouter Admin
</button>

            </form>
          </div>
        </div>
      ),
  attestations: <AddAttestationPage />,

      
    };
  
    
  

    return content[activeSection]?.[activeView] || content[activeSection] || null;
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    address: 'Non connecté',
    isConnected: false,
  });



  // Add handler for window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {  // lg breakpoint
        setIsMobileMenuOpen(false);
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side */}
            <div className="flex items-center">
              {/* Logo and Title */}
              <div className="flex items-center ">
                <span className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 text-white">
                  <Shield size={24} />
                </span>
                <h1 className="ml-3 text-xl font-bold text-gray-900">
                  Dashboard Administratif
                </h1>
              </div>
            </div>           
          </div>
        </div>

        {/* Mobile menu */}
       
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 flex flex-col p-4 space-y-4">
              <SidebarLink
                icon={Shield}
                text="Gestion Admins"
                isActive={activeSection === 'admins'}
                onClick={() => {
                  setActiveSection('admins');
                  setActiveView('list');
                }}
              />
              <SidebarLink
                icon={Users}
                text="Gestion Étudiants"
                isActive={activeSection === 'students'}
                onClick={() => {
                  setActiveSection('students');
                  setActiveView('list');
                }}
              />
              <SidebarLink
                icon={FileText}
                text="Gestion Attestations"
                isActive={activeSection === 'attestations'}
                onClick={() => {
                  setActiveSection('attestations');
                  setActiveView('list');
                }}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;