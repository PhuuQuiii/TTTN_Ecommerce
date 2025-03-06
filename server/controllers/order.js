const User = require("../models/User");
const Admin = require("../models/Admin");
const Payment = require("../models/Payment");
const Dispatcher = require("../models/Dispatcher");
const Address = require("../models/Address");
const Remark = require("../models/Remark");
const Cart = require("../models/Cart")
const Category = require("../models/Category");
const Product = require("../models/Product");
const ProductBrand = require("../models/ProductBrand");
const ProductImages = require("../models/ProductImages");
const Order = require("../models/Order");
const { calculateDistance } = require("../middleware/helpers");
// const sharp = require("sharp");
// const shortid = require("shortid");
// const path = require("path");
const moment = require("moment")
// const fs = require("fs");
const _ = require("lodash");
const Fawn = require("fawn");
const { allOrderStatus } = require("../middleware/common");
const task = Fawn.Task();
const mongoose = require("mongoose");
Fawn.init(mongoose);

const paypal = require('@paypal/checkout-server-sdk'); // SDK của PayPal để thao tác với API thanh toán
const client = require('../utils/paypal.js'); // Import file cấu hình PayPal Client

const perPage = 10;

exports.order = async (req, res, next) => {
  const order = await Order.findById(req.params.order_id)
    .populate("user", "-password -salt -resetPasswordLink -emailVerifyLink")
    .populate("payment", "-user -order")
  //   .populate(
  //     "product",
  //     "_id slug name slug category brand return isVerified isDeleted warranty quantity"
  // )
  .populate({
    path: "product",
    select: "name slug images price discountRate _id category brand return isVerified isDeleted warranty quantity",
    populate: {
      path: "images",
      model: "productimages",
    },
  })
    .populate({
      path: "soldBy",
      select:"name shopName address isVerified isBlocked holidayMode photo email",
      populate: {
        path: "adminWareHouse",
        model: "adminwarehouse",
      },
    })
    .populate({
      path: "status.cancelledDetail.remark",
      model: "remark",
      match:{
        isDeleted:null
      }
    })
    //not working..
    // .populate({
    //     path: 'status.cancelledDetail.cancelledBy',
    //     model: 'admin',
    //     select: 'name email phoneno'
    // })
    .populate({
      path: "status.cancelledDetail.cancelledBy",
      model: "user",
      select: "name email",
    })
    .populate({
      path: "status.dispatchedDetail.dispatchedBy",
      model: "dispatcher",
      select: "name email address phone",
    })
    .populate({
      path: "status.returnedDetail.returneddBy",
      model: "dispatcher",
      select: "name email address phone",
    })
    .populate({
      path: "status.returnedDetail.remark",
      model: "remark",
      match: {
        isDeleted: null
      }
    });
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  req.order = order;
  next();
};

exports.userOrder = async(req, res) => {
  let order = req.order;

  if (order.user._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: "Unauthorized User." });
  }
  order.soldBy = undefined;
  order.status.returnedDetail.returneddBy = undefined;
  order.status.dispatchedDetail.dispatchedBy = undefined;
  order.product.isVerified = undefined;
  order.product.isDeleted = undefined;
  res.json(order);
};

exports.adminOrder = (req, res) => {
  let order = req.order;
  if (order.soldBy._id.toString() !== req.profile._id.toString()) {
    return res.status(401).json({ error: "Unauthorized Admin." });
  }
  order.soldBy = order.soldBy._id;
  res.json(order);
};

exports.dispatcherOrder = (req, res) => {
  let order = req.order;
  res.json(order);
};

