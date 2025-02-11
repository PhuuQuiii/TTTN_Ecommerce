const Admin = require("../models/Admin");
const Category = require("../models/Category");
const Product = require("../models/Product");
const SuggestKeywords = require("../models/SuggestKeywords");
const Cart = require("../models/Cart");
const Review = require("../models/Review");
const Order = require("../models/Order");
const Whislist = require("../models/WishList");
const ProductBrand = require("../models/ProductBrand");
const ProductImages = require("../models/ProductImages");
const userHas = require("../middleware/user_actions/userHas");
const getRatingInfo = require("../middleware/user_actions/getRatingInfo");
const _ = require("lodash");
const Fawn = require("fawn");
const { fileRemover, imageCompressor } = require("../middleware/helpers");
const task = Fawn.Task();

//  Lấy thông tin sản phẩm theo slug
exports.product = async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.p_slug })
    .populate("images", "-createdAt -updatedAt -__v")
    .populate("soldBy", "shopName address holidayMode")
    .populate("brand")
    .populate({
      path: "category",
      populate: {
        path: "parent",
        model: "category",
        populate: {
          path: "parent",
          model: "category",
        },
      },
    });
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }
  req.product = product;
  next();
};

// Lấy thông tin chi tiết của một sản phẩm
exports.getProduct = async (req, res) => {
  let role = (req.authAdmin && req.authAdmin.role) || "user";
  if (role === "user" && (!req.product.isVerified || req.product.isDeleted)) {
    return res
      .status(404) // Không cho xem sản phẩm nếu sản phẩm chưa được xác minh hoặc đã bị xóa
      .json({ error: "Product is not verified or has been deleted." });
  }
  if (role === "admin" && req.product.isDeleted) {
    return res
      .status(404) // Không cho xem sản phẩm nếu sản phẩm đã bị xóa
      .json({ error: "Product has been deleted." });
  }
  //increament viewCount
  // !req.authAdmin && (req.product.viewsCount += 1)

  if (role === "user") {
    // Chỉ khi người dùng là user, số lượt xem mới tăng lên 1
    req.product.viewsCount += 1;
  }
  await req.product.save();
  //ratings of this product
  const product = req.product.toObject();
  product.stars = await getRatingInfo(req.product); // Tính toán xếp hạng (stars) của sản phẩm
  //user's action on this product
  if (req.authUser) {
    // Kiểm tra xem người dùng đã thực hiện hành động gì đối với sản phẩm này chưa
    const { hasBought, hasOnCart, hasOnWishlist, hasReviewed } = await userHas(
      req.product,
      req.authUser,
      "product"
    );
    product.hasOnCart = hasOnCart;
    product.hasBought = hasBought;
    product.hasOnWishlist = hasOnWishlist;
    product.hasReviewed = hasReviewed;
  }
  res.json({ product });
};

exports.createProduct = async (req, res) => {
  if (!req.profile.isVerified)
    // Chỉ cho phép Shop đã xác minh tạo sản phẩm
    return res.status(403).json({ error: "Admin is not verified" });

  if (req.admin.role !== "superadmin") {
    // Nếu shop không phải superadmin, thì xóa quyền cập nhật isFeatured và isVerified để tránh thao túng dữ liệu.
    req.body.isFeatured = undefined;
    req.body.isVerified = undefined;
  }

  if (req.admin.role === "superadmin") {
    // Superadmin có quyền đặt isFeatured (sản phẩm nổi bật) và isVerified (được xác minh)
    if (req.body.isFeatured) {
      req.body.isFeatured = Date.now();
    }
    req.body.isVerified = Date.now();
  }

  let newProduct = new Product(req.body); // Sản phẩm mới sẽ được gán vào shop đã tạo (soldBy = req.profile._id).
  newProduct.soldBy = req.profile._id;
  // save the product
  // with linking product to product images
  req.images.forEach((i) => {
    let updataImage = i.toObject();
    updataImage.productLink = newProduct._id; // Gán ID sản phẩm để liên kết với ảnh sản phẩm.
    task
      .update(i, updataImage) // Cập nhật dữ liệu ảnh
      .options({ viaSave: true });
  });
  await task.save(newProduct).run({ useMongoose: true });

  return res.json(newProduct);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.p_slug });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  product.isDeleted = Date.now();
  product.isVerified = null;
  product.isFeatured = null;
  product.isRejected = null;
  await product.save();
  // this.getProducts(req,res)
  res.json(product);
};

