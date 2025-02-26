import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("stageSBT", function () {
  let stageSBT: Contract;
  let owner: any;
  let addr1: any;
  let addr2: any;
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    // サインナー（owner, addr1, addr2）を取得
    [owner, addr1, addr2] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);
    console.log("addr1 account:", addr1.address);
    console.log("addr2 account:", addr2.address);
    // コントラクトのファクトリーを取得してデプロイ
    stageSBT = await ethers.deployContract("stageSBT")
    await stageSBT.waitForDeployment();
    
    console.log(`Contract deployed to: ${stageSBT.target}`);
  });

  it("should allow the owner to mint using safeMint", async function () {
    // owner が safeMint を利用して addr1 に tokenId = 1 をミントする
    const tx = await stageSBT.safeMint(addr1.address, 1);
    await tx.wait();

    // ownerOf(1) が addr1 であることを確認
    expect(await stageSBT.ownerOf(1)).to.equal(addr1.address);

    // tokenURI が正しく設定されていることを確認
    const expectedURI = "https://chiiko-h.github.io/sbt_sample/metadata/1.json";
    expect(await stageSBT.tokenURI(1)).to.equal(expectedURI);
  });

  it("should allow a user to mint only once using userMint", async function () {
    // addr1 が userMint を利用して tokenId = 2 をミント
    const tx = await stageSBT.connect(addr1).userMint(addr1.address, 2);
    await tx.wait();

    expect(await stageSBT.ownerOf(2)).to.equal(addr1.address);
    expect(await stageSBT.tokenURI(2)).to.equal("https://chiiko-h.github.io/sbt_sample/metadata/2.json");

    // 同一アカウントから再度 userMint を呼ぶと失敗する
    await expect(
      stageSBT.connect(addr1).userMint(addr1.address, 3)
    ).to.be.revertedWith("Already minted");
  });

  it("should return tokensOfOwner correctly", async function () {
    // owner による safeMint と addr1 による userMint を組み合わせて、addr1 が2つのトークンを所有している状態を作成
    await stageSBT.safeMint(addr1.address, 1);
    await stageSBT.connect(addr1).userMint(addr1.address, 2);

    // tokensOfOwner で addr1 のトークンID一覧を取得
    const tokens = await stageSBT.tokensOfOwner(addr1.address);
    // ethers v6 では返り値が bigint になることがあるので、Number() による変換を行う
    const tokenIds = tokens.map((bn: any) => Number(bn));
    expect(tokenIds).to.have.members([1, 2]);
  });

  it("should prevent token transfers (non-transferable)", async function () {
    // addr1 に tokenId = 1 をミント（owner が safeMint を利用）
    await stageSBT.safeMint(addr1.address, 1);
    // addr1 から addr2 に tokenId 1 を転送しようとすると、譲渡禁止のためリバートする
    await expect(
      stageSBT.connect(addr1).transferFrom(addr1.address, addr2.address, 1)
    ).to.be.revertedWith("Non-transferable");
  });
});