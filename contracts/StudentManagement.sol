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
    }

    mapping(uint256 => Student) private students;
    mapping(uint256 => string[]) private stageAttestations; // Mapping for multiple stage attestations
    mapping(uint256 => string[]) private schoolAttestations; // Mapping for multiple school attestations
    uint256 public studentCount;
    uint256[] public studentIds;

    event StudentAdded(uint256 id, string nom, string prenom);
    event StudentUpdated(uint256 id, string nom, string prenom);
    event StudentDeleted(uint256 id);
    event StageAttestationAdded(uint256 indexed studentId, string ipfsHash);
    event SchoolAttestationAdded(uint256 indexed studentId, string ipfsHash);

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
            experiencesProfessionnelles: _experiencesProfessionnelles
        });

        studentIds.push(_id);
        studentCount++;
        emit StudentAdded(_id, _nom, _prenom);
    }
        // Vérifier si un étudiant existe
    function studentExists(uint256 _id) public view returns (bool) {
        return students[_id].id != 0;
    }


    // Ajouter une attestation de stage pour un étudiant
    function addStageAttestation(uint256 _id, string memory _ipfsHash) public onlyAdmin {
        require(students[_id].id != 0, "Student does not exist.");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash.");

        stageAttestations[_id].push(_ipfsHash);
        emit StageAttestationAdded(_id, _ipfsHash);
    }

    // Ajouter une attestation scolaire pour un étudiant
    function addSchoolAttestation(uint256 _id, string memory _ipfsHash) public onlyAdmin {
        require(students[_id].id != 0, "Student does not exist.");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash.");

        schoolAttestations[_id].push(_ipfsHash);
        emit SchoolAttestationAdded(_id, _ipfsHash);
    }

    // Récupérer toutes les attestations de stage d'un étudiant
    function getStageAttestations(uint256 _id) public view onlyUser returns (string[] memory) {
        require(students[_id].id != 0, "Student does not exist.");
        return stageAttestations[_id];
    }

    // Récupérer toutes les attestations scolaires d'un étudiant
    function getSchoolAttestations(uint256 _id) public view onlyUser returns (string[] memory) {
        require(students[_id].id != 0, "Student does not exist.");
        return schoolAttestations[_id];
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
        delete stageAttestations[_id];
        delete schoolAttestations[_id];
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
