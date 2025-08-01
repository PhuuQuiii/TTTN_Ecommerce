const Admin = require("../models/Admin");
const BusinessInfo = require("../models/BusinessInfo")
const AdminBank = require("../models/AdminBank")
const AdminWarehouse = require("../models/AdminWarehouse")
const Notification = require("../models/Notification")
const File = require('../models/AdminFiles')
const sharp = require('sharp');
const path = require('path');
const { fileRemover, imageCompressor } = require("../middleware/helpers");
const fs = require("fs");
const _ = require('lodash');
const Fawn = require("fawn");
const task = Fawn.Task();
const multer = require('multer');
const Order = require("../models/Order");

// Configure multer for cheque upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

exports.uploadCheque = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2480 * 3230 // 8MB limit
    }
}).single('chequeCopy');

exports.profile = async (req, res, next) => {
    const admin = await Admin.findById(req.params.id)
                // .select('-salt -password')
    if (!admin) {
        return res.status(404).json({ error: 'Admin not found with this id' })
    }
    req.profile = admin
    next();
}

// getProfile
exports.getProfile = async (req, res) => {
    req.profile.resetPasswordLink = undefined
    req.profile.emailVerifyLink = undefined
    req.profile.salt = undefined
    req.profile.password = undefined
    res.json(req.profile)
}

// update or complete profile
exports.updateProfile = async (req, res) => {
    let profile = req.profile
    profile = _.extend(profile, req.body)
    // password update
    if (req.body.oldPassword && req.body.newPassword) {
        let admin = await Admin.findByCredentials(profile.email, req.body.oldPassword)
        if (!admin) {
            return res.status(403).json({
                error: "Wrong Password."
            });
        }
        profile.password = req.body.newPassword
    }
    
    profile.holidayMode.start = req.body.holidayStart && req.body.holidayStart
    profile.holidayMode.end = req.body.holidayEnd && req.body.holidayEnd
    profile.isVerified = null
    await profile.save();
    profile.password = undefined
    profile.salt = undefined
    profile.resetPasswordLink = undefined
    profile.emailVerifyLink = undefined
    res.json(profile);
}

exports.uploadPhoto = async (req, res) => {
    let profile = req.profile
    if (req.file == undefined) {
        return res.status(400).json({ error: 'Image is required.' })
    }
    const { filename, path: filepath, destination } = req.file
    //Compress image
    // await sharp(req.file.path)
    //     .resize(300)
    //     .jpeg({ quality: 100 })
    //     .toFile(path.resolve(req.file.destination, "admin", filename))
    await imageCompressor(
        filename,
        300,
        filepath,
        destination,
        "admin"
    );
    fs.unlinkSync(filepath);//remove from public/uploads
    // if update then remove old photo
    if (profile.photo) fs.unlinkSync(`public/uploads/${profile.photo}`)
    profile.photo = "admin/"+ filename ;
    await profile.save()
    res.json({ photo: profile.photo })
}

exports.adminFile = async (req, res) => {
    if (req.file == undefined) {
        return res.status(400).json({ error: 'Image of adminfile is required.' })
    }
    if (req.query.filetype !== 'bank' || req.query.filetype !== 'citizenship' || req.query.filetype !== 'businessLicence') {
        return res.status(403).json({error: 'Invalid file type.'})
    }
    // const { filename: image } = req.file;
    // //Compress image
    // await sharp(req.file.path)
    // .resize(400)
    // .toFile(path.resolve(req.file.destination, req.query.filetype, image))//filetype='bank' || 'citizenship' || 'businessLicence'
    const { filename, path: filepath, destination } = req.file
    await imageCompressor(
        filename,
        400,
        filepath,
        destination,
        req.query.filetype
    );
    fs.unlinkSync(filepath);//remove from public/uploads

    const newFile = new File({ fileUri: `${req.query.filetype}/${filename}`})
    await newFile.save()
    res.json({[req.query.filetype]:newFile})
};



