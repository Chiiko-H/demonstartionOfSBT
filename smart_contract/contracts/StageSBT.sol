// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


contract stageSBT is ERC721URIStorage, ERC721Enumerable, Ownable{
    mapping(address => mapping(uint256 => bool)) hasMinted; // ユーザーが既に該当ステージでミントしたか記録
    constructor() ERC721("ChiikoExampleSBT", "SBT") Ownable() {}

    // 取得したステージ番号のmetadata 取得
    function _baseURI(uint256 stage) internal pure returns (string memory) {
        return string(abi.encodePacked("https://chiiko-h.github.io/sbt_sample/metadata/", uint256ToString(stage), ".json"));
    }

    // mint
    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _baseURI(tokenId));
    }

    // 譲渡禁止
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override(ERC721, ERC721Enumerable) {
        require(from == address(0), "Non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }


    // 一般ユーザー向けに各ステージごとに1回のみミント可能な関数
    function userMint(uint256 stage) public {
        require(!hasMinted[msg.sender][stage], "Already minted");
        hasMinted[msg.sender][stage] = true;
        uint256 tokenId = uint256(keccak256(abi.encodePacked(msg.sender, stage)));
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _baseURI(stage));
    }

    // 所有するSBT一覧  
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 count = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // uint256 -> string
    function uint256ToString(uint256 value) internal pure returns (string memory) {
            if (value == 0) return "0";
            uint256 temp = value;
            uint256 digits;
            while (temp != 0) {
                digits++;
                temp /= 10;
            }
            bytes memory buffer = new bytes(digits);
            while (value != 0) {
                digits -= 1;
                buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
                value /= 10;
            }
            return string(buffer);
        }

    // uint256 -> bytes
    function uint256ToBytes(uint256 x) internal pure returns (bytes memory b) {
        b = new bytes(32);
        assembly {mstore(add(b, 32), x)}
    }
}