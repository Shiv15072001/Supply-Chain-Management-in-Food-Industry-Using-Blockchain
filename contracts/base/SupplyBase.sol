// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyBase {
    enum Role { None, Farmer, Manufacturer, Supplier, Retailer, Consumer }
    enum Stage { NOT_ACCEPTED, PENDING_APPROVAL, ACCEPTED, IN_TRANSIT, DELIVERED }

    struct User {
        address userAddress;
        Role role;
        bool isRegistered;
    }

    struct Product {
        uint256 id;
        string cropType;
        uint256 harvestDate;
        string location;
        string farmingPractices;
        string certifications;
        uint256 temperature;
        uint256 price;
        address farmer;
        bool isSold;
    }

    struct Processing {
        uint256 productId;
        uint256 processingDate;
        string methods;
        string additives;
        uint256 price;
        address manufacturer;
        Stage shipmentStatus;
        address supplier;
        address retailer;
        uint256 pickupTime;
        uint256 deliveryTime;
    }

    struct Shipment {
        uint256 productId;
        string destination;
        uint256 dispatchDate;
        uint256 arrivalDate;
        uint256 recordedTemperature;
        string conditions;
        address supplier;
    }

    struct Inventory {
        uint256 productId;
        uint256 arrivalDate;
        uint256 shelfLife;
        string storageConditions;
        address retailer;
    }

    mapping(address => User) public users;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Processing) public processedProducts;
    mapping(uint256 => Shipment) public shipments;
    mapping(uint256 => Inventory) public inventories;
    mapping(address => uint256[]) public farmerProducts;
    Product[] public allProducts;
    mapping(uint256 => uint256) public productIdToIndex;
    mapping(uint256 => address) public purchaseRequests;
    mapping(uint256 => address) public productToManufacturer;
    mapping(address => uint256[]) public manufacturerToProcessedIds;
    mapping(address => uint256[]) public retailerToProcessedIds;
    uint256[] public allProcessedProductIds;
    mapping(address => uint256[]) public retailerToInventoryIds;

    uint256 public productCount;
    uint256 public shipmentCount;   
    uint256 public inventoryCount;

    event UserRegistered(address indexed user, Role role);
    event ProductAdded(uint256 id, string cropType, address farmer);
    event PurchaseRequested(uint256 productId, address manufacturer, uint256 amount);
    event PaymentReleased(uint256 productId, address farmer, uint256 amount);
    event ShipmentCreated(uint256 productId, string destination, address supplier);
    event InventoryLogged(uint256 productId, address retailer);
    event ProductScanned(uint256 productId, address consumer);

    modifier onlyRole(Role _role) {
        require(users[msg.sender].role == _role, "Access Denied: Incorrect Role");
        _;
    }

    /// @notice Register a user under a specific role
    function register(Role _role) public {
        require(users[msg.sender].role == Role.None, "Already registered");
        require(_role != Role.None, "Invalid role");

        users[msg.sender] = User(msg.sender, _role, true);
        emit UserRegistered(msg.sender, _role);
    }

    /// @notice Fetch the role and info of an address
    function getRole(address _ad) public view returns (User memory) {
        return users[_ad];
    }

/// @notice Fetch all product details for a specific product
    function getProductDetails(
        uint256 _productId
    ) public view returns (Product memory) {
        return products[_productId];
    }

/// @notice Fetch all Inventory details for all
    function getRetailerInventoryIds(address retailer) public view returns (uint256[] memory) {
    return retailerToInventoryIds[retailer];
}

}
