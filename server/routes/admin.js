const express = require("express");
const multer = require('multer');

const {
    getProfile, updateProfile, profile, businessinfo, bankinfo, warehouse, getBusinessInfo, getBankInfo, getWareHouse, uploadPhoto, adminFile, deleteFileById, getNotifications, readNotification, uploadCheque
} = require("../controllers/admin");
const { auth, hasAuthorization } = require('../controllers/admin_auth')

const { uploadAdminPhoto, uploadAdminDoc } = require("../middleware/helpers");
const { validateAdminBankInfo, validateBusinessInfo, validateWareHouse, validateAdminProfile } = require("../middleware/validator")

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    }
});

const businessUpload = upload.fields([
    { name: 'citizenshipFront', maxCount: 1 },
    { name: 'citizenshipBack', maxCount: 1 },
    { name: 'businessLicence', maxCount: 1 }
]);

//notification..
router.get('/notifications',auth, getNotifications)
router.patch('/read-notification/:notification_id', auth, readNotification)

// admin profile..
router
    .route("/:id")
    .get(getProfile)
    .put(auth, hasAuthorization,validateAdminProfile, updateProfile)//update or create
    .patch(auth, hasAuthorization,uploadAdminPhoto, uploadPhoto)

//admin's file..
router
    .route("/file/:id")
    .post(auth, hasAuthorization, uploadAdminDoc, adminFile)//?filetype
    .delete(auth, hasAuthorization, deleteFileById)//?filetype&file_id


router.route('/businessinfo/:id')
    .put(auth, hasAuthorization, businessUpload, validateBusinessInfo, businessinfo)
    .get(auth, hasAuthorization, getBusinessInfo)

router.route('/bank/:id')
    .put(auth, hasAuthorization, uploadCheque, validateAdminBankInfo, bankinfo)//update or create
    .get( auth, hasAuthorization, getBankInfo)

router.route('/warehouse/:id')
    .put(auth, hasAuthorization, validateWareHouse, warehouse)//update or create
    .get(auth, hasAuthorization, getWareHouse)
router.param('id', profile)


module.exports = router;