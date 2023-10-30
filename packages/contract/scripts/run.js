const main = async () => {
  //コントラクトがコンパイルします
  //コントラクトを扱うために必要なファイルが'artifacts'ディレクトリの直下に生成されます。
  const nftContractFactory = await hre.ethers.getContractFactory("Web3Mint");
  
  //HardhatがローカルのEthereumネットワークを作成します。
  const nftContract = await nftContractFactory.deploy();

  //コントラクトがMintされ、ローカルのブロックチェーンがデプロイされるまで待ちます。
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  //makeAnEpicNFT関数を呼び出す。NFTがMintされる。
  let txn = await nftContract.mintIpfsNFT(
    'poker',
    'bafybeibewfzz7w7lhm33k2rmdrk3vdvi5hfrp6ol5vhklzzepfoac37lry',
  );

  //Mintingが仮想マイナーにより、承認されるのを待つ。
  await txn.wait();
  let returnedTokenUri = await nftContract.tokenURI(0);
  console.log("tokenURI:", returnedTokenUri);
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