exports.calculateShippingCharge = async (req, res) => {
  const superadmin = await Admin.findOne({ role: "superadmin" });
  if (!superadmin) {
    return res.status(404).json({ error: "Cannot find shipping rate" });
  }
  const shippingAddress = await Address.findOne({
    user: req.user._id,
    isActive: { $ne: null },
  });
  if (!shippingAddress) {
    return res
      .status(404)
      .json({ error: "Cannot found shipping address of the user." });
  }
  //calculate no of different admins of all products
  let products = await Product.find({
    slug: req.body.p_slugs, isVerified: { $ne: null },
    isDeleted: null,}).populate('soldBy','shopName')
  if (products.length !== req.body.p_slugs.length) {
    return res.status(404).json({error:'Products not found.'})
  }

  let noOfAdmins = products.map(p=>p.soldBy.shopName)
  noOfAdmins = [... new Set(noOfAdmins)].length || 1
  
  if (shippingAddress.geolocation !== undefined) {
    const shippingRate = superadmin.shippingRate;
    const systemGeoCoordinates = superadmin.geolocation.coordinates;
    const userGeoCoordinates = shippingAddress.geolocation.coordinates;
    const distance = calculateDistance(
      systemGeoCoordinates[0],
      systemGeoCoordinates[1],
      userGeoCoordinates[0],
      userGeoCoordinates[1]
    );
    let shippingCharge = distance * shippingRate * noOfAdmins;
    shippingCharge = Math.round(shippingCharge);
    if (shippingCharge < 10) {
      return res.json(10);
    }
    if( shippingCharge > 80) return res.json(80) 
    let rem = shippingCharge % 10;
    if (rem < 3) return res.json(shippingCharge - rem);
    if (rem < 7) return res.json(shippingCharge - rem + 5);
    if (rem >= 7) return res.json(shippingCharge + (10 - rem));
  } else {
    return res.json(superadmin.shippingCost);
  }
};

exports.createOrder = async (req, res) => {
  const { products, shipto, shippingCharge, method } = req.body; // Lấy dữ liệu từ request body

  // Validate address
  if (!shipto.region || !shipto.area || !shipto.city || !shipto.address || !shipto.phoneno) {
    return res.status(403).json({ error: "Address fields are required." });
  }

  // Validate products
  let p_slugs = products.map(p => p.p_slug);
  let Products = await Product.find({
    slug: p_slugs,
    isVerified: { $ne: null },
    isDeleted: null,
  }).populate("soldBy", "isBlocked isVerified holidayMode");

  if (Products.length !== p_slugs.length) {
    return res.status(404).json({ error: 'Products not found.' });
  }
  if (products.find(p => p.quantity === undefined || +p.quantity < 1)) {
    return res.status(403).json({ error: 'Product quantity is required.' });
  }

  // Validate each product
  let error;
  const isAdminOnHoliday = (first, last) => {
    let week = [0, 1, 2, 3, 4, 5, 6];
    let firstIndex = week.indexOf(first);
    week = week.concat(week.splice(0, firstIndex));
    let lastIndex = week.indexOf(last);
    return week.slice(0, lastIndex + 1).some(d => d === new Date().getDay());
  };
  for (let i = 0; i < Products.length; i++) {
    const product = Products[i];
    if (product.soldBy.isBlocked || !product.soldBy.isVerified) {
      error = `Seller not available of product ${product.name}`;
      break;
    }
    if (isAdminOnHoliday(product.soldBy.holidayMode.start, product.soldBy.holidayMode.end)) {
      error = `Seller is on holiday of product ${product.name}. Please order manually`;
      break;
    }
    if (product.quantity < products.find(p => p.p_slug === product.slug).quantity) {
      error = `There are only ${product.quantity} quantity of product ${product.name} available.`;
      break;
    }
  }
  if (error) {
    return res.status(403).json({ error });
  }

  // Create PayPal order
  const PaypalClient = client();
  const request = new paypal.orders.OrdersCreateRequest();
  request.headers['prefer'] = 'return=representation';
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: shippingCharge // Assuming shippingCharge is the total amount
      }
    }],
  });

  try {
    const paypalResponse = await PaypalClient.execute(request);
    const orderID = paypalResponse.result.id;

    // Capture PayPal order( Xác minh thanh toán Paypal)
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID);
    captureRequest.requestBody({});
    const captureResponse = await PaypalClient.execute(captureRequest);

    if (captureResponse.result.status !== 'COMPLETED') {
      return res.status(500).json({ message: 'Payment not completed' });
    }

    // Create orders
    Products = products.map(async product => {
      let thisProduct = Products.find(p => p.slug === product.p_slug);
      const newOrder = new Order();
      newOrder.orderID = orderID;
      newOrder.user = req.user._id;
      newOrder.product = thisProduct._id;
      newOrder.soldBy = thisProduct.soldBy;
      newOrder.quantity = product.quantity;
      newOrder.productAttributes = product.productAttributes;
      newOrder.shipto = {
        region: shipto.region,
        city: shipto.city,
        area: shipto.area,
        address: shipto.address,
        phoneno: shipto.phoneno,
      };
      if (shipto.lat && shipto.long) {
        let geolocation = {
          type: "Point",
          coordinates: [shipto.long, shipto.lat],
        };
        newOrder.shipto.geolocation = geolocation;
      }
      const status = {
        currentStatus: "active",
        activeDate: Date.now(),
      };
      newOrder.status = status;
      newOrder.isPaid = true; // Đặt isPaid là true khi thanh toán thành công

      const newPayment = new Payment({
        user: req.user._id,
        order: newOrder._id,
        method: method,
        shippingCharge: shippingCharge,
        transactionCode: orderID,
        amount: Math.round(
          (thisProduct.price - thisProduct.price * (thisProduct.discountRate / 100)) *
          newOrder.quantity
        ),
        from: req.user.phone,
      });
      newOrder.payment = newPayment._id;

      let cart = await Cart.findOne({ product: thisProduct._id, user: req.user._id, isDeleted: null });
      if (cart) {
        let updateCart = cart.toObject();
        updateCart.isDeleted = Date.now();
        task.update(cart, updateCart).options({ viaSave: true });
      }

      const results = await task
        .save(newOrder)
        .save(newPayment)
        .run({ useMongoose: true });
      return { order: results[1], payment: results[2] };
    });

    Products = await Promise.all(Products);

    res.json({ orderID, Products });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const search_orders = async (page, perPage, keyword = '', query, res, type) => {
    let populateUser = {
        path: `${type}`,
        select: type==='user'? 'name': 'shopName'
    }
    let sortFactor = { createdAt: 'desc' };
    let orders = await Order.find(query)
        .populate({
            path: 'product',
            match: {
                name: { $regex: keyword, $options: "i" }
            },
            select: 'name slug images price',
            populate: {
                path: "images",
                model: "productimages",
            }
        })
        .populate(populateUser)
        .lean()
        .sort(sortFactor)
    orders = orders.filter(o => o.product !== null)
    let totalCount = orders.length
    orders = _.drop(orders, perPage * page - perPage)
    orders = _.take(orders, perPage)
    return res.json({ orders, totalCount });
}

