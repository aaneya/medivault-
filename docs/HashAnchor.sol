// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Minimal hash anchor for MediVault — store SHA-256 digests on Polygon Mumbai.
 * Backend passes keccak256(abi.encodePacked(hexSha256)) or raw bytes32 from the hash.
 * This contract stores the 32-byte SHA-256 value directly as bytes32.
 */
contract HashAnchor {
    mapping(bytes32 => bool) public anchored;

    event HashAnchored(bytes32 indexed hashDigest, address indexed sender, uint256 blockNumber);

    function anchorHash(bytes32 sha256Digest) external {
        require(!anchored[sha256Digest], "already anchored");
        anchored[sha256Digest] = true;
        emit HashAnchored(sha256Digest, msg.sender, block.number);
    }

    function isAnchored(bytes32 sha256Digest) external view returns (bool) {
        return anchored[sha256Digest];
    }
}
