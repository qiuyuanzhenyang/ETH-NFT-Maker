import { Button } from "@mui/material";
import { ethers } from 'ethers';
import React from "react";
import { useEffect, useState } from "react"
import { Web3Storage } from 'web3.storage'
import Web3Mint from '../../utils/Web3Mint.json';
import ImageLogo from "./image.svg";
import "./NftUploader.css";

const NftUploader = () => {
  /*
   *ユーザーがウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currestAccount, setCurrentAccount] = useState('');
  console.log('currentAccount: ', currestAccount);
  const checkIfWalletIsConnected = async () => {
    /*
     *ユーザーがMetaMaskを持っているか確認します。
     */
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);
    if (chainId !== "11155111") {
      alert("You are not connected to the sepolia Test Network!")
    }

    //accountsにWEBサイトを訪れたユーザーのウォレットアカウントを格納する（複数持っている場合も加味）
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    //もしアカウントが一つでも存在したら、以下を実行。
    if (accounts.length !==0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      //currentAccountにユーザーのアカウントアドレスを格納
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };
  const connectWallet = async () => {
    try{
       const { ethereum } = window;
       if (!ethereum) {
        alert("Get MetaMask!");
        return;
       }
       /*
        *ウォレットアドレスに対してアクセスをリクエストしています。
        */
       const accounts = await ethereum.request({
        method: "eth_requestAccounts",
       });
       console.log("Connected", accounts[0]);
       /*
        *ウォレットアドレスをcurrentAccounstに紐づけます。
        */
       setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async (ipfs) => {
    const CONTRACT_ADDRESS = '0x03e7A4d5a76f4A2A35de96c7117d6E7eC097406f';
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.mintIpfsNFT("sample", ipfs);
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(
          `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  };

  const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweERlMjkyNjA2RTZCOEUzMjMxNUFlOWJCNTk2ZEFGZThiQmI1MGQ4ODgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTg0OTg2MDUxNTMsIm5hbWUiOiJXZWIzTWludF8xIn0.mSqgBoKJg0v1z2V3tT24u_L7h64qU8E19ilrR_eVqc0';

  const imageToNFT = async (e) => {
    const client = new Web3Storage({ token: API_KEY })
    const image = e.target
    console.log(image)
  
    const rootCid = await client.put(image.files, {
      name: "experiment",
      maxRetries: 3
    })
    const res = await client.get(rootCid)
    const files = await res.files()
    for (const file of files) {
      console.log("file.cid:", file.cid)
      askContractToMintNft(file.cid)
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  /*
   *ページがロードされたときにuseEffect()内の関数をが呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  },[]);

  return (
    <div className="outerBox">
      {currestAccount === '' ? (
        renderNotConnectedContainer()
      ) : (
        <p>If you choose image, you can mint your NFT</p>
      )}
      <div className="title">
        <h2>NFTアップローダー</h2>
      </div>
      <div className="nftUplodeBox">
        <div className="imageLogoAndText">
          <img src={ImageLogo} alt="imagelogo" />
          <p>ここにドラッグ＆ドロップしてね</p>
        </div>
        <input
          className="nftUploadInput"
          multiple
          name="imageURL"
          type="file"
          accept=".jpg , .jpeg , .png"
          onChange={imageToNFT}
        />
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input
          className="nftUploadInput"
          type="file"
          accept=".jpg , .jpeg , .png"
          onChange={imageToNFT}
        />
      </Button>
    </div>
  );
};

export default NftUploader;