exports.productImages = async (req, res) => {
  if (!req.files.length) {
    return res.status(400).json({ error: "Product images are required" });
  }
  let files = [];
  if (!req.profile.isVerified) {
    // kiểm tra tài khoản shop đã được xác minh chưa
    files = req.files.map(({ filename }) => `public/uploads/${filename}`);
    fileRemover(files);
    return res.status(403).json({ error: "Admin is not verified" });
  }
  let images = req.files.map(async (file) => {
    // Xử lý ảnh tải lên và tạo ảnh nén
    const image = new ProductImages();
    const { filename, path: filepath, destination } = file;
    image.thumbnail = await imageCompressor(
      filename,
      80, // thumbnail (80px)
      filepath,
      destination,
      "productThumbnail"
    );
    image.medium = await imageCompressor(
      filename,
      540, // medium (540px)
      filepath,
      destination,
      "productMedium"
    );
    image.large = await imageCompressor(
      filename,
      800, // large (800px)
      filepath,
      destination,
      "productLarge"
    );
    // image.large = `productLarge/${filename}`
    // image.thumbnail = `productThumbnail/${filename}`
    // image.medium = `productMedium/${filename}`
    // remove image from public/uploads
    const Path = `public/uploads/${filename}`;
    files.push(Path);
    // fs.unlinkSync(Path);
    return await image.save();
    // return image
  });
  images = await Promise.all(images);
  fileRemover(files); // Xóa ảnh gốc sau khi đã nén & lưu
  res.json(images);
};

exports.deleteImage = async (req, res) => {
  let product = req.product;
  if (product.isVerified) {
    return res.status(403).json({
      error: "Cannot delete image. Product has already been verified.",
    });
  }
  let updateProduct = product.toObject();
  let imageFound;
  updateProduct.images = product.images.filter((image) => {
    if (image._id.toString() === req.query.image_id) imageFound = image;
    return image._id.toString() !== req.query.image_id;
  });
  if (!imageFound) {
    return res.status(404).json({ error: "Image not found" });
  }
  await task
    .update(product, updateProduct)
    .options({ viaSave: true })
    .remove(ProductImages, { _id: req.query.image_id })
    .run({ useMongoose: true });
  let files = [
    `public/uploads/${imageFound.thumbnail}`,
    `public/uploads/${imageFound.medium}`,
    `public/uploads/${imageFound.large}`,
  ];
  fileRemover(files);
  // let Path = `public/uploads/${imageFound.thumbnail}`;
  // fs.unlinkSync(Path);
  // Path = `public/uploads/${imageFound.medium}`;
  // fs.unlinkSync(Path);
  // Path = `public/uploads/${imageFound.large}`;
  // fs.unlinkSync(Path);
  res.json(updateProduct.images);
};

exports.deleteImageById = async (req, res) => {
  let image = await ProductImages.findByIdAndRemove(req.query.image_id);
  let files = [
    `public/uploads/${image.thumbnail}`,
    `public/uploads/${image.medium}`,
    `public/uploads/${image.large}`,
  ];
  fileRemover(files);
  // let Path = `public/uploads/${image.thumbnail}`;
  // fs.unlinkSync(Path);
  // Path = `public/uploads/${image.medium}`;
  // fs.unlinkSync(Path);
  // Path = `public/uploads/${image.large}`;
  // fs.unlinkSync(Path);
  res.json(image);
};

// Cho phép cập nhật thông tin sản phẩm, nhưng chỉ khi sản phẩm chưa được xác minh (isVerified = false hoặc null).
exports.updateProduct = async (req, res) => {
  let product = req.product;
  if (product.isVerified) {
    // Nếu sản phẩm đã được xác minh (isVerified = true), API sẽ từ chối cập nhật
    return res
      .status(403)
      .json({ error: "Cannot update. Product has already been verified." });
  }
  product = _.extend(product, req.body); // Gộp các thuộc tính từ obj2 vào obj1, giúp cập nhật sản phẩm mà không làm mất các trường khác.
  product.isRejected = null; // Xóa trạng thái bị từ chối (isRejected), có thể dùng để reset lại sản phẩm nếu trước đó bị từ chối.
  await product.save();
  res.json(product);
};