exports.userOrders = async (req, res) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;
  const status = req.query.status;
const keyword = req.query.keyword
  let query = { user: req.user._id };
  if (
    status &&
    (status === "active" ||
      status === "cancel" ||
      status === "return" ||
      status === "complete" ||
      status === "tobereturned" ||
      status === "approve" ||
      status === "dispatch")
  )
    query = {
      ...query,
      "status.currentStatus": status,
    };
    if (keyword) return await search_orders(page, perPage, keyword, query, res ,'soldBy')
  let orders = await Order.find(query)
    .populate({
      path: "product",
      select: "name slug images price",
      populate: {
        path: "images",
        model: "productimages",
      },
    })
    .populate("soldBy", "shopName")
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean()
    .sort({ createdAt: -1 });
  // if (!orders.length) {
  //     return res.status(404).json({error: "No orders found"})
  // }
  const totalCount = await Order.countDocuments(query);
  res.json({ orders, totalCount });
};

exports.adminOrders = async (req, res) => {
  // let order = await Order.findById("5fcc61076d6b1d0f6881f1bf")
  // order.status.activeDate = Date.now()
  // order.status.approvedDate = Date.now()
  // order.status.dispatchedDetail = {
  //   dispatchedDate: Date.now(),
  //   dispatchedBy: "5efcb72e0ab8ab4dd0aa6b34"
  // }
  // order.status.completedDate = Date.now()
  // await order.save()
  // return res.json(order)
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;
  const status = req.query.status;
    const keyword = req.query.keyword
  let query = { soldBy: req.profile._id };
  if (
    status &&
    (status === "tobereturned" ||
      status === "dispatch" ||
      status === "approve" ||
      status === "active" ||
      status === "cancel" ||
      status === "return" ||
      status === "complete")
  )
    query = {
      ...query,
      "status.currentStatus": status,
    };
    if (keyword) return await search_orders(page, perPage, keyword, query, res, 'user')
  let orders = await Order.find(query)
      .populate({
          path: "product",
          select: "name slug images price",
          populate: {
              path: "images",
              model: "productimages",
          },
      })
      .populate("user", "name")
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean()
    .sort({ createdAt: -1 });
  // if (!orders.length) {
  //     return res.status(404).json({ error: "No orders found" })
  // }
  const totalCount = await Order.countDocuments(query);
  res.json({ orders, totalCount });
};

