import { ethers } from "ethers";
declare var window: any;
/**
 * MetaMask が期待するネットワークに接続されているかチェックする関数
 * @param expectedChainId 期待するチェーンID 80002
 * @returns 正しいネットワークに接続されている場合は true、違う場合は false
 */
export async function checkNetwork(expectedChainId: number): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error("MetaMask がインストールされていません。");
  }

  // ユーザーにウォレット接続をリクエスト
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // 現在のネットワーク情報を取得
  const network = await provider.getNetwork();
  console.log("接続中のネットワークの chainId:", Number(network.chainId));
  
  if (Number(network.chainId) !== expectedChainId) {
    return false;
  }
  return true;
}
