const Sale = require("../models/SaleProduct");

// Tạo chương trình sale
exports.createSale = async (req, res) => {
  try {
    const { products, discountRate, startTime, endTime, createdBy } = req.body;
    const newSale = new Sale({
      products,
      discountRate,
      startTime,
      endTime,
      createdBy,
    });
    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.createSale = async (req, res) => {
//   try {
//     const {
//       products,
//       discountRate,
//       startTime, // Giá trị đầu vào dạng giờ VN
//       endTime,   // Giá trị đầu vào dạng giờ VN
//       createdBy,
//     } = req.body;

//     // Giả sử startTime/endTime do người dùng truyền đến là giờ Việt Nam (GMT+7).
//     // Ta trừ 7 tiếng để lấy giờ UTC thực sự.
//     const startTimeUTC = new Date(new Date(startTime).getTime() - 7 * 60 * 60 * 1000);
//     const endTimeUTC = new Date(new Date(endTime).getTime() - 7 * 60 * 60 * 1000);

//     const newSale = new Sale({
//       products,
//       discountRate,
//       startTime: startTimeUTC,
//       endTime: endTimeUTC,
//       createdBy,
//     });

//     await newSale.save();
//     res.status(201).json(newSale);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
  

// Hiển thị các chương trình sale đang diễn ra theo giờ VN
exports.getActiveSales = async (req, res) => {
    try {
        const nowUTC = new Date();
        const nowLocal = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000); // Giờ Việt Nam
        const hourLocal = nowLocal.getHours();
        console.log("Giờ VN hiện tại:", nowLocal.toISOString());

        const allSales = await Sale.find().populate("products createdBy");

        const activeSales = allSales.filter(sale => {
            const saleStartLocal = new Date(sale.startTime.getTime() + 7 * 60 * 60 * 1000);
            const saleEndLocal = new Date(sale.endTime.getTime() + 7 * 60 * 60 * 1000);

            return (
                saleStartLocal.getHours() === hourLocal ||
                (saleStartLocal <= nowLocal && saleEndLocal >= nowLocal)
            );
        });

        if (activeSales.length === 0) {
            return res.status(200).json({ message: "Không có chương trình diễn ra" });
        }

        const result = activeSales.map(sale => {
            const saleObj = sale.toObject();
            saleObj.startTimeVN = new Date(sale.startTime.getTime() + 7 * 60 * 60 * 1000);
            saleObj.endTimeVN = new Date(sale.endTime.getTime() + 7 * 60 * 60 * 1000);
            return saleObj;
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  
  

  
  
  
  
  
  
  
  

// Hiển thị các chương trình sale theo adminId
exports.getSalesByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;
    const sales = await Sale.find({ createdBy: adminId }).populate("products createdBy");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hiển thị tất cả các chương trình sale
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("products createdBy");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};