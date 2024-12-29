import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  Shield, 
  Wallet,
  ArrowRight,
  Search
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';  // Importer ethers.js pour interagir avec la blockchain
import { Web3Provider } from '@ethersproject/providers';

function LandingPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleManager, setRoleManager] = useState(null);

  // ABI et adresses des contrats
  const roleManagerAddress = '';
  const roleManagerABI = [
    {
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
      }

  ];

  // Connexion au wallet MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Demander l'accès au compte
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setWalletConnected(true);

        // Connexion à Ethereum avec ethers.js
        const provider = new  Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Initialiser le contrat RoleManager
        const roleManagerContract = new ethers.Contract(roleManagerAddress, roleManagerABI, signer);
        setRoleManager(roleManagerContract);

        // Vérifier si l'utilisateur est un admin
        const isAdmin = await roleManagerContract.isAdmin(accounts[0]);
        setIsAdmin(isAdmin);

        // Écouter les changements de réseau et de compte
        window.ethereum.on('chainChanged', () => window.location.reload());
        window.ethereum.on('accountsChanged', (accounts) => setAccount(accounts[0]));

      } catch (error) {
        console.error("Erreur de connexion au wallet", error);
        alert("Échec de la connexion du portefeuille. Assurez-vous que MetaMask est installé et déverrouillé.");
      }
    } else {
      alert("Veuillez installer MetaMask pour continuer");
    }
  };

  return (
    <div className="landing-page">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Logo_inpt.PNG/640px-Logo_inpt.PNG" 
              alt="INPT Logo" 
              style={{maxHeight: '50px'}} 
              className="me-3"
            />
            <span className="fw-bold text-primary">INPT Blockchain Student Manager</span>
          </a>
          <div className="nav-buttons">
            <button 
              onClick={connectWallet} 
              className={`btn ${walletConnected ? 'btn-success' : 'btn-primary'} d-flex align-items-center`}
            >
              <Wallet className="me-2" size={20} />
              {walletConnected 
                ? `Connecté: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` 
                : 'Connecter Wallet'}
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 pe-lg-5">
            <div className="hero-content">
              <h1 className="display-4 fw-bold text-primary mb-4">
                Gestion Sécurisée des Étudiants
              </h1>
              <p className="lead text-muted mb-4">
                Une plateforme décentralisée et sécurisée pour la gestion académique 
                et administrative des étudiants de l'Institut National des Postes 
                et Télécommunications, alimentée par la technologie blockchain.
              </p>
              <div className="features mb-5">
                <div className="feature-item mb-3 d-flex align-items-center">
                  <Shield className="text-primary me-3" size={32} />
                  <span>Authentification sécurisée via MetaMask</span>
                </div>
                <div className="feature-item mb-3 d-flex align-items-center">
                  <Users className="text-primary me-3" size={32} />
                  <span>Gestion transparente et immuable des données</span>
                </div>
                <div className="feature-item mb-3 d-flex align-items-center">
                  <GraduationCap className="text-primary me-3" size={32} />
                  <span>Traçabilité complète du parcours académique</span>
                </div>
                <div className="feature-item mb-3 d-flex align-items-center">
                  <FileText className="text-primary me-3" size={32} />
                  <span>Génération d'attestations certifiées</span>
                </div>
              </div>
              <div className="cta-buttons">
                {walletConnected ? (
                  isAdmin ? (
                    <a 
                      href="/dashboard" 
                      className="btn btn-primary btn-lg d-flex align-items-center"
                    >
                      Accéder au Tableau de Bord
                      <ArrowRight className="ms-2" size={20} />
                    </a>
                  ) : (
                    <div className="alert alert-danger" role="alert">
                      Vous n'êtes pas autorisé à accéder à ce tableau de bord. Seul l'admin peut y accéder.
                    </div>
                  )
                ) : (
                  <button 
                    onClick={connectWallet} 
                    className="btn btn-primary btn-lg d-flex align-items-center"
                  >
                    <Wallet className="me-2" size={20} />
                    Connecter Wallet pour Commencer
                  </button>
                )}
                <div className="col-12">
  <div className="border-top my-3 pt-3">
    <p className="text-muted mb-2">Accès Entreprises</p>
    {walletConnected ? (
      <a 
        href="/verify-student" 
        className="btn btn-success btn-lg d-flex align-items-center justify-content-center w-100"
      >
        <Search className="me-2" size={20} />
        Vérifier un Étudiant
      </a>
    ) : (
      <button 
        onClick={connectWallet} 
        className="btn btn-secondary btn-lg d-flex align-items-center justify-content-center w-100"
      >
        <Wallet className="me-2" size={20} />
        Connectez votre Wallet pour Accéder
      </button>
    )}
  </div>
</div>

              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className=" position-relative">
              <img 
                src="https://static.vecteezy.com/system/resources/previews/024/724/631/non_2x/a-happy-smiling-young-college-student-with-a-book-in-hand-isolated-on-a-transparent-background-generative-ai-free-png.png" 
                alt="Étudiant INPT" 
                className="img-fluid rounded shadow-lg"
                style={{
                  objectFit: 'cover',
                  maxHeight: '800px',
                  width: '100%'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Blockchain Explanation Section */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-4">
              <h2 className="display-6 fw-bold text-primary">
                Pourquoi la Blockchain ?
              </h2>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <Shield className="text-primary mb-3" size={48} />
                  <h5 className="card-title">Sécurisation Totale</h5>
                  <p className="card-text">
                    La blockchain garantit que les informations des étudiants sont immuables et inviolables.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <Users className="text-primary mb-3" size={48} />
                  <h5 className="card-title">Transparence</h5>
                  <p className="card-text">
                    Toutes les actions effectuées sur la plateforme sont transparentes et peuvent être vérifiées par tous les utilisateurs.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <FileText className="text-primary mb-3" size={48} />
                  <h5 className="card-title">Génération d'Attestations</h5>
                  <p className="card-text">
                    Les attestations d'études sont générées et certifiées de manière décentralisée.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
