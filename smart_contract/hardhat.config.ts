import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    amoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,//"https://rpc-amoy.polygon.technology/",
      chainId: 80002,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    hardhat: {
      chainId: 31337, // デフォルトは 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545", // npx hardhat node で起動した場合の RPC URL
      chainId: 31337, // Hardhat Network のチェーンID（例）
    },
  },
};

export default config;
