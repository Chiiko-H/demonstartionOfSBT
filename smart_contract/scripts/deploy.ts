import { ethers } from "hardhat";

// スマートコントラクトのデプロイテスト
async function main() {

	const [deployer] = await ethers.getSigners();

	console.log("Deploying contracts with the account:", deployer.address);

    const contract = await ethers.deployContract("HelloWorld");

    await contract.waitForDeployment();
    console.log(`Contract deployed to: ${contract.target}`);

    const saySomething = await contract.speak();
	console.log("saySomething value:", saySomething);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
