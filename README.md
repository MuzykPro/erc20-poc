# Mintable ERC20 Proof of Concept

This project is a **proof of concept** demonstrating how to connect a frontend application to an ERC20 smart contract on the Ethereum blockchain. It includes:

- **RoninToken**: A custom ERC20 token smart contract with mintable and burnable functionalities.
- **ReactJS Frontend**: A web application that allows users to interact with the RoninToken smart contract using MetaMask or any other Ethereum-compatible wallet.

---


## Introduction

The purpose of this project is to showcase how a decentralized application (dApp) can interact with an Ethereum smart contract. Specifically, it demonstrates:

- Deploying an ERC20 token smart contract with minting and burning capabilities.
- Building a ReactJS frontend that connects to the Ethereum blockchain via MetaMask.
- Displaying token balances and allowing authorized users to mint new tokens.

---

## Smart Contract Details

### RoninToken

The smart contract, **RoninToken**, is an ERC20 token built using OpenZeppelin libraries for standard token functionalities. It is deployed on the **Sepolia test network**.

### Features

- **ERC20 Compliance**: Implements the standard ERC20 interface.
- **Mintable**: Authorized accounts can mint new tokens.
- **Burnable**: Token holders can burn their tokens to reduce the total supply.
- **Access Control**: Uses OpenZeppelin's AccessControl for role management.
  - **MINTER_ROLE**: Only accounts with this role can mint tokens.
  - **DEFAULT_ADMIN_ROLE**: Has the authority to grant and revoke roles.

---

## Frontend Application

### Features

- **MetaMask Integration**: Connects to the user's Ethereum wallet via MetaMask.
- **Balance Checker**: Displays the user's RoninToken balance.
- **Minting Interface**: Allows users with the `MINTER_ROLE` to mint tokens to any address.
- **Transaction Feedback**: Shows real-time transaction status with spinners and links to Etherscan.
- **Responsive Design**: Centers content in a styled box with a light blue theme.
