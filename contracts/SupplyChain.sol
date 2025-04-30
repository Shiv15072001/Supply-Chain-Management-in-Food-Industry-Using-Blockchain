// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FarmerModule.sol";
import "./ManufacturerModule.sol";
import "./SupplierModule.sol";
import "./RetailerModule.sol";
import "./ConsumerModule.sol";

contract SupplyChain is FarmerModule, ManufacturerModule, SupplierModule, RetailerModule, ConsumerModule {
    constructor() {}
}
