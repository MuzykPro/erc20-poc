import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyTokenArtifact from './abi/RoninToken.json';
import './App.css';

const contractAddress = '0x5354013600Ac9F5751d48774e542b9f1f7F11249';

function App() {
  // State variables
  const [userAddress, setUserAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [hasMinterRole, setHasMinterRole] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Styling objects
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
  };

  const boxStyle = {
    backgroundColor: '#f0f8ff', // Light blue color
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '100%',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '20px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  useEffect(() => {
    if (window.ethereum) {
      setIsMetaMaskInstalled(true);
      checkNetwork();
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const checkNetwork = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    if (network.chainId != 11155111) {
      setErrorMessage(`Please connect MetaMask to the Sepolia Test Network. Current chainId is ${network.chainId}`);
    } else {
      setErrorMessage("");
    }
  };

  const connectWallet = async () => {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create an ethers provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get user's Ethereum address
      const address = await signer.getAddress();
      setUserAddress(address);

      // Create a contract instance with signer
      const contractWithSigner = new ethers.Contract(
        contractAddress,
        MyTokenArtifact.abi,
        signer
      );

      // Fetch token balance
      const balance = await contractWithSigner.balanceOf(address);
      const decimals = await contractWithSigner.decimals();
      const formattedBalance = ethers.formatUnits(balance, decimals);
      setTokenBalance(formattedBalance);

      // Check if the user has MINTER_ROLE
      const MINTER_ROLE = await contractWithSigner.MINTER_ROLE();
      const hasRole = await contractWithSigner.hasRole(MINTER_ROLE, address);
      setHasMinterRole(hasRole);
      setErrorMessage("");
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setErrorMessage('Failed to connect wallet.');
    }
  };

  const handleMint = async () => {
    try {
      if (!mintAddress || !mintAmount) {
        setErrorMessage('Please enter a valid address and amount.');
        return;
      }
      setIsMinting(true);
      // Create an ethers provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create a contract instance with signer
      const contractWithSigner = new ethers.Contract(
        contractAddress,
        MyTokenArtifact.abi,
        signer
      );

      // Convert mint amount to the correct decimals
      const decimals = await contractWithSigner.decimals();
      const amountToMint = ethers.parseUnits(mintAmount, decimals);

      // Call the mint function
      const tx = await contractWithSigner.mint(mintAddress, amountToMint);
      await tx.wait();
      setIsMinting(false);
      setTxHash(tx.hash);
      // Update the token balance
      const balance = await contractWithSigner.balanceOf(userAddress);
      const formattedBalance = ethers.formatUnits(balance, decimals);
      setTokenBalance(formattedBalance);

    } catch (error) {
      console.error('Error minting tokens:', error);
      setErrorMessage('Failed to mint tokens.');
    }
  };

  // Render
  return (
    <div>
      <div style={containerStyle}>
        <div style={boxStyle}>
          <h1 style={headerStyle}>
            Ronin Token Balance Checker
          </h1>
          {errorMessage && (
            <p style={{ color: errorMessage.includes('successfully') ? 'green' : 'red' }}>
              {errorMessage}
            </p>
          )}
          {isMetaMaskInstalled ? (
            userAddress ? (
              <div>
                <p>
                  <strong>Your Address:</strong> {userAddress}
                </p>
                <p>
                  <strong>Your RONIN Balance:</strong> {tokenBalance}
                </p>

                {/* Minting Form */}
                {hasMinterRole && (
                  <div style={{ marginTop: '20px' }}>
                    <h2>Mint Tokens</h2>
                    {isMinting && (
                      <div style={{ marginBottom: '10px' }}>
                        <p>Transaction is processing...</p>
                        <div className="spinner"></div>
                      </div>
                    )}
                    {txHash && (
                      <div style={{ marginTop: '10px' }}>
                        <p style={{ color: 'green', fontSize: '14px' }}>
                          Tokens minted successfully! View transaction on Etherscan:{' '}
                          <a
                            href={`https://sepolia.etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {txHash}
                          </a>
                        </p>
                      </div>
                    )}
                    <div>
                      <label>
                        Recipient Address:
                        <input
                          type="text"
                          value={mintAddress}
                          onChange={(e) => setMintAddress(e.target.value)}
                          placeholder="0x..."
                          style={inputStyle}
                        />
                      </label>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <label>
                        Amount to Mint:
                        <input
                          type="number"
                          value={mintAmount}
                          onChange={(e) => setMintAmount(e.target.value)}
                          placeholder="Amount"
                          style={inputStyle}
                        />
                      </label>
                    </div>
                    <button onClick={handleMint} style={buttonStyle}>
                      Mint Tokens
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={connectWallet} style={buttonStyle}>
                Connect MetaMask Wallet
              </button>
            )
          ) : (
            <p style={{textAlign: 'center'}}>Please install MetaMask to use this application.</p>
          )}
        </div>
      </div>
      {/* Space for instructions */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        {/* Add your instructions here */}
        <p>
          <h2>Instructions:</h2><br></br>
         
              1. ERC20 token smart contract is deployed to Sepolia test network:&nbsp;
              <a href={`https://sepolia.etherscan.io/address/0x5354013600Ac9F5751d48774e542b9f1f7F11249`}
                target="_blank"
                rel="noopener noreferrer">
                0x5354013600Ac9F5751d48774e542b9f1f7F11249
              </a><br></br><br></br>
            
            2. There is one admin wallet with ability to mint tokens: 0x190977eDB9Ff66Fc5e594b858f96A0dab3736b3f<br></br><br></br>
            3. Admin's private key to import in Metamask: *Sent on LinkedIn*<br></br><br></br>
            4. When minted, tokens can be transferred to any account using wallet of your choice (e.g. Metamask)<br></br><br></br>
          
        </p>
      </div>
    </div>
  );
}

export default App;
