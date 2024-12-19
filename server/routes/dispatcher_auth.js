const express = require("express");

const {
    signin,
    resetPassword,
    forgotPassword,
    refreshToken,
    logout
} = require("../controllers/dispatcher_auth");

const { passwordResetValidator } = require("../middleware/validator");

const router = express.Router();

router.post("/signin", signin);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);
router.post("/refresh-token",refreshToken)

module.exports = router;