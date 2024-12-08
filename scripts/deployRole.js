const hre = require("hardhat");

async function main() {
    // Récupération du contrat compilé
    const RoleManager = await hre.ethers.getContractFactory("RoleManager");

    // Déploiement du contrat
    const roleManager = await RoleManager.deploy();

    console.log("Contract deploying...");

    // Attendre que le contrat soit déployé
    await roleManager.waitForDeployment();

    // Affichage de l'adresse du contrat déployé
    console.log("StudentManagement deployed to:", roleManager.target);
}

// Gérer les erreurs et exécuter la fonction principale
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