exports.toggleOrderApproval = async (req, res) => {
  let order = req.order;
  if (order.soldBy._id.toString() !== req.profile._id.toString()) {
    return res.status(401).json({ error: "Unauthorized Admin" });
  }
  if (
    order.status.currentStatus !== "active" &&
    order.status.currentStatus !== "approve"
  ) {
    return res.status(403).json({
      error: `This order cannot be approve or activate. Order current status is ${order.status.currentStatus}`,
    });
  }
  const product = await Product.findById(order.product)
  const updateProduct = product.toObject()

  let neworder = await Order.findById(order._id)
  let updateOrder = neworder.toObject()

  if (order.status.currentStatus === "active") {
    updateOrder.status.currentStatus = "approve";
    updateOrder.status.approvedDate = Date.now();
    updateProduct.quantity = updateProduct.quantity-order.quantity
    if (updateProduct.quantity<1) {
      return res.status(403).json({error:"Cannot approve!, product is out of stock."})
    }
    updateProduct.noOfSoldOut += order.quantity
    //change trendingScore
    const today = moment();
    const createdDay = moment(product.createdAt);
    const daysDiff = today.diff(createdDay, 'days');
    updateProduct.trendingScore = updateProduct.noOfSoldOut / daysDiff
    const results = await task
      .update(neworder, updateOrder)
      .options({ viaSave: true })
      .update(product, updateProduct)
      .options({ viaSave: true })
      .run({ useMongoose: true });
    // return { order: results[0] }
    // await order.save();
    //for response
    order = order.toObject()
    order.status.currentStatus = updateOrder.status.currentStatus
    order.status.approvedDate = updateOrder.status.approvedDate
    order.soldBy = order.soldBy._id
    return res.json(order);
  }
  if (order.status.currentStatus === "approve") {
    updateOrder.status.currentStatus = "active";
    updateOrder.status.approvedDate = null;
    updateProduct.quantity = updateProduct.quantity + order.quantity
    updateProduct.noOfSoldOut = updateProduct.noOfSoldOut === 0 ? 0 : updateProduct.noOfSoldOut - order.quantity
    //change trendingScore
    const today = moment();
    const createdDay = moment(product.createdAt);
    const daysDiff = today.diff(createdDay, 'days');
    updateProduct.trendingScore = updateProduct.noOfSoldOut / daysDiff
    const results = await task
      .update(neworder, updateOrder)
      .options({ viaSave: true })
      .update(product, updateProduct)
      .options({ viaSave: true })
      .run({ useMongoose: true });
    // return { order: results[0] }
    // await order.save();
    //for response
    order = order.toObject()
    order.status.currentStatus = updateOrder.status.currentStatus
    order.status.approvedDate = updateOrder.status.approvedDate
    order.soldBy = order.soldBy._id
    return res.json(order);
  }
};

