// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RoleManager {
    address public owner;
    mapping(address => bool) private admins;
    mapping(address => bool) private users;

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event UserAdded(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Access denied: Only admins can perform this action.");
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true; // The deployer becomes an admin by default
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
        admins[newOwner] = true;
    }

    function addAdmin(address _admin) public onlyOwner {
        require(_admin != address(0), "Invalid admin address.");
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) public onlyOwner {
        require(admins[_admin], "Address is not an admin.");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    function addUser(address _user) public onlyAdmin {
        require(_user != address(0), "Invalid user address.");
        users[_user] = true;
        emit UserAdded(_user);
    }

    function isAdmin(address _address) public view returns (bool) {
        return admins[_address];
    }

    function isUser(address _address) public view returns (bool) {
        return users[_address];
    }
}
