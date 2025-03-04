// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AlpacaMarket is ReentrancyGuard, Ownable {
    // Alpaca contract interface
    IERC721 private alpacaContract;
    
    // Market fee percentage (2%)
    uint256 public marketFeePercentage = 2;
    
    // Listing struct
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }
    
    // Mapping from token ID to listing
    mapping(uint256 => Listing) public listings;
    
    // Events
    event AlpacaListed(uint256 tokenId, address seller, uint256 price);
    event AlpacaSold(uint256 tokenId, address seller, address buyer, uint256 price);
    event ListingCancelled(uint256 tokenId, address seller);
    
    constructor(address _alpacaContract) Ownable(msg.sender) {
        alpacaContract = IERC721(_alpacaContract);
    }
    
    // List an alpaca for sale
    function listAlpaca(uint256 _tokenId, uint256 _price) external {
        require(alpacaContract.ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(_price > 0, "Price must be greater than zero");
        require(!listings[_tokenId].active, "Already listed");
        
        // Approve the market contract to transfer the alpaca
        alpacaContract.approve(address(this), _tokenId);
        
        // Create listing
        listings[_tokenId] = Listing({
            seller: msg.sender,
            price: _price,
            active: true
        });
        
        emit AlpacaListed(_tokenId, msg.sender, _price);
    }
    
    // Buy a listed alpaca
    function buyAlpaca(uint256 _tokenId) external payable nonReentrant {
        Listing storage listing = listings[_tokenId];
        
        require(listing.active, "Not listed for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy your own alpaca");
        
        // Calculate market fee
        uint256 marketFee = (listing.price * marketFeePercentage) / 100;
        uint256 sellerAmount = listing.price - marketFee;
        
        // Mark as inactive before transfer to prevent reentrancy
        listing.active = false;
        
        // Transfer alpaca to buyer
        alpacaContract.safeTransferFrom(listing.seller, msg.sender, _tokenId);
        
        // Transfer funds to seller
        (bool success, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(success, "Transfer to seller failed");
        
        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit AlpacaSold(_tokenId, listing.seller, msg.sender, listing.price);
    }
    
    // Cancel a listing
    function cancelListing(uint256 _tokenId) external {
        Listing storage listing = listings[_tokenId];
        
        require(listing.active, "Not listed for sale");
        require(listing.seller == msg.sender, "Not the seller");
        
        listing.active = false;
        
        emit ListingCancelled(_tokenId, msg.sender);
    }
    
    // Update market fee percentage (owner only)
    function setMarketFeePercentage(uint256 _percentage) external onlyOwner {
        require(_percentage <= 10, "Fee too high");
        marketFeePercentage = _percentage;
    }
    
    // Withdraw market fees (owner only)
    function withdrawFees() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Get all active listings
    function getActiveListings() external view returns (uint256[] memory) {
        // First, count active listings
        uint256 count = 0;
        for (uint256 i = 1; i <= 10000; i++) { // Assuming max 10000 alpacas
            if (listings[i].active) {
                count++;
            }
        }
        
        // Then create and populate array
        uint256[] memory activeListings = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= 10000; i++) {
            if (listings[i].active) {
                activeListings[index] = i;
                index++;
            }
        }
        
        return activeListings;
    }
}