// Người bán có thể xem danh sách sản phẩm của họ, có thể tìm kiếm, lọc, sắp xếp theo nhiều tiêu chí, phân trang.
exports.getProducts = async (req, res) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;
  const { createdAt, updatedAt, price, status, keyword, outofstock } =
    req.query;

  let sortFactor = { createdAt: "desc" }; // Mặc định sắp xếp theo createdAt giảm dần
  if (createdAt && (createdAt === "asc" || createdAt === "desc"))
    sortFactor = { ...sortFactor, createdAt }; // asc: tăng dần và desc: giảm dần
  if (updatedAt && (updatedAt === "asc" || updatedAt === "desc"))
    sortFactor = { ...sortFactor, updatedAt };
  if (price && (price === "asc" || price === "desc"))
    sortFactor = { price: price === "asc" ? 1 : -1 }; // price được chuyển đổi sang số (1 là tăng dần, -1 là giảm dần).

  // Mặc định lọc các sản phẩm do người dùng (soldBy) hiện tại bán và chưa bị xoá (isDeleted: null).
  let query = { soldBy: req.profile._id, isDeleted: null };
  if (keyword)
    query = {
      ...query,
      name: { $regex: keyword, $options: "i" }, //  tìm các sản phẩm có tên chứa keyword
    };
  if (status && status === "verified")
    query = {
      // Lọc sản phẩm đã được xác minh
      ...query,
      isVerified: { $ne: null },
    };
  if (status && status === "unverified")
    query = {
      // Lọc sản phẩm chưa được xác minh
      ...query,
      isVerified: null,
    };
  if (status && status === "rejected")
    query = {
      // Lọc sản phẩm bị từ chối
      ...query,
      isRejected: { $ne: null },
    };
  // if (status && status === 'deleted') query = { // Lọc sản phẩm đã bị xoá
  //   ...query,
  //   isDeleted: { $ne: null }
  // }
  // if (status && status === 'notdeleted') query = { // Lọc sản phẩm chưa bị xoá
  //   ...query,
  //   isDeleted: null
  // }
  if (outofstock && outofstock === "yes")
    query = {
      // Lọc sản phẩm hết hàng (quantity = 0)
      ...query,
      quantity: 0,
    };
  let products = await Product.find(query)
    .populate("category", "displayName slug") //  Lấy thông tin displayName và slug của danh mục
    .populate("brand", "brandName slug")
    .populate("images", "-createdAt -updatedAt -__v") // Lấy tất cả ảnh trừ các trường createdAt, updatedAt, __v
    .skip(perPage * page - perPage) // Bỏ qua các sản phẩm trước đó để thực hiện phân trang
    .limit(perPage) // Giới hạn số lượng sản phẩm trên mỗi trang.
    .lean()
    .sort(sortFactor); // Áp dụng sắp xếp
  // if (price && (price === 'asc' || price === 'desc')) {
  //     products.sort((a, b) => {
  //       return price === 'asc' ? parseFloat(a.price) - parseFloat(b.price) : parseFloat(b.price) - parseFloat(a.price)
  //     })
  //   }
  //rating on each product
  // products = products.map(async p => {
  //   p.stars = await getRatingInfo(p)
  //   return p
  // })
  // products = await Promise.all(products)
  const totalCount = await Product.countDocuments(query); // Lấy tổng số sản phẩm thỏa mãn điều kiện lọc để dùng cho phân trang
  res.json({ products, totalCount });
};

