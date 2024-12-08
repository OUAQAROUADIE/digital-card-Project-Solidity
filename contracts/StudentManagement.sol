// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RoleManager.sol";

contract StudentManagement {
    RoleManager private roleManager;

    struct Student {
        uint256 id;
        string nom;
        string prenom;
        string dateDeNaissance;
        string codeMassar;
        string photo;
        string statutAcademique;
        string experiencesProfessionnelles;
        string stageAttestationHash;
        string schoolAttestationHash;
    }

    mapping(uint256 => Student) private students;
    uint256 public studentCount;
    uint256[] public studentIds;

    event StudentAdded(uint256 id, string nom, string prenom);
    event StudentUpdated(uint256 id, string nom, string prenom);
    event StudentDeleted(uint256 id);

    modifier onlyAdmin() {
        require(roleManager.isAdmin(msg.sender), "Access denied: Only admins can perform this action.");
        _;
    }

    modifier onlyUser() {
        require(roleManager.isUser(msg.sender) || roleManager.isAdmin(msg.sender), "Access denied: Only users can view this information.");
        _;
    }

    constructor(address _roleManagerAddress) {
        roleManager = RoleManager(_roleManagerAddress);
    }

    // Ajouter un étudiant (Admin uniquement)
    function addStudent(
        uint256 _id,
        string memory _nom,
        string memory _prenom,
        string memory _dateDeNaissance,
        string memory _codeMassar,
        string memory _photo,
        string memory _statutAcademique,
        string memory _experiencesProfessionnelles
    ) public onlyAdmin {
        require(_id != 0, "Invalid student ID.");
        require(students[_id].id == 0, "Student already exists.");

        students[_id] = Student({
            id: _id,
            nom: _nom,
            prenom: _prenom,
            dateDeNaissance: _dateDeNaissance,
            codeMassar: _codeMassar,
            photo: _photo,
            statutAcademique: _statutAcademique,
            experiencesProfessionnelles: _experiencesProfessionnelles,
            stageAttestationHash: "",
            schoolAttestationHash: ""
        });

        studentIds.push(_id);
        studentCount++;
        emit StudentAdded(_id, _nom, _prenom);
    }

    // Mettre à jour un étudiant (Admin uniquement)
    function updateStudent(
        uint256 _id,
        string memory _nom,
        string memory _prenom,
        string memory _statutAcademique,
        string memory _experiencesProfessionnelles
    ) public onlyAdmin {
        require(students[_id].id != 0, "Student does not exist.");

        Student storage student = students[_id];
        student.nom = _nom;
        student.prenom = _prenom;
        student.statutAcademique = _statutAcademique;
        student.experiencesProfessionnelles = _experiencesProfessionnelles;

        emit StudentUpdated(_id, _nom, _prenom);
    }

    // Supprimer un étudiant (Admin uniquement)
    function deleteStudent(uint256 _id) public onlyAdmin {
        require(students[_id].id != 0, "Student does not exist.");

        delete students[_id];
        studentCount--;

        emit StudentDeleted(_id);
    }

    // Récupérer les informations d'un étudiant (Accessible aux Admins et Users)
    function getStudent(uint256 _id) public view onlyUser returns (Student memory) {
        require(students[_id].id != 0, "Student does not exist.");
        return students[_id];
    }

    // Récupérer tous les étudiants (Accessible aux Admins et Users)
    function getAllStudents() public view onlyUser returns (Student[] memory) {
        require(studentCount > 0, "No students found.");

        Student[] memory allStudents = new Student[](studentCount);
        for (uint256 i = 0; i < studentCount; i++) {
            allStudents[i] = students[studentIds[i]];
        }
        return allStudents;
    }
}



    // Fonction pour récupérer l'attestation de stage
/*function addStageAttestation(uint256 _id, string memory ipfsHash) public {
    require(students[_id].id != 0, "Student does not exist.");
    require(bytes(ipfsHash).length > 0, "Invalid IPFS hash.");
    students[_id].stageAttestationHash = ipfsHash;
    emit StageAttestationAdded(_id, ipfsHash);
}

function addSchoolAttestation(uint256 _id, string memory ipfsHash) public {
    require(students[_id].id != 0, "Student does not exist.");
    require(bytes(ipfsHash).length > 0, "Invalid IPFS hash.");
    students[_id].schoolAttestationHash = ipfsHash;
    emit SchoolAttestationAdded(_id, ipfsHash);
}*/





