const OrderManagement = artifacts.require("OrderManagement");

module.exports = function (deployer) {
  deployer.deploy(OrderManagement);
};