// Lấy danh sách sản phẩm với nhiều tùy chọn lọc( quận/huyện, từ khóa ) và sắp xếp
exports.minedProducts = async (req, res) => {
  let page = +req.query.page || 1;
  let perPage = +req.query.perPage || 10;
  let sortFactor;
  let query = {
    // lấy những sản phẩm đã được xác thực và chưa bị xoá
    isVerified: { $ne: null },
    isDeleted: null,
  };
  if (req.header("district")) {
    // Lọc theo quận/huyện
    query = {
      ...query,
      availableDistricts: { $in: req.header("district") },
    };
  }
  // Tất cả lọc theo giảm dần
  if (req.query.keyword === "latest") {
    // Sắp xếp sản phẩm mới nhất
    sortFactor = { createdAt: "desc" };
  } else if (req.query.keyword === "featured") {
    // Lọc thêm những sản phẩm nổi bật
    sortFactor = { createdAt: "desc" };
    query = {
      ...query,
      isFeatured: { $ne: null },
    };
  } else if (req.query.keyword === "trending") {
    // Sắp xếp theo điểm xu hướng
    sortFactor = { trendingScore: -1 };
  } else if (req.query.keyword === "mostviewed") {
    // Sắp xếp theo số lượt xem
    sortFactor = { viewsCount: -1 };
  } else if (req.query.keyword === "topselling") {
    // Sắp xếp theo số lượng bán ra
    sortFactor = { noOfSoldOut: -1 };
  } else {
    return res.status(403).json({ error: "Invalid keyword." });
  }
  let products = await Product.find(query)
    .populate("category", "displayName slug")
    .populate("brand", "brandName slug")
    .populate("images", "-createdAt -updatedAt -__v")
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean()
    .sort(sortFactor);

  let totalCount = await Product.countDocuments(query); // Đếm tổng số sản phẩm phù hợp với query
  // if (totalCount > 50) totalCount = 50
  //user's action on each product

  if (req.authUser) {
    // Kiểm tra trạng thái sản phẩm trong giỏ hàng hoặc danh sách yêu thích
    products = products.map(async (p) => {
      //user's action on this product
      const { hasOnCart, hasOnWishlist } = await userHas(
        p,
        req.authUser,
        "products"
      );
      //ratings of this product
      // p.stars = await getRatingInfo(p)
      (p.hasOnCart = hasOnCart), (p.hasOnWishlist = hasOnWishlist);
      return p;
    });
    products = await Promise.all(products);
  }
  res.json({ products, totalCount });
};

// Gợi ý sản phẩm dựa trên lịch sử mua hàng và gợi ý sản phẩm cùng danh mục với những gì người dùng đã mua
exports.forYouProducts = async (req, res) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;
  const { createdAt, updatedAt, price } = req.query;
  let sortFactor = { createdAt: "desc" }; // Xác định tiêu chí sắp xếp
  if (createdAt && (createdAt === "asc" || createdAt === "desc"))
    sortFactor = { createdAt };
  if (updatedAt && (updatedAt === "asc" || updatedAt === "desc"))
    sortFactor = { updatedAt };
  if (price && (price === "asc" || price === "desc"))
    sortFactor = { price: price === "asc" ? 1 : -1 };
  const orders = await Order.find({ user: req.user._id }) // Lấy lịch sử mua hàng của người dùng
    .select("-_id product") //  get product list of order
    .populate({
      path: "product",
      select: "-_id category", // get category list of product
      populate: {
        path: "category",
        model: "category",
        select: "_id ",
        match: {
          isDisabled: null, // bị vô hiệu hóa
        },
        populate: {
          path: "parent",
          model: "category",
          select: "_id ",
          match: {
            isDisabled: null,
          },
          populate: {
            path: "parent", // Lấy cấp cha (parent) của danh mục (nếu có) để mở rộng phạm vi gợi ý
            model: "category",
            select: "_id ",
            match: {
              isDisabled: null,
            },
          },
        },
      },
    });
  let categories = []; // Xây dựng danh sách danh mục từ lịch sử mua hàng
  orders.forEach((o) => {
    o.product.category.forEach((cat) => {
      categories.push(cat._id); //i.e last layer
      cat.parent && categories.push(cat.parent._id); //i.e second layer
      // cat.parent.parent && categories.push(cat.parent.parent._id) //i.e first layer
    });
  });
  categories = [...new Set(categories)]; // Loại bỏ trùng lặp
  if (!categories.length) {
    return res.status(403).json({ error: "Categories not found." });
  }

  let query = { category: { $in: categories } }; // Tìm tất cả các sản phẩm thuộc danh mục mà người dùng đã từng mua
  if (req.header("district")) {
    // nếu có khu vực, lọc theo khu vực
    query = {
      ...query,
      availableDistricts: { $in: req.header("district") },
    };
  }

  let products = await Product.find(query)
    .populate("category", "displayName slug")
    .populate("brand", "brandName slug")
    .populate("images", "-createdAt -updatedAt -__v")
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean()
    .sort(sortFactor);
  const totalCount = await Product.countDocuments(query);

  //user's action on each product

  products = products.map(async (p) => {
    //user's action on this product
    const { hasOnCart, hasOnWishlist } = await userHas(p, req.user, "products");
    //ratings of this product
    // p.stars = await getRatingInfo(p)
    (p.hasOnCart = hasOnCart), (p.hasOnWishlist = hasOnWishlist);
    return p;
  });
  products = await Promise.all(products);
  res.json({ products, totalCount });
};

