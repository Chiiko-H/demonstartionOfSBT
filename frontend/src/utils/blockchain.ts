import { ethers } from "ethers";
import SBTGameABI from "../contracts/SBTGame.json"; // ABI JSON ファイル。パスはプロジェクト構成に合わせて調整
declare var window: any;

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // デプロイした StageSBT コントラクトのアドレス
//local :0x5FbDB2315678afecb367f032d93F642f64180aa3


export async function connectWallet(): Promise<{
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
}> {
  if (!window.ethereum) {
    throw new Error("MetaMask がインストールされていません。");
  }
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
}

/**
 * ユーザーのウォレットに SBT をミントする関数
 * userMint は stage 番号のみ渡す
 */
export async function mintSBT(stage: number): Promise<void> {
  try {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, SBTGameABI.abi, signer);
    // userMint は stage 番号のみ渡す
    const tx = await contract.userMint(stage);
    console.log("トランザクション送信中...", tx.hash);
    await tx.wait();
    console.log(`ステージ ${stage} のSBTが正常にミントされました！`);
  } catch (error: any) {
    const errMsg: string = error?.revert?.args && error.revert.args.length > 0 ? error.revert.args[0] : error.message;
    if (errMsg && errMsg.includes("Already minted")) {
      throw new Error("ミント済みです");
    } else {
      throw new Error("ミントに失敗しました: " + errMsg);
    }
  }
}

/**
 * ユーザーのウォレットに存在する SBT 一覧を取得する関数
 */
export async function getSBTList(): Promise<Array<{ tokenId: string; metadata: any }>> {
  if (!window.ethereum) {
    throw new Error("MetaMask がインストールされていません。");
  }
  const { provider, signer } = await connectWallet();
  const userAddress = await signer.getAddress();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SBTGameABI.abi, provider);

  // ユーザーが保有しているトークン数を取得
  const balanceBN = await contract.balanceOf(userAddress);
  const balance = Number(balanceBN); // balanceBN が bigint などの場合、Number() で変換
  const sbtList: Array<{ tokenId: string; metadata: any }> = [];

  // ERC721Enumerable の tokenOfOwnerByIndex を利用して各トークンIDを取得
  for (let i = 0; i < balance; i++) {
    const tokenIdBN = await contract.tokenOfOwnerByIndex(userAddress, i);
    const tokenId = tokenIdBN.toString(); // 文字列として扱う

    // tokenURI を取得
    const tokenURI: string = await contract.tokenURI(tokenId);
    let metadata: any = {};

    if (tokenURI.startsWith("data:")) {
      const base64JSON = tokenURI.split(",")[1];
      const jsonString = atob(base64JSON);
      metadata = JSON.parse(jsonString);
    } else {
      try {
        const response = await fetch(tokenURI);
        metadata = await response.json();
      } catch (e) {
        console.error(`tokenURI の取得に失敗しました (tokenId: ${tokenId})`, e);
      }
    }
    sbtList.push({ tokenId, metadata });
  }
  return sbtList;
}