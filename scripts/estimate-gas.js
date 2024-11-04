const { ethers } = require("hardhat");

async function main() {
    const ContractFactory = await ethers.getContractFactory("RoninToken");


    const deploymentTransaction = ContractFactory.getDeployTransaction();

    const estimatedGas = await ethers.provider.estimateGas(deploymentTransaction);

    const feeData = await ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    const estimatedCost = estimatedGas * gasPrice;
    const estimatedCostInEther = ethers.formatEther(estimatedCost);
    console.log(`Estimated gas for deploying the contract: ${estimatedGas.toString()}`);
    console.log(`Estimated gas cost in ETH: ${estimatedCostInEther}`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error estimating gas:", error);
        process.exit(1);
    });
