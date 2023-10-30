const main = async () => {
  //コントラクトがコンパイルします
  //コントラクトを扱うために必要なファイルが'artifacts'ディレクトリの直下に生成されます。
  const nftContractFactory = await hre.ethers.getContractFactory("Web3Mint");
  
  //HardhatがローカルのEthereumネットワークを作成します。
  const nftContract = await nftContractFactory.deploy();

  //コントラクトがMintされ、ローカルのブロックチェーンがデプロイされるまで待ちます。
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
};

//エラー処理を行っています。
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();