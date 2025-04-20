// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    enum Role {
        None,
        Farmer,
        Manufacturer,
        Supplier,
        Retailer,
        Consumer
    }

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
        uint256 temperature; // Recorded temperature at harvest
        uint256 price; // Price can be set
        address farmer; //Wallet Address of farmer
        bool isSold;
    }

    struct Processing {
        uint256 productId;
        uint256 processingDate;
        string methods;
        string additives;
        address manufacturer;
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
    mapping(address => uint256[]) private farmerProducts;
    Product[] private allProducts; // This is for storing the product added by the farmer
    mapping(uint256 => uint256) private productIdToIndex;
    //Using of mapping to store the product id and its index in the array allProducts for effiecent search
    // mapping(uint256 => address) public purchaseRequests; // productId => manufacturer address

    uint256 public productCount;
    uint256 public shipmentCount;
    uint256 public inventoryCount;

    event UserRegistered(address indexed user, Role role);
    event ProductAdded(uint256 id, string cropType, address farmer);
    event PurchaseRequested(uint256 productId, address manufacturer);
    event PaymentReleased(uint256 productId, address farmer, uint256 amount);
    event ShipmentCreated(
        uint256 productId,
        string destination,
        address supplier
    );
    event InventoryLogged(uint256 productId, address retailer);
    event ProductScanned(uint256 productId, address consumer);

    modifier onlyRole(Role _role) {
        require(
            users[msg.sender].role == _role,
            "Access Denied: Incorrect Role"
        );
        _;
    }

    /// @notice Register as a specific role
    function register(Role _role) public {
        require(users[msg.sender].role == Role.None, "Already registered");
        require(_role != Role.None, "Invalid role");

        users[msg.sender] = User(msg.sender, _role, true);
        emit UserRegistered(msg.sender, _role);
    }

    function getRole(address _ad) public view returns (User memory) {
        return users[_ad];
    }

    /// @notice Farmer adds product details
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

        farmerProducts[msg.sender].push(productCount); //Track farmer's product ID
        allProducts.push(newProduct); // just add the product to list in order to view it by the manufacturer
        productIdToIndex[productCount] = allProducts.length - 1; //  Map productId to its index
        emit ProductAdded(productCount, _cropType, msg.sender);
    }

    /// @notice Manufacturer views product and requests purchase
    function requestPurchase(
        uint256 _productId
    ) public payable onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];

        require(product.price > 0, "Product does not exist");
        require(!product.isSold, "Product already sold");
        require(msg.value >= product.price, "Insufficient payment");

        // purchaseRequests[_productId] = msg.sender; //  Store the request
        emit PurchaseRequested(_productId, msg.sender);
    }

    /// @notice Manufacturer confirms delivery and validates temperature
    function confirmDelivery(
        uint256 _productId,
        uint256 recordedTemperature
    ) public onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];

        require(!product.isSold, "Product already sold");
        // require(purchaseRequests[_productId] == msg.sender, "No purchase request found for this manufacturer"); 
        require(
            recordedTemperature == product.temperature,
            "Temperature mismatch"
        );

        product.isSold = true;
        payable(product.farmer).transfer(product.price);

        uint256 index = productIdToIndex[_productId];
        allProducts[index].isSold = true;

        emit PaymentReleased(_productId, product.farmer, product.price);
    }

    /// @notice Manufacturer processes the product
    function processProduct(
        uint256 _productId,
        uint256 _processingDate,
        string memory _methods,
        string memory _additives
    ) public onlyRole(Role.Manufacturer) {
        require(products[_productId].isSold, "Product must be purchased first");

        processedProducts[_productId] = Processing({
            productId: _productId,
            processingDate: _processingDate,
            methods: _methods,
            additives: _additives,
            manufacturer: msg.sender
        });
    }

    /// @notice Supplier logs shipment details
    function createShipment(
        uint256 _productId,
        string memory _destination,
        uint256 _dispatchDate,
        uint256 _arrivalDate,
        uint256 _recordedTemperature,
        string memory _conditions
    ) public onlyRole(Role.Supplier) {
        shipmentCount++;
        shipments[shipmentCount] = Shipment({
            productId: _productId,
            destination: _destination,
            dispatchDate: _dispatchDate,
            arrivalDate: _arrivalDate,
            recordedTemperature: _recordedTemperature,
            conditions: _conditions,
            supplier: msg.sender
        });

        emit ShipmentCreated(_productId, _destination, msg.sender);
    }

    /// @notice Retailer logs inventory details
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

        emit InventoryLogged(_productId, msg.sender);
    }

    /// @notice Consumer scans product QR code
    function scanProduct(uint256 _productId) public onlyRole(Role.Consumer) {
        require(products[_productId].isSold, "Product not yet sold");
        emit ProductScanned(_productId, msg.sender);
    }

    /// @notice Fetch all product details for a specific product
    function getProductDetails(
        uint256 _productId
    ) public view returns (Product memory) {
        return products[_productId];
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
    function getProcessingDetails(
        uint256 _productId
    ) public view returns (Processing memory) {
        return processedProducts[_productId];
    }

    /// @notice Fetch shipment details
    function getShipmentDetails(
        uint256 _shipmentId
    ) public view returns (Shipment memory) {
        return shipments[_shipmentId];
    }

    /// @notice Fetch inventory details
    function getInventoryDetails(
        uint256 _inventoryId
    ) public view returns (Inventory memory) {
        return inventories[_inventoryId];
    }

    function getFarmerProductIds()
        public
        view
        onlyRole(Role.Farmer)
        returns (uint256[] memory)
    {
        return farmerProducts[msg.sender];
    }

    // get contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    // purchase request store informtion address of manufacturer who requested for the specific product 


}