const hre = require("hardhat");

async function main() {
    // Définir l'adresse du contrat RoleManager directement
    const roleManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Adresse définie directement dans le script

    // Déployer le contrat StudentManagement en passant l'adresse du RoleManager
    const StudentManagement = await hre.ethers.getContractFactory("StudentManagement");
    const studentManagement = await StudentManagement.deploy(roleManagerAddress);

    // Attendre que le contrat soit déployé
    await studentManagement.waitForDeployment();

    console.log("StudentManagement déployé à l'adresse:", studentManagement.target);
}

// Gérer les erreurs et exécuter la fonction principale
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
