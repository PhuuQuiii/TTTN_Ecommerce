const express = require("express");

const { createProduct, product, getProduct, updateProduct, productImages, deleteImage, getProducts, deleteProduct, minedProducts, deleteImageById, getProductsByCategory, generateFilter, searchProducts, suggestKeywords, forYouProducts} = require("../controllers/product")
const { profile } = require("../controllers/admin")
const { uploadProductImages , waterMarker} = require("../middleware/helpers");
const { validateProduct } = require("../middleware/validator")
const { auth: adminAuth, isSuperAdmin, isAdmin, hasAuthorization, checkAdminSignin } = require('../controllers/admin_auth')
const {checkUserSignin, auth: userAuth} = require("../controllers/user_auth")

const router = express.Router();

//admin's or superadmin's
router.get("/products/:id", adminAuth, hasAuthorization, getProducts) // Lấy danh sách sản phẩm với bộ lọc & phân trang
router.post("/images/:id", adminAuth, hasAuthorization, uploadProductImages,waterMarker, productImages) // thêm ảnh, nén ảnh
router.delete("/image/:id", adminAuth, hasAuthorization, deleteImageById)//?image_id=
router.delete("/image/:id/:p_slug", adminAuth, hasAuthorization, deleteImage)//?image_id=
router.patch('/delete-product/:id/:p_slug', adminAuth, hasAuthorization, deleteProduct) // delete product ( thay đổi giá trị isDeleted = time)

//user
router.get('/for-you', userAuth, forYouProducts)


router.get('/mined-products',minedProducts)   
router.get('/by-category', checkUserSignin, getProductsByCategory)//?cat_id=&cat_slug=
router.get('/generate-filter', generateFilter)//?keyword= or ?cat_id=&cat_slug=
router.post('/search',checkUserSignin,searchProducts)//need to work on rating nd $option in regex
router.get('/suggest-keywords', suggestKeywords)//?keyword= 

// shop
router.post("/:id", adminAuth, hasAuthorization, validateProduct, createProduct) // add product ( isDeleted = null)
router.put("/:id/:p_slug", adminAuth, hasAuthorization, validateProduct, updateProduct) // update product
router.get('/:p_slug', checkUserSignin, checkAdminSignin, getProduct) // Lấy sp theo slug của shop

router.param('p_slug', product) // giúp tự động tìm sản phẩm một lần trước khi các API khác xử lý
router.param('id', profile) // Xác thực admin trước khi thực hiện các thao tác với sản phẩm

module.exports = router;