exports.orderCancelByAdmin = async (req, res) => {
  let order = req.order;
  if (!req.body.remark) {
    return res.status(403).json({ error: "Remark is required." });
  }
  if (order.soldBy._id.toString() !== req.profile._id.toString()) {
    return res.status(401).json({ error: "Unauthorized Admin" });
  }
  if (order.status.currentStatus === "cancel") {
    return res.status(403).json({ error: "Order has already been cancelled." });
  }
  if (
    order.status.currentStatus !== "active" &&
    order.status.currentStatus !== "approve"
  ) {
    return res.status(403).json({
      error: `This order is in ${order.status.currentStatus} state, cannot be cancelled.`,
    });
  }
  const newRemark = new Remark({ 
    comment: req.body.remark 
  });
  let updateOrder = order.toObject();
  updateOrder.status.currentStatus = "cancel";
  updateOrder.status.cancelledDetail.cancelledDate = Date.now();
  updateOrder.status.cancelledDetail.cancelledBy = req.profile._id
  updateOrder.status.cancelledDetail.remark = newRemark._id

  let product = await Product.findById(order.product._id);
  let updateProduct = product.toObject();
  updateProduct.quantity = order.quantity + product.quantity;
  updateProduct.noOfSoldOut = updateProduct.noOfSoldOut === 0 ? 0 : updateProduct.noOfSoldOut - order.quantity
  //change trendingScore
  const today = moment();
  const createdDay = moment(product.createdAt);
  const daysDiff = today.diff(createdDay, 'days');
  updateProduct.trendingScore = updateProduct.noOfSoldOut / daysDiff

  let results = await task
    .save(newRemark)
    .update(order, updateOrder)
    .options({ viaSave: true })
    .update(product, updateProduct)
    .options({ viaSave: true })
    .run({ useMongoose: true });
  // return res.json(results);
    order.status.currentStatus = updateOrder.status.currentStatus
    order.status.cancelledDetail.cancelledDate = updateOrder.status.cancelledDetail.cancelledDate;
    const cancelledBy = {
      _id: req.profile._id,
      name: req.profile.name,
      phone: req.profile.phone
    };
    order = order.toObject()
    order.status.cancelledDetail.cancelledBy = cancelledBy
    order.status.cancelledDetail.remark = newRemark;
    order.soldBy = order.soldBy._id
    console.log(req.profile.name)
    console.log(order.status.cancelledDetail)
    return res.json(order);
};

exports.orderCancelByUser = async (req, res) => {
  let order = req.order;
  if (!req.body.remark) {
    return res.status(403).json({ error: "Remark is required." });
  }
  if (order.user._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: "Unauthorized User" });
  }
  if (order.status.currentStatus === "cancel") {
    return res.status(403).json({ error: "Order has already been cancelled." });
  }
  if (
    order.status.currentStatus !== "active" &&
    order.status.currentStatus !== "approve"
    ) {
    return res.status(403).json({
      error: `This order is in ${order.status.currentStatus} state, cannot be cancelled.`,
    });
  }
  const newRemark = new Remark({ comment: req.body.remark});
  let updateOrder = order.toObject();
  updateOrder.status.currentStatus = "cancel";
  updateOrder.status.cancelledDetail.cancelledDate = Date.now();
  updateOrder.status.cancelledDetail.cancelledBy = req.user._id
  updateOrder.status.cancelledDetail.remark = newRemark._id

  let product = await Product.findById(order.product._id);
  let updateProduct = product.toObject();
  updateProduct.quantity = order.quantity + product.quantity;
  updateProduct.noOfSoldOut = updateProduct.noOfSoldOut === 0 ? 0 : updateProduct.noOfSoldOut - order.quantity
  //change trendingScore
  const today = moment();
  const createdDay = moment(product.createdAt);
  const daysDiff = today.diff(createdDay, 'days');
  updateProduct.trendingScore = updateProduct.noOfSoldOut / daysDiff

  let results = await task
    .save(newRemark)
    .update(order, updateOrder)
    .options({ viaSave: true })
    .update(product, updateProduct)
    .options({ viaSave: true })
    .run({ useMongoose: true });
  results[1].soldBy = undefined;
  results[1].user = undefined;
  return res.json(results);
};