exports.deleteFileById = async (req, res) => {
    const filetype = req.query.filetype
    if (filetype !== 'bank' || filetype !== 'citizenshipBack' || filetype !== 'citizenshipFront' || filetype !== 'businessLicence' ) {
        return res.status(403).json({ error: "Invalid file type." })
    }
    if (filetype === 'bank') {
        let bank = await AdminBank.find(req.profile._id)
        if (!bank || bank.chequeCopy) {
            return res.status(404).json({ error: "File not found" })
        }
        let updateBank = bank.toObject()
        updateBank.chequeCopy = null
        updateBank.isVerified = null
        task.update(bank, updateBank).options({ viaSave: true })
    }
    if (filetype === 'citizenshipBack') {
        let businessinfo = await BusinessInfo.find(req.profile._id)
        if (!businessinfo || businessinfo.citizenshipBack) {
            return res.status(404).json({ error: "File not found" })
        }
        let updateBusinsessinfo = businessinfo.toObject()
        updateBusinsessinfo.citizenshipBack = null
        updateBusinsessinfo.isVerified = null
        task.update(businessinfo, updateBusinsessinfo).options({ viaSave: true })
    }
    if (filetype === 'citizenshipFront') {
        let businessinfo = await BusinessInfo.find(req.profile._id)
        if (!businessinfo || businessinfo.citizenshipFront) {
            return res.status(404).json({ error: "File not found" })
        }
        let updateBusinsessinfo = businessinfo.toObject()
        updateBusinsessinfo.citizenshipFront = null
        updateBusinsessinfo.isVerified = null
        task.update(businessinfo, updateBusinsessinfo).options({ viaSave: true })
    }
    if (filetype === 'businessLicence') {
        let businessinfo = await BusinessInfo.find(req.profile._id)
        if (!businessinfo || businessinfo.businessLicence) {
            return res.status(404).json({ error: "File not found" })
        }
        let updateBusinsessinfo = businessinfo.toObject()
        updateBusinsessinfo.businessLicence = null
        updateBusinsessinfo.isVerified = null
        task.update(businessinfo, updateBusinsessinfo).options({ viaSave: true })
    }

    // let file = await File.findByIdAndRemove(req.query.file_id);
    const updateProfile = req.profile.toObject()
    updateProfile.isVerified = null
    task.update(req.profile, updateProfile).options({ viaSave: true })
    let results = await task
        .remove(File, { _id: req.query.file_id })
        .run({ useMongoose: true });
    let Path = `public/uploads/${results[2].fileUri}`;
    fs.unlinkSync(Path);
    res.json({[filetype]:results[2]});//i.e romoved file
};

exports.getBusinessInfo = async (req, res) => {
    try {
        const businessinfo = await BusinessInfo.findOne({ admin: req.profile._id })
            .select("ownerName address city citizenshipNumber businessRegisterNumber citizenshipFront citizenshipBack businessLicence createdAt updatedAt isVerified");

        if (!businessinfo) {
            return res.status(404).json({ error: "No business information." });
        }


        // gửi ảnh với URL đầy đủ
        // const baseUrl = process.env.SERVER_URL || "http://localhost:3001";
        const baseUrl = process.env.SERVER_URL || "https://backend-ecommerce-theta-plum.vercel.app";
        const formattedData = {
            ...businessinfo._doc,
            citizenshipFront: businessinfo.citizenshipFront ? `${baseUrl}/uploads/${businessinfo.citizenshipFront}` : null,
            citizenshipBack: businessinfo.citizenshipBack ? `${baseUrl}/uploads/${businessinfo.citizenshipBack}` : null,
            businessLicence: businessinfo.businessLicence ? `${baseUrl}/uploads/${businessinfo.businessLicence}` : null
        };

        res.json(formattedData);
    } catch (error) {
        console.error("Error fetching business info:", error);
        res.status(500).json({ error: "Server error." });
    }
};


