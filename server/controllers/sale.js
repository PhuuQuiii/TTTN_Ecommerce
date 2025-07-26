const Sale = require("../models/SaleProduct");
const Product = require("../models/Product");
const ProductImages = require("../models/ProductImages");

// Tạo chương trình sale
// exports.createSale = async (req, res) => {
//   try {
//     const { products, discountRate, startTime, endTime, createdBy } = req.body;
//     const newSale = new Sale({
//       products,
//       discountRate,
//       startTime,
//       endTime,
//       createdBy,
//     });
//     await newSale.save();
//     res.status(201).json(newSale);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createSale = async (req, res) => {
  try {
    const {
      name,
      products,
      discountRate,
      startTime, // Đầu vào: giờ VN
      endTime, // Đầu vào: giờ VN
      createdBy,
    } = req.body;

    const newSale = new Sale({
      name,
      products,
      discountRate,
      startTime,
      endTime,
      createdBy,
    });

    await newSale.save();
    return res.status(201).json(newSale);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Hiển thị các chương trình sale đang diễn ra theo giờ VN
exports.getActiveSales = async (req, res) => {
  try {
    const nowUTC = new Date();
    const nowLocal = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000); // Giờ Việt Nam

    const allSales = await Sale.find()
      .populate({
        path: "products",
        populate: {
          path: "images",
          model: "productimages",
        },
      })
      .populate("createdBy");

    let activeSales = allSales.filter((sale) => {
      const saleStartLocal = new Date(
        sale.startTime.getTime() + 7 * 60 * 60 * 1000
      );
      const saleEndLocal = new Date(
        sale.endTime.getTime() + 7 * 60 * 60 * 1000
      );
      return saleStartLocal <= nowLocal && nowLocal <= saleEndLocal;
    });

    // Convert to plain objects and filter products that are verified
    activeSales = activeSales
      .map((sale) => {
        const saleObj = sale.toObject();
        saleObj.products = saleObj.products.filter(
          (product) => product.isVerified
        );
        return saleObj;
      })
      .filter((saleObj) => saleObj.products.length > 0);

    if (activeSales.length === 0) {
      return res
        .status(200)
        .json({ data: { message: "Không có chương trình diễn ra" } });
    }

    const result = activeSales.map((sale) => {
      // Use sale directly because it's already a plain object
      sale.startTimeVN = new Date(
        sale.startTime.getTime() + 7 * 60 * 60 * 1000
      );
      sale.endTimeVN = new Date(sale.endTime.getTime() + 7 * 60 * 60 * 1000);

      const productsWithImageUrls = sale.products.map((product) => {
        const imagesWithUrls = product.images.map((imageId) => {
          const image = ProductImages.findById(imageId);
          return {
            _id: imageId,
            medium: image.medium,
            large: image.large,
          };
        });
        return {
          ...product,
          images: imagesWithUrls,
        };
      });

      return {
        ...sale,
        products: productsWithImageUrls,
      };
    });

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hiển thị các chương trình sale theo adminId
exports.getSalesByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;
    const sales = await Sale.find({ createdBy: adminId })
      .populate({
        path: "products",
        populate: {
          path: "images",
          model: "productimages",
        },
      })
      .populate("createdBy");

    const salesWithImageUrls = sales.map((sale) => {
      const productsWithImageUrls = sale.products.map((product) => {
        const imagesWithUrls = product.images.map((imageId) => {
          const image = ProductImages.findById(imageId);
          return {
            _id: imageId,
            medium: image.medium,
            large: image.large,
          };
        });
        return {
          ...product._doc,
          images: imagesWithUrls,
        };
      });
      return {
        ...sale._doc,
        products: productsWithImageUrls,
      };
    });

    res.status(200).json(salesWithImageUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hiển thị tất cả các chương trình sale
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate({
        path: "products",
        populate: {
          path: "images",
          model: "productimages",
        },
      })
      .populate("createdBy");

    // Chuyển đổi objectID của ảnh thành đường dẫn ảnh
    const salesWithImageUrls = sales.map((sale) => {
      const productsWithImageUrls = sale.products.map((product) => {
        const imagesWithUrls = product.images.map((imageId) => {
          const image = ProductImages.findById(imageId);
          return {
            _id: imageId,
            medium: image.medium,
            large: image.large,
          };
        });
        return {
          ...product._doc,
          images: imagesWithUrls,
        };
      });
      return {
        ...sale._doc,
        products: productsWithImageUrls,
      };
    });

    res.status(200).json(salesWithImageUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa chương trình sale
exports.deleteSale = async (req, res) => {
  try {
    const { saleId } = req.params;
    const deletedSale = await Sale.findByIdAndRemove(saleId);

    if (!deletedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
