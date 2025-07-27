// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./base/SupplyBase.sol";

contract RetailerModule is SupplyBase {

    /// @notice Fetch processing details

    function getRetailerProcessedProductIds()
        public
        view
        onlyRole(Role.Retailer)
        returns (uint256[] memory)
    {
        return retailerToProcessedIds[msg.sender];
    }

    function completeShipment(uint256 _productId) public onlyRole(Role.Retailer) {
        Processing storage proc = processedProducts[_productId];
        require(proc.retailer == msg.sender, "Unauthorized");
        require(proc.shipmentStatus == Stage.IN_TRANSIT, "Not in transit");

        proc.deliveryTime = block.timestamp;
        proc.shipmentStatus = Stage.DELIVERED;
    }

    function addInventory(
        uint256 _productId,
        uint256 _arrivalDate,
        uint256 _shelfLife,
        string memory _storageConditions
    ) public onlyRole(Role.Retailer) {
        inventoryCount++;
        inventories[inventoryCount] = Inventory({
            productId: _productId,
            arrivalDate: _arrivalDate,
            shelfLife: _shelfLife,
            storageConditions: _storageConditions,
            retailer: msg.sender
        });
        retailerToInventoryIds[msg.sender].push(inventoryCount);
        emit InventoryLogged(_productId, msg.sender);
    }
}
