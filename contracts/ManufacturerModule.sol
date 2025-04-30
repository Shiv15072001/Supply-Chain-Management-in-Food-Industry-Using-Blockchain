// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./base/SupplyBase.sol";

contract ManufacturerModule is SupplyBase {
    function requestPurchase(
        uint256 _productId
    ) public payable onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];

        require(product.price > 0, "Product does not exist");
        require(!product.isSold, "Already sold");
        require(
            purchaseRequests[_productId] == address(0),
            "Already requested"
        );
        require(msg.value >= product.price, "Insufficient payment");

        purchaseRequests[_productId] = msg.sender;
        emit PurchaseRequested(_productId, msg.sender, msg.value);
    }

    function confirmDelivery(
        uint256 _productId,
        uint256 recordedTemperature
    ) public onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];

        require(!product.isSold, "Already sold");
        require(purchaseRequests[_productId] == msg.sender, "Unauthorized");
        require(recordedTemperature == product.temperature, "Temp mismatch");

        product.isSold = true;
        payable(product.farmer).transfer(product.price);
        allProducts[productIdToIndex[_productId]].isSold = true;
        productToManufacturer[_productId] = msg.sender;

        delete purchaseRequests[_productId];

        emit PaymentReleased(_productId, product.farmer, product.price);
    }

    function processProduct(
        uint256 _productId,
        uint256 _processingDate,
        string memory _methods,
        string memory _additives,
        uint256 _price
    ) public onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];
        require(product.isSold, "Purchase first");
        require(
            productToManufacturer[_productId] == msg.sender,
            "Unauthorized"
        );
        require(
            processedProducts[_productId].manufacturer == address(0),
            "Already processed"
        );

        processedProducts[_productId] = Processing({
            productId: _productId,
            processingDate: _processingDate,
            methods: _methods,
            additives: _additives,
            price: _price,
            manufacturer: msg.sender,
            shipmentStatus: Stage.NOT_ACCEPTED,
            supplier: address(0),
            retailer: address(0),
            pickupTime: 0,
            deliveryTime: 0
        });

        manufacturerToProcessedIds[msg.sender].push(_productId);
        allProcessedProductIds.push(_productId);
    }

    function acceptSupplier(
        uint256 _productId,
        address _retailer,
        uint256 _pickupTime,
        uint256 _deliveryTime
    ) public onlyRole(Role.Manufacturer) {
        Processing storage proc = processedProducts[_productId];

        require(proc.manufacturer == msg.sender, "Not your product");
        require(proc.shipmentStatus == Stage.PENDING_APPROVAL, "No supplier");

        proc.shipmentStatus = Stage.ACCEPTED;
        proc.retailer = _retailer;
        proc.pickupTime = _pickupTime;
        proc.deliveryTime = _deliveryTime;
    }

    /// @notice Fetch all product details fetch by manufacturer
    function getAllProducts()
        public
        view
        onlyRole(Role.Manufacturer)
        returns (Product[] memory)
    {
        return allProducts;
    }

    /// @notice Fetch processing details

    function getMyProcessedProductIds()
        public
        view
        onlyRole(Role.Manufacturer)
        returns (uint256[] memory)
    {
        return manufacturerToProcessedIds[msg.sender];
    }

    /// @notice Fetch processing details

    function getProcessingDetails(
        uint256 _productId
    ) public view returns (Processing memory) {
        return processedProducts[_productId];
    }
}