// Gợi ý từ khóa khi người dùng nhập một từ khóa vào trường tìm kiếm.( so sánh keyword với collection SuggestKeywords)
exports.suggestKeywords = async (req, res) => {
  let limits = +req.query.limits || 5;
  let suggestedKeywords = await SuggestKeywords.find({
    keyword: { $regex: req.query.keyword || "", $options: "i" },
    isDeleted: null,
  }) // So sánh bằng cách tìm chuỗi con trong từ khóa và Không phân biệt chữ hoa, chữ thường.
    .select("-_id keyword")
    .limit(limits);
  suggestedKeywords = suggestedKeywords.map((s) => s.keyword);
  res.json(suggestedKeywords);
};

// Tìm kiếm dựa trên từ khóa, danh mục, thương hiệu, giá cả, kích thước, màu sắc, trọng lượng, bảo hành, đánh giá, và có sắp xếp kết quả theo các tiêu chí như ngày tạo (createdAt), ngày cập nhật (updatedAt) hoặc giá (price).
exports.searchProducts = async (req, res) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;
  const { createdAt, updatedAt, price } = req.query;
  let sortFactor = { createdAt: "desc" };
  if (createdAt && (createdAt === "asc" || createdAt === "desc"))
    sortFactor = { createdAt };
  if (updatedAt && (updatedAt === "asc" || updatedAt === "desc"))
    sortFactor = { updatedAt };
  if (price && (price === "asc" || price === "desc"))
    sortFactor = { price: price === "asc" ? 1 : -1 };
  let {
    keyword = "",
    brands,
    max_price, // Khoảng giá
    min_price,
    sizes,
    ratings,
    colors,
    warranties, // Bảo hành
    weights,
    cat_id, // ID danh mục
  } = req.body;
  let categories;
  if (cat_id) {
    // Nếu có cat_id, truy vấn danh mục trong MongoDB để lấy danh mục cha/con
    categories = await Category.find({
      $or: [{ _id: cat_id }, { parent: cat_id }],
      isDisabled: null,
    });
    if (!categories.length) {
      return res.status(404).json({ error: "Categories not found." });
    }
  }
  let searchingFactor = {}; // Xây dựng điều kiện tìm kiếm
  if (keyword && !cat_id) {
    //that is if only with keyword
    searchingFactor.isVerified = { $ne: null };
    searchingFactor.isDeleted = null;
    searchingFactor.$or = [
      { name: { $regex: keyword, $options: "i" } }, // name product
      { tags: { $regex: keyword, $options: "i" } }, //  tags product
    ];
    if (brands) searchingFactor.brand = brands;
    if (max_price && min_price)
      searchingFactor.price = { $lte: +max_price, $gte: +min_price };
    if (!max_price && min_price) searchingFactor.price = { $gte: +min_price };
    if (sizes) searchingFactor.size = { $in: sizes };
    if (colors) searchingFactor.color = { $in: colors };
    if (weights) searchingFactor.weight = { $in: weights };
    if (warranties) searchingFactor.warranty = warranties;
    if (ratings) searchingFactor.averageRating = { $gte: +ratings };
  } else {
    // Nếu có cat_id, truy vấn sẽ bao gồm danh mục
    //cat_id alongwith another some factors
    searchingFactor.isVerified = { $ne: null };
    searchingFactor.isDeleted = null;
    searchingFactor.category = { $in: categories };
    if (brands) searchingFactor.brand = brands;
    if (max_price && min_price)
      searchingFactor.price = { $lte: +max_price, $gte: +min_price };
    if (sizes) searchingFactor.size = { $in: sizes };
    if (colors) searchingFactor.color = { $in: colors };
    if (weights) searchingFactor.weight = { $in: weights };
    if (warranties) searchingFactor.warranty = warranties;
    if (ratings) searchingFactor.averageRating = { $gte: +ratings };
  }
  if (req.header("district")) {
    //  Lọc theo khu vực
    searchingFactor.availableDistricts = { $in: req.header("district") };
  }

  
  // console.log("searchingFactor:", searchingFactor);

  let products = await Product.find(searchingFactor)
    .populate("category", "displayName slug")
    .populate("brand", "brandName slug")
    .populate("images", "-createdAt -updatedAt -_v")
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean()
    .sort(sortFactor);
  // if (price && (price === 'asc' || price === 'desc')) {
  //   products.sort((a, b) => {
  //     return price === 'asc' ? parseFloat(a.price) - parseFloat(b.price) : parseFloat(b.price) - parseFloat(a.price)
  //   })
  // }
  let totalCount = await Product.countDocuments(searchingFactor);
  
  // console.log("products:", products);
  // console.log("totalCount:", totalCount);

  //user's action on each product
  if (req.authUser) {
    products = products.map(async (p) => {
      //user's action on this product
      const { hasOnCart, hasOnWishlist } = await userHas(
        p,
        req.authUser,
        "products"
      );
      //ratings of this product
      // p.stars = await getRatingInfo(p)
      (p.hasOnCart = hasOnCart), (p.hasOnWishlist = hasOnWishlist);
      return p;
    });
    products = await Promise.all(products);
  }
  res.json({ products, totalCount });
};

