// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./base/SupplyBase.sol";

contract ConsumerModule is SupplyBase {
    function scanProduct(uint256 _productId) public onlyRole(Role.Consumer) {
        require(products[_productId].isSold, "Not sold yet");
        emit ProductScanned(_productId, msg.sender);
    }
}