exports.toggleDispatchOrder = async (req, res) => {
  let order = req.order;
  if (
    order.status.currentStatus !== "approve" &&
    order.status.currentStatus !== "dispatch"
  ) {
    return res.status(403).json({
      error: `This order cannot be dispatched or rollback to approve state. Order current status is ${order.status.currentStatus}`,
    });
  }
  if (order.status.currentStatus === "approve") {
    order.status.currentStatus = "dispatch";
    order.status.dispatchedDetail = {
      dispatchedDate: Date.now(),
      dispatchedBy: req.dispatcher._id,
    };
    await order.save();
    return res.json(order);
  }
  if (
    order.status.dispatchedDetail.dispatchedBy._id.toString() !==
    req.dispatcher._id.toString()
  ) {
    return res.status(401).json({ error: `Unauthorized Dispatcher.` });
  }
  if (order.status.currentStatus === "dispatch") {
    order.status.currentStatus = "approve";
    order.status.dispatchedDetail = {
      dispatchedDate: null,
      dispatchedBy: undefined,
    };
    await order.save();
    return res.json(order);
  }
};

exports.dispatcherOrders = async (req, res) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;
  const status = req.query.status;
  let query = { "status.currentStatus": "approve" };
  if (status && status === "tobereturned")
    query = { "status.currentStatus": status };
  let orders = await Order.find(query)
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean()
    .sort({ createdAt: -1 });
  // if (!orders.length) {
  //     return res.status(404).json({error: "No orders are ready to ship."})
  // }
  const totalCount = await Order.countDocuments(query);
  res.json({ orders, totalCount });
};

exports.toggleCompleteOrder = async (req, res) => {
  let order = req.order;
  if (
    order.status.currentStatus !== "complete" &&
    order.status.currentStatus !== "dispatch"
  ) {
    return res.status(403).json({
      error: `This order cannot be completed or rollback to dispatch state. Order current status is ${order.status.currentStatus}`,
    });
  }
  if (order.status.currentStatus === "dispatch") {
    order.status.currentStatus = "complete";
    order.status.completedDate = Date.now();
    order.isPaid = true;
    await order.save();
    return res.json(order);
  }
  if (order.status.currentStatus === "complete") {
    order.status.currentStatus = "dispatch";
    order.status.completedDate = null;
    order.isPaid = false;
    await order.save();
    return res.json(order);
  }
};

exports.returnOrder = async (req, res) => {
  let order = req.order;
  if (order.status.currentStatus !== "tobereturned") {
    return res.status(403).json({
      error: `This order cannot be returned. Order current status is ${order.status.currentStatus}`,
    });
  }
  // const newRemark = new Remark({ comment: req.body.remark });

  let updateOrder = order.toObject();
  updateOrder.status.currentStatus = "return";
  updateOrder.status.returnedDetail.returnedDate = Date.now();
  // updateOrder.status.returnedDetail.remark = newRemark._id;
  updateOrder.status.returnedDetail.returneddBy = req.dispatcher._id;
  // let product = await Product.findById(order.product._id);
  // let updateProduct = product.toObject();

  let results = await task
    // .save(newRemark)
    .update(order, updateOrder)
    .options({ viaSave: true })
    // .update(product, updateProduct)
    // .options({ viaSave: true })
    .run({ useMongoose: true });
  return res.json(results);
};

