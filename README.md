## SBTの発行と、ウォレットに紐づいたSBTを取得するデモです。
- npm 10.9.0
- node 22.12.0

## ローカル環境での構築

### ノード起動

- スマートコントラクト側、フロントエンド側問わず作業中は起動したままにしてください。

```
npx hardhat node
```

### スマートコントラクト

- .envファイルを作成し、起動したノードから取得したPrivate Keyを設定してください。
- 別ターミナルにて以下を実行

```
cd .\smart_contract
npm install
npx hardhat compile
npx hardhat run scripts/mint.js --network localhost
```

- ローカルネットにデプロイされました。以下をフロントエンド側で利用するのでメモしてください。
    - デプロイ先のコントラクトアドレス
    - .\smart_contract\artifacts\contracts\StageSBT.sol\stageSBT.json

### フロントエンド

- デプロイ先のコントラクトアドレスを以下ファイルのCONTRACT_ADDRESSに設定してください。
    .\frontend\src\utils\blockchain.ts    
- スマートコントラクト側でデプロイ時に作成されたartifacts配下にあるjsonを以下のファイルと置き換えてください。
    .\frontend\src\contracts\SBTGame.json
- 別ターミナルにて以下を実行

```
cd .\frontend
npm install
npm run dev
```


### Chromeブラウザにて確認
- 事前に行うこと
    - Metamaskがインストールされている
    - Metamaskにローカルネットでログインしていること

