// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrderManagement {
    struct Order {
        uint256 id;
        address user;
        string status;
        string shippingAddress;
        string[] productSlugs;
        uint256 createdAt;
    }

    mapping(uint256 => Order) public orders;
    uint256 public orderCount;

    event OrderCreated(
        uint256 id,
        address user,
        string status,
        string shippingAddress,
        string[] productSlugs,
        uint256 createdAt
    );
    event OrderStatusUpdated(uint256 id, string status);

    function createOrder(
        address user,
        string memory shippingAddress,
        string[] memory productSlugs
    ) public returns (uint256) {
        orderCount++;
        orders[orderCount] = Order(
            orderCount,
            user,
            "Pending",
            shippingAddress,
            productSlugs,
            block.timestamp
        );
        emit OrderCreated(
            orderCount,
            user,
            "Pending",
            shippingAddress,
            productSlugs,
            block.timestamp
        );
        return orderCount;
    }

    function updateOrderStatus(uint256 id, string memory status) public {
        require(orders[id].id != 0, "Order does not exist");
        orders[id].status = status;
        emit OrderStatusUpdated(id, status);
    }

    function getOrder(uint256 id) public view returns (Order memory) {
        require(orders[id].id != 0, "Order does not exist");
        return orders[id];
    }
}
