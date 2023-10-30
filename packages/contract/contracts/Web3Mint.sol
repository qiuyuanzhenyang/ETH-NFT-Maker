// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

//いくつかのOpenZeppelinのコントラクトをインポートします。
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//OpenZeppelinが提供するヘルパー機能をインポートします。
import "@openzeppelin/contracts/utils/Counters.sol";
import "./libraries/Base64.sol";
import "hardhat/console.sol";

//インポートしたOpenZeppelinのコントラクトを継承しています。
//継承したコントラクトのメソッドにアクセスできるようになります。
contract Web3Mint is ERC721 {
    struct NftAttributes {
        string name;
        string imageURL;
    }

    NftAttributes[] Web3Nfts;
    
    using Counters for Counters.Counter;
    //_tokenIdsを初期化（_tokenIds = 0）
    Counters.Counter private _tokenIds;

    //NFTトークンの名前とそのシンボルを渡します。
    constructor() ERC721("NFT", "nft") {
        console.log("This is my NFT contract.");
    }

    //ユーザーがNFTを取得するために実行する関数です。
    function mintIpfsNFT(string memory name, string memory imageURI) public {
        //現在のtokenIdを取得します。tokenIdは0から始まります。
        uint256 newItemId = _tokenIds.current();
        //msg.senderを使ってNFTを送信者にMintします。
        _safeMint(msg.sender, newItemId);
        Web3Nfts.push(NftAttributes({name: name, imageURL: imageURI}));
        //NFTがいつ誰に作成されたかを確認します。
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
        //次のNFTがMintされるときのカウンターをインクリメントする。
        _tokenIds.increment();
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        Web3Nfts[_tokenId].name,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "An epic NFT", "image": "ipfs://',
                        Web3Nfts[_tokenId].imageURL,
                        '"}'
                    )
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }
}