exports.getProductsByCategory = async (req, res) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;
  const { createdAt, updatedAt, price } = req.query;
  let sortFactor = { createdAt: "desc" };
  if (createdAt && (createdAt === "asc" || createdAt === "desc"))
    sortFactor = { createdAt };
  if (updatedAt && (updatedAt === "asc" || updatedAt === "desc"))
    sortFactor = { updatedAt };
  if (price && (price === "asc" || price === "desc"))
    sortFactor = { price: price === "asc" ? 1 : -1 };
  // Tìm danh mục (Category) theo cat_slug hoặc danh mục cha (parent) dựa trên cat_id
  let categories = await Category.find({
    $or: [{ slug: req.query.cat_slug }, { parent: req.query.cat_id }],
    isDisabled: null,
  });
  if (!categories.length) {
    return res.status(404).json({ error: "Categories not found" });
  }
  let query = {
    category: { $in: categories }, //Lọc sản phẩm thuộc danh mục tìm được
    isVerified: { $ne: null },
    isDeleted: null,
  };
  if (req.header("district")) {
    // Lọc thông tin quận/huyệ
    query = {
      ...query,
      availableDistricts: { $in: req.header("district") },
    };
  }
  categories = categories.map((c) => c._id.toString());
  let products = await Product.find(query)
    .populate("category", "displayName slug")
    .populate("brand", "brandName slug")
    .populate("images", "-createdAt -updatedAt -__v")
    .skip(perPage * page - perPage)
    .limit(perPage)
    .lean()
    .sort(sortFactor);
  // if (price && (price === 'asc' || price === 'desc')) {
  //   products.sort((a, b) => {
  //     return price === 'asc' ? parseFloat(a.price) - parseFloat(b.price) : parseFloat(b.price) - parseFloat(a.price)
  //   })
  // }
  // if (!products.length) {
  //   return res.status(404).json({ error: "No products are available." });
  // }
  const totalCount = await Product.countDocuments(query);

  //user's action on each product
  if (req.authUser) {
    // Nếu người dùng đã đăng nhập (req.authUser), kiểm tra xem sản phẩm có trong giỏ hàng (hasOnCart) hoặc danh sách yêu thích (hasOnWishlist) của họ không

    products = products.map(async (p) => {
      //user's action on this product
      const { hasOnCart, hasOnWishlist } = await userHas(
        p,
        req.authUser,
        "products"
      );
      //ratings of this product
      // p.stars = await getRatingInfo(p)
      (p.hasOnCart = hasOnCart), (p.hasOnWishlist = hasOnWishlist);
      return p;
    });
    products = await Promise.all(products);
  }
  res.json({ products, totalCount });
};

