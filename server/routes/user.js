const express = require("express");

const {
    getProfile, updateProfile, profile, uploadPhoto, addAddress, editAddress, deleteAddress, toggleAddressActiveness
} = require("../controllers/user");
const { auth, isSameUser } = require('../controllers/user_auth')

const { uploadUserPhoto } = require("../middleware/helpers");

const router = express.Router();
//address
router.post('/add-address',auth,addAddress)
router.put('/edit-address/:address_id', auth, editAddress)
router.delete('/delete-address/:address_id', auth, deleteAddress)
router.patch('/toggle-address-activeness',auth,toggleAddressActiveness)

//profile
router.put('/',auth, updateProfile)//update or complete
router.patch('/',auth, uploadUserPhoto, uploadPhoto)
router.get("/:id", getProfile)


router.param('id', profile) // url chua tham so id, ham profile duoc goi de xu ly tham so

module.exports = router;