const hre = require("hardhat");

async function main() {
  // Récupérer le contrat à partir des artefacts
  const StudentManagement = await hre.ethers.getContractFactory("StudentManagement");

  // Déployer le contrat
  const studentManagement = await StudentManagement.deploy();

  await studentManagement.deployed();

  console.log("StudentManagement deployed to:", studentManagement.address);
}

// Gérer les erreurs et exécuter la fonction principale
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
