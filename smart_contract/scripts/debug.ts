import { ethers } from "hardhat";

async function debugMintAndBalance() {	const [deployer] = await ethers.getSigners();

	console.log("Deploying contracts with the account:", deployer.address);

    const contract = await ethers.deployContract("stageSBT"); // mint用に変更 

    await contract.waitForDeployment();
    console.log(`Contract deployed to: ${contract.target}`);

  // 例: オーナーが safeMint を使って deployer に tokenId 1 をミントする
  const tx = await contract.safeMint(deployer.address, 1);
  await tx.wait();

  const balance = await contract.balanceOf(deployer.address);
  console.log("Deployer's balance:", balance.toString());

  // 追加で tokenURI も確認
  const tokenURI = await contract.tokenURI(1);
  console.log("Token URI for tokenId 1:", tokenURI);
}

debugMintAndBalance();
