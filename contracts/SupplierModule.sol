// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./base/SupplyBase.sol";

contract SupplierModule is SupplyBase {



    function requestToShip(uint256 _productId) public onlyRole(Role.Supplier) {
        Processing storage proc = processedProducts[_productId];
        require(proc.shipmentStatus == Stage.NOT_ACCEPTED, "Already requested");
        proc.supplier = msg.sender;
        proc.shipmentStatus = Stage.PENDING_APPROVAL;
    }

    function startShipment(uint256 _productId) public onlyRole(Role.Supplier) {
        Processing storage proc = processedProducts[_productId];
        require(proc.supplier == msg.sender, "Unauthorized");
        require(proc.shipmentStatus == Stage.ACCEPTED, "Not accepted yet");

        proc.pickupTime = block.timestamp;
        proc.shipmentStatus = Stage.IN_TRANSIT;
    }

    function getAllProcessedProductIds() public view onlyRole(Role.Supplier) returns (uint256[] memory) {
    return allProcessedProductIds;
}
}