// Tạo bộ lọc sản phẩm tự động dựa trên danh mục hoặc từ khóa
exports.generateFilter = async (req, res) => {
  const filterGenerate = (products) => {
    let filters = {
      sizes: [],
      brands: [],
      warranties: [],
      colors: [],
      weights: [],
      prices: [],
      ratings: [5, 4, 3, 2, 1],
    };
    // Sử dụng some() để kiểm tra xem giá trị đã tồn tại trong danh sách chưa, nếu chưa có thì thêm vào.
    products.forEach((p) => {
      if (
        !filters.brands.some((brand) => p.brand.brandName === brand.brandName)
      )
        filters.brands.push(p.brand);
      if (!filters.warranties.some((w) => p.warranty === w))
        filters.warranties.push(p.warranty);
      if (!filters.prices.some((price) => p.price === price))
        filters.prices.push(p.price);
      p.size.forEach((size) => {
        if (!filters.sizes.includes(size)) filters.sizes.push(size);
      });
      p.color.forEach((color) => {
        if (!filters.colors.includes(color)) filters.colors.push(color);
      });
      p.weight.forEach((weight) => {
        if (!filters.weights.includes(weight)) filters.weights.push(weight);
      });
    });
    //making price range =>[[min,max],[min1,max1]]7
    let min_price = Math.min(...filters.prices);
    let max_price = Math.max(...filters.prices);
    //make min max price to multiple of 100
    function minmax(min, max) {
      let M;
      let m;
      if (max < 100) M = 100;
      if (max > 100) M = max + (100 - (max % 100));
      if (max % 100 === 0) M = max + 100;
      if (min < 100) m = 0;
      if (min > 100) m = min - (min % 100);
      if (min % 100 === 0) m = min - 100;
      return [m, M];
    }
    filters.prices = minmax(min_price, max_price);
    return filters;
  };
  if (req.query.keyword) { // Tìm kiếm theo từ khóa (keyword)
    // by search keyword
    let products;
    let sortFactor = { createdAt: "desc" };
    //if keyword is system keyword of latest products
    if (req.query.keyword === "latest") {
      products = await Product.find({
        isVerified: { $ne: null },
        isDeleted: null,
      })
        .limit(50) // lấy 50 sản phẩm mới nhất.
        .sort(sortFactor)
        .populate("brand", "brandName slug")
        .select("-_id brand warranty size color weight price");
      let generatedFilters = filterGenerate(products);
      return res.json(generatedFilters);
    }
    products = await Product.find({
      $or: [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { tags: { $regex: req.query.keyword, $options: "i" } },
      ],
      isVerified: { $ne: null },
      isDeleted: null,
    })
      .populate("brand", "brandName slug")
      .select("-_id brand warranty size color weight price");
    // if (!products.length) {
    //   return res.status(404).json({ error: "Cannot generate filter" });
    // }
    let generatedFilters = filterGenerate(products); // Tạo bộ lọc
    return res.json(generatedFilters);
  } else {
    //else by category
    let categories = await Category.find({ // Tìm kiếm theo danh mục (cat_slug hoặc cat_id)
      $or: [{ slug: req.query.cat_slug }, { parent: req.query.cat_id }],
      isDisabled: null,
    });
    if (!categories.length) {
      return res
        .status(404)
        .json({ error: "Category not found. Cannot generate filter." });
    }
    categories = categories.map((c) => c._id.toString());
    const products = await Product.find({
      category: { $in: categories },
      isVerified: { $ne: null },
      isDeleted: null,
    })
      .populate("brand", "brandName slug")
      .select("-_id brand warranty size color weight price");
    // if (!products.length) {
    //   return res.status(404).json({ error: "Cannot generate filter" });
    // }
    let generatedFilters = filterGenerate(products);
    return res.json(generatedFilters);
  }
};