exports.toggletobeReturnOrder = async (req, res) => { // Hàm toggletobeReturnOrder cho phép cập nhật trạng thái của một đơn hàng (order) giữa hai trạng thái "complete" (hoàn thành) và "tobereturned" (chuẩn bị hoàn trả
  let order = req.order;
  if ( // Kiểm tra trạng thái đơn hàng
    order.status.currentStatus !== "complete" &&
    order.status.currentStatus !== "tobereturned"
  ) {
    return res.status(403).json({
      error: `This order is not ready to return or rollback to complete state. Order current status is ${order.status.currentStatus}`,
    });
  }
  let updateOrder = await Order.findById(order._id) // Lấy dữ liệu đơn hàng và thanh toán
  updateOrder = updateOrder.toObject();
  let payment = await Payment.findById(order.payment._id);
  let updatePayment = payment.toObject();

  if (order.status.currentStatus === "complete") { //  Chuyển đơn hàng từ "complete" → "tobereturned"   
    if (!req.body.remark) {
      return res.status(403).json({error: "Remark is required."}) // Bắt buộc nhập lý do (remark) nếu chuyển sang trạng thái "tobereturned"
    }

    updateOrder.status.currentStatus = "tobereturned";
    updateOrder.status.tobereturnedDate = Date.now();
    
    let remark = new Remark({ // Tạo một đối tượng ghi chú (Remark) để lưu lại lý do khách hàng muốn trả hàng.
      comment:req.body.remark
    })
    updateOrder.status.returnedDetail.remark.push(remark._id)

    updatePayment.returnedAmount = req.body.returnedAmount; // Cập nhật số tiền hoàn trả (returnedAmount) trong đối tượng thanh toán

    let results = await task // Lưu thay đổi vào database
      .update(order, updateOrder)
      .options({ viaSave: true })
      .update(payment, updatePayment)
      .options({ viaSave: true })
      .save(remark)
      .run({ useMongoose: true });
    // return res.redirect(`/api/admin-order/${req.profile._id}/${order._id}`)
    // return res.json(results);
    order = order.toObject()
    order.status.currentStatus = updateOrder.status.currentStatus
    order.status.tobereturnedDate = updateOrder.status.tobereturnedDate
    order.soldBy = order.soldBy._id
    return res.json(order); // Trả về kết quả sau khi cập nhật
  }
  if (order.status.currentStatus === "tobereturned") { // Chuyển đơn hàng từ "tobereturned" → "complete"
    updateOrder.status.currentStatus = "complete";
    updateOrder.status.tobereturnedDate = null;
    let remark = await Remark.findById(order.status.returnedDetail.remark[0])
    let updateRemark = remark.toObject()
    updateRemark.isDeleted = Date.now() // Xóa ghi chú hoàn trả (Remark) bằng cách đánh dấu là isDeleted
    updatePayment.returnedAmount = undefined; // Xóa số tiền hoàn trả (returnedAmount)

    let results = await task // Lưu thay đổi vào database
      .update(order, updateOrder) 
      .options({ viaSave: true })
      .update(payment, updatePayment)
      .options({ viaSave: true })
      .update(remark, updateRemark)
      .options({ viaSave: true })
      .run({ useMongoose: true });
    // return res.redirect(`/api/admin-order/${req.profile._id}/${order._id}`)
    // return res.json(results);
    order = order.toObject()
    order.status.currentStatus = updateOrder.status.currentStatus
    order.status.tobereturnedDate = updateOrder.status.tobereturnedDate
    order.soldBy = order.soldBy._id
    return res.json(order);
  }
};

exports.getOrderStatus = async (req, res) => {
  res.json(allOrderStatus);
};

exports.editOrderQuantity = async (req, res) => { // Sử dụng để chỉnh sửa số lượng sản phẩm trong một đơn hàng (order)
  let order = req.order; // Nhận đơn hàng từ request

  console.log("Current Status:", order.status.currentStatus);
console.log("Type:", typeof order.status.currentStatus);


  if (order.status.currentStatus !== "active") { //  Đơn hàng đang trong trạng thái active mới được chỉnh sửa số lượng.
    return res.status(403).json({ error: "User cannot update quantity." });
  }

  let payment = await Payment.findById(order.payment._id);
  if (!payment) {
    return res.status(404).json({ error: "Payment record not found." });
  }

  let newQuantity = parseInt(req.query.newQuantity, 10); // Kiểm tra và chuyển đổi số lượng mới
  if (isNaN(newQuantity) || newQuantity <= 0) {
    return res.status(400).json({ error: "Invalid quantity value." });
  }

  let newAmount = Math.round( // Tính toán lại số tiền cần thanh toán
    (order.product.price - order.product.price * (order.product.discountRate / 100)) * newQuantity
  );

  try {
    let updatedOrder = await Order.updateOne(
        { _id: order._id },
        { $set: { quantity: newQuantity } }
    );

    let updatedPayment = await Payment.updateOne(
        { _id: payment._id },
        { $set: { amount: newAmount } }
    );

    res.json({ order: updatedOrder, payment: updatedPayment });
} catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Lỗi cập nhật đơn hàng." });
}

  res.json({ order: results[1], payment: results[0] });
};