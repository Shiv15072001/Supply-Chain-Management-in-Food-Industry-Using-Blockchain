// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./base/SupplyBase.sol";

contract FarmerModule is SupplyBase {

    function addProduct(
        string memory _cropType,
        uint256 _harvestDate,
        string memory _location,
        string memory _farmingPractices,
        string memory _certifications,
        uint256 _temperature,
        uint256 _price
    ) public onlyRole(Role.Farmer) {
        productCount++;

        Product memory newProduct = Product({
            id: productCount,
            cropType: _cropType,
            harvestDate: _harvestDate,
            location: _location,
            farmingPractices: _farmingPractices,
            certifications: _certifications,
            temperature: _temperature,
            price: _price,
            farmer: msg.sender,
            isSold: false
        });

        products[productCount] = newProduct;
        farmerProducts[msg.sender].push(productCount);
        allProducts.push(newProduct);
        productIdToIndex[productCount] = allProducts.length - 1;

        emit ProductAdded(productCount, _cropType, msg.sender);
    }

    function getFarmerProductIds() public view onlyRole(Role.Farmer) returns (uint256[] memory) {
        return farmerProducts[msg.sender];
    }


}
