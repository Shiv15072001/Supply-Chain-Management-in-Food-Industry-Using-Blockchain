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
    //processing enum
    enum Stage {
        NOT_ACCEPTED,
        PENDING_APPROVAL,
        ACCEPTED,
        IN_TRANSIT,
        DELIVERED
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

    // struct Processing {
    //     uint256 productId;
    //     uint256 processingDate;
    //     string methods;
    //     string additives;
    //     uint256 price;
    //     bool isShipped; // Flag to check if the product is shipped
    //     address manufacturer;
    // }

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
    mapping(address => uint256[]) private farmerProducts;
    Product[] private allProducts; // This is for storing the product added by the farmer
    mapping(uint256 => uint256) private productIdToIndex;
    //Using of mapping to store the product id and its index in the array allProducts for effiecent search
    // mapping(uint256 => address) public purchaseRequests; // productId => manufacturer address
    //  Store the manufacturer who requested purchase for each productId
    mapping(uint256 => address) public purchaseRequests;
    //
    // Map product ID to final manufacturer after successful confirmDelivery
    mapping(uint256 => address) public productToManufacturer;
    // Mapping from productId to manufacturer (already exists in your Processing struct)
    mapping(address => uint256[]) private manufacturerToProcessedIds;
    //
    Processing[] private processedProductsList; // This is for storing the processed product by the manufacturer to view by the supplier

    uint256 public productCount;
    uint256 public shipmentCount;
    uint256 public inventoryCount;

    event UserRegistered(address indexed user, Role role);
    event ProductAdded(uint256 id, string cropType, address farmer);
    event PurchaseRequested(
        uint256 productId,
        address manufacturer,
        uint256 amount
    );
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

    function requestPurchase(
        uint256 _productId
    ) public payable onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];

        require(product.price > 0, "Product does not exist");
        require(!product.isSold, "Product already sold");
        require(
            purchaseRequests[_productId] == address(0),
            "Product already requested by another manufacturer!"
        );
        require(msg.value >= product.price, "Insufficient payment");

        purchaseRequests[_productId] = msg.sender;

        emit PurchaseRequested(_productId, msg.sender, msg.value);
    }

    /// @notice Manufacturer confirms delivery and validates temperature
    function confirmDelivery(
        uint256 _productId,
        uint256 recordedTemperature
    ) public onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];

        require(!product.isSold, "Product already sold");
        // Check that the manufacturer who requested can confirm
        require(
            purchaseRequests[_productId] == msg.sender,
            "Unauthorized confirmation!"
        );
        require(
            recordedTemperature == product.temperature,
            "Temperature mismatch"
        );

        product.isSold = true;

        // if (address(this).balance >= product.price) {
        payable(product.farmer).transfer(product.price);
        // }

        uint256 index = productIdToIndex[_productId];
        allProducts[index].isSold = true;
        //

        //  Store permanent manufacturer after confirmation
        productToManufacturer[_productId] = msg.sender;

        // Clean up after success to save gas
        delete purchaseRequests[_productId];

        emit PaymentReleased(_productId, product.farmer, product.price);
    }

    /// @notice Manufacturer processes the product
    function processProduct(
        uint256 _productId,
        uint256 _processingDate,
        string memory _methods,
        string memory _additives,
        uint256 _price
    ) public onlyRole(Role.Manufacturer) {
        Product storage product = products[_productId];
        require(product.isSold, "Product must be purchased first");
        require(
            productToManufacturer[_productId] == msg.sender,
            "Unauthorized: Only purchasing manufacturer can process"
        );

        require(
            processedProducts[_productId].manufacturer == address(0),
            "Product already processed!"
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

        // Track which product this manufacturer processed
        manufacturerToProcessedIds[msg.sender].push(_productId);

        processedProductsList.push(processedProducts[_productId]); // Store the processed product in the list for supplier view
    }

    /// @notice Supplier logs shipment details
    function requestToShip(
        uint256 _productId
    ) external onlyRole(Role.Supplier) {
        Processing storage prod = processedProducts[_productId];
        require(
            prod.shipmentStatus == Stage.NOT_ACCEPTED,
            "Already requested!"
        );
        prod.supplier = msg.sender;
        prod.shipmentStatus = Stage.PENDING_APPROVAL;

        // emit SupplierRequested(_productId, msg.sender);
    }

    function acceptSupplier(
        uint256 _productId
    ) external onlyRole(Role.Manufacturer) {
        Processing storage prod = processedProducts[_productId];
        require(prod.manufacturer == msg.sender, "Not your product!");
        require(
            prod.shipmentStatus == Stage.PENDING_APPROVAL,
            "No supplier to accept"
        );

        prod.shipmentStatus = Stage.ACCEPTED;

        // emit SupplierAccepted(_productId, prod.supplier);
    }

    function startShipment(
        uint256 _productId,
        address _retailer
    ) external onlyRole(Role.Supplier) {
        Processing storage prod = processedProducts[_productId];
        require(prod.supplier == msg.sender, "Not authorized");
        require(
            prod.shipmentStatus == Stage.ACCEPTED,
            "Shipment not accepted yet!"
        );

        prod.retailer = _retailer;
        prod.pickupTime = block.timestamp;
        prod.shipmentStatus = Stage.IN_TRANSIT;

        // emit ShipmentStarted(_productId, _retailer);
    }

    function completeShipment(
        uint256 _productId
    ) external onlyRole(Role.Retailer) {
        Processing storage prod = processedProducts[_productId];
        require(prod.retailer == msg.sender, "Not your shipment!");
        require(
            prod.shipmentStatus == Stage.IN_TRANSIT,
            "Shipment not in transit!"
        );

        prod.deliveryTime = block.timestamp;
        prod.shipmentStatus = Stage.DELIVERED;

        // emit ShipmentCompleted(_productId, msg.sender);
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

    function getMyProcessedProductIds()
        public
        view
        onlyRole(Role.Manufacturer)
        returns (uint256[] memory)
    {
        return manufacturerToProcessedIds[msg.sender];
    }

    function getProcessingDetails(
        uint256 _productId
    ) public view returns (Processing memory) {
        Processing memory info = processedProducts[_productId];
        require(info.manufacturer == msg.sender, "Unauthorized access");
        return info;
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

    // get Processedproduct view by the Supplier
    function getProcessedProductsList()
        public
        view
        onlyRole(Role.Supplier)
        returns (Processing[] memory)
    {
        return processedProductsList;
    }

    // get contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    // purchase request store informtion address of manufacturer who requested for the specific product
}