exports.businessinfo = async (req, res) => {
    try {
        //make req.files to array of objs
        let files = []
        if (req.files) {
            for (const file in req.files) {
                files.push(req.files[file][0]);
            }
            
            // Process each file
            for (const file of files) {
                const { filename, fieldname, destination, path: filepath } = file;
                const outputDir = path.resolve(destination, fieldname === 'businessLicence' ? "businessLicence" : "citizenship");
                
                // Ensure output directory exists
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                // Process image with sharp
                await sharp(filepath)
                    .resize(400)
                    .toFile(path.join(outputDir, filename));

                // Remove original file
                fs.unlinkSync(filepath);
            }
        }

        let profile = req.profile.toObject();
        const { businessInfo } = profile;

        if (businessInfo) {
            let docs = await BusinessInfo.findById(businessInfo);
            let updateDoc = docs.toObject();
            updateDoc = _.extend(updateDoc, req.body);

            if (files.length > 0) {
                files.forEach(file => {
                    const { filename, fieldname } = file;
                    if (docs[fieldname]) {
                        const oldFilePath = path.join('public/uploads', docs[fieldname]);
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                        }
                    }
                    docs[fieldname] = `${fieldname === 'businessLicence' ? "businessLicence" : "citizenship"}/${filename}`;
                });
            }

            updateDoc.isVerified = null;
            profile.isVerified = null;

            await task
                .update(req.profile, profile)
                .options({ viaSave: true, multi: true })
                .update(docs, updateDoc)
                .options({ viaSave: true, multi: true })
                .run({ useMongoose: true });

            return res.json(updateDoc);
        }

        let docs = new BusinessInfo();
        docs = _.extend(docs, req.body);
        
        if (files.length > 0) {
            files.forEach(file => {
                const { filename, fieldname } = file;
                docs[fieldname] = `${fieldname === 'businessLicence' ? "businessLicence" : "citizenship"}/${filename}`;
            });
        }

        docs.admin = profile._id;
        profile.businessInfo = docs._id;

        await task
            .update(req.profile, profile)
            .options({ viaSave: true, multi: true })
            .save(docs)
            .run({ useMongoose: true });

        res.json(docs);
    } catch (error) {
        console.error('Business info error:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.getBankInfo = async (req, res) => {
    let bankinfo = await AdminBank.findOne({ admin: req.profile._id })
    if (!bankinfo) {
        return res.status(404).json({ error: "No bank information." })
    }
    res.json(bankinfo)
}

exports.bankinfo = async (req, res) => {
    if (req.file) {
        const { filename, destination, path: filepath } = req.file;
        await sharp(filepath)
            .resize(400)
            .toFile(path.resolve(destination, "bank", filename))//add file from uploads to doc folder
        fs.unlinkSync(filepath);//and remove file from public/uploads
    }
    let profile = req.profile.toObject()
    const { adminBank } = profile
    if (adminBank) {
        let docs = await AdminBank.findById(adminBank)
        //remove old file and update with new one
        docs = _.extend(docs, req.body)
        // update cheque file
        if (req.file) {
            const { filename } = req.file
            const filePath = `public/uploads/${docs["chequeCopy"]}`
            fs.unlinkSync(filePath)//remove old file from respective folders
            docs["chequeCopy"] = `bank/${filename}`;//updating docs
        }
        docs.isVerified = null
        await docs.save()
        //db transaction gareko chaina 
        profile.isVerified = null
        await profile.save()
        return res.json(docs)
        docs =  await task
            .save(docs)
            .update(req.profile, profile)
            .options({ viaSave: true })
            .run({ useMongoose: true })
        return res.json({docs:docs[0]})
    }
    //first check if cheque is empty or not
    if (!req.file) return res.status(400).json({ error: "Cheque copy is required" })

    let docs = new AdminBank()
    docs = _.extend(docs, req.body)
    const { filename } = req.file
    docs["chequeCopy"] = `bank/${filename}`;
    docs.admin = profile._id
    profile.adminBank = docs._id
    await task
        .save(docs)
        .update(req.profile, profile)
        .options({ viaSave: true })
        .run({ useMongoose: true })
    res.json(docs)
}

exports.getWareHouse = async (req, res) => {
    let warehouseinfo = await AdminWarehouse.findOne({ admin: req.profile._id })
    if (!warehouseinfo) {
        return res.status(404).json({ error: "No warehouse information available." })
    }
    res.json(warehouseinfo)
}

exports.warehouse = async (req, res) => {
    let profile = req.profile.toObject()
    const { adminWareHouse } = profile
    if (adminWareHouse) {
        let warehouseInfo = await AdminWarehouse.findById(adminWareHouse)
        warehouseInfo = _.extend(warehouseInfo, req.body)
        warehouseInfo.isVerified = null
        // await warehouseInfo.save()
        //db transaction gareko chaina 
        profile.isVerified = null
        // await profile.save()
        // return res.json(warehouseInfo)
        await task
            .save(docs)
            .update(req.profile, profile)
            .options({ viaSave: true })
            .run({ useMongoose: true })
        return res.json({ warehouseInfo })
    }
    let newWareHouse = new AdminWarehouse(req.body)
    newWareHouse.admin = profile._id
    profile.adminWareHouse = newWareHouse._id
    await task
        .save(newWareHouse)
        .update(req.profile, profile)
        .options({ viaSave: true })
        .run({ useMongoose: true })
    res.json(newWareHouse)
}


exports.getNotifications = async(req,res) => {
    let adminNotification = await Notification.findOne({ admin: req.admin._id })
    if (adminNotification) {
        adminNotification.noOfUnseen = 0
        // adminNotification.notifications  = _.reverse(adminNotification.notifications)
        // adminNotification.markModified('notifications')
        adminNotification =   await adminNotification.save()
        return res.json(adminNotification)
    }
    adminNotification = {
        admin: req.admin._id,
        notifications:[],
        noOfUnseen:0
    }
    res.json(adminNotification)

}

exports.readNotification = async(req,res) => {
    let adminNotification = await Notification.findOne({ admin: req.admin._id })
    if (adminNotification) {
        adminNotification.notifications = adminNotification.notifications.map(n=> {
            if (n._id.toString() === req.notification_id) {
                n.hasRead = true
            }
            return n
        })
        await adminNotification.save()
        return res.json(adminNotification)
    }
    adminNotification = {
        admin: req.admin._id,
        notifications: [],
        noOFUnseen: 0
    }
    res.json(adminNotification)
}

exports.getAnalytics = async (req, res) => {
    try {
        // Get admin from req.admin instead of req.profile
        if (!req.admin || !req.admin._id) {
            console.error('Admin not found in request');
            return res.status(401).json({ error: "Unauthorized - Admin not found" });
        }

        console.log('Admin ID:', req.admin._id);
        
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        // Get start and end of month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        // Base query for orders
        const baseQuery = { soldBy: req.admin._id };
        console.log('Base query:', baseQuery);

        // Get completed orders for today
        const completedOrdersToday = await Order.countDocuments({
            ...baseQuery,
            "status.currentStatus": "complete",
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // Get completed orders for month
        const completedOrdersMonth = await Order.countDocuments({
            ...baseQuery,
            "status.currentStatus": "complete",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // Get pending orders for today
        const pendingOrdersToday = await Order.countDocuments({
            ...baseQuery,
            "status.currentStatus": "active",
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // Get pending orders for month
        const pendingOrdersMonth = await Order.countDocuments({
            ...baseQuery,
            "status.currentStatus": "active",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // Get cancelled orders for today
        const cancelledOrdersToday = await Order.countDocuments({
            ...baseQuery,
            "status.currentStatus": "cancel",
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // Get cancelled orders for month
        const cancelledOrdersMonth = await Order.countDocuments({
            ...baseQuery,
            "status.currentStatus": "cancel",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // Get total sales for today
        const totalSalesToday = await Order.aggregate([
            {
                $match: {
                    ...baseQuery,
                    "status.currentStatus": "complete",
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "payment",
                    foreignField: "_id",
                    as: "paymentDetails"
                }
            },
            {
                $unwind: "$paymentDetails"
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$paymentDetails.amount" }
                }
            }
        ]);

        // Get total sales for month
        const totalSalesMonth = await Order.aggregate([
            {
                $match: {
                    ...baseQuery,
                    "status.currentStatus": "complete",
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "payment",
                    foreignField: "_id",
                    as: "paymentDetails"
                }
            },
            {
                $unwind: "$paymentDetails"
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$paymentDetails.amount" }
                }
            }
        ]);

        // Get top 6 returned products for today
        const topReturnedProductsToday = await Order.aggregate([
            {
                $match: {
                    ...baseQuery,
                    "status.currentStatus": "return",
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $group: {
                    _id: "$product",
                    returnCount: { $sum: 1 },
                    product: { $first: "$productDetails" }
                }
            },
            {
                $sort: { returnCount: -1 }
            },
            {
                $limit: 6
            }
        ]);

        // Get top 6 returned products for month
        const topReturnedProductsMonth = await Order.aggregate([
            {
                $match: {
                    ...baseQuery,
                    "status.currentStatus": "return",
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $group: {
                    _id: "$product",
                    returnCount: { $sum: 1 },
                    product: { $first: "$productDetails" }
                }
            },
            {
                $sort: { returnCount: -1 }
            },
            {
                $limit: 6
            }
        ]);

        const allReturnedProducts = await Order.aggregate([
            {
                $match: {
                    ...baseQuery,
                    "status.currentStatus": "return"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $group: {
                    _id: "$product",
                    returnCount: { $sum: 1 },
                    product: { $first: "$productDetails" }
                }
            },
            {
                $sort: { returnCount: -1 }
            }
        ]);


        const analytics = {
            daily: {
                completedOrders: completedOrdersToday || 0,
                pendingOrders: pendingOrdersToday || 0,
                cancelledOrders: cancelledOrdersToday || 0,
                totalSales: totalSalesToday[0]?.total || 0,
                topReturnedProducts: topReturnedProductsToday || []

            },
            monthly: {
                completedOrders: completedOrdersMonth || 0,
                pendingOrders: pendingOrdersMonth || 0,
                cancelledOrders: cancelledOrdersMonth || 0,
                totalSales: totalSalesMonth[0]?.total || 0,
                topReturnedProducts: topReturnedProductsMonth || []
            },
            all: {
                topReturnedProducts: allReturnedProducts || []
            }
        };

        res.json(analytics);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getRevenue = async (req, res) => {
    try {
        // Get admin from req.admin instead of req.profile
        if (!req.admin || !req.admin._id) {
            console.error('Admin not found in request');
            return res.status(401).json({ error: "Unauthorized - Admin not found" });
        }

        console.log('Admin ID:', req.admin._id);
        
        const { period } = req.query;
        console.log('Period:', period);

        let query = {
            "status.currentStatus": "complete",
            soldBy: req.admin._id
        };

        // Set date range based on period
        const today = new Date();
        switch (period) {
            case 'day':
                query.createdAt = {
                    $gte: new Date(today.setHours(0, 0, 0, 0)),
                    $lte: new Date(today.setHours(23, 59, 59, 999))
                };
                break;
            case 'month':
                query.createdAt = {
                    $gte: new Date(today.getFullYear(), today.getMonth(), 1),
                    $lte: new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
                };
                break;
            case 'year':
                query.createdAt = {
                    $gte: new Date(today.getFullYear(), 0, 1),
                    $lte: new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999)
                };
                break;
            case 'all':
                // For all time, we don't need to set any date range
                delete query.createdAt;
                break;
            default:
                return res.status(400).json({ error: "Invalid period parameter" });
        }

        console.log('Final query:', query);

        // Calculate total revenue
        const totalRevenue = await Order.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "payment",
                    foreignField: "_id",
                    as: "paymentDetails"
                }
            },
            {
                $unwind: "$paymentDetails"
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$paymentDetails.amount" }
                }
            }
        ]);

        console.log('Total revenue result:', totalRevenue);

        res.json(totalRevenue[0]?.total || 0);
    } catch (error) {
        console.error('Revenue error:', error);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};