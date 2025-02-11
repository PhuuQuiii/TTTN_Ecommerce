const Admin = require("../models/Admin");
const { sendEmail } = require("../middleware/helpers");
const SocketMapping = require("../models/SocketMapping");
const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const crypto = require("crypto");
const RefreshToken = require("../models/RefereshToken");

/**
 * @swagger
 *
 * /admin-signup:
 *   post:
 *     description: Admin Signup
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: admin
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: users
 */
exports.signup = async (req, res) => {
  let adminExists = await Admin.findOne({ email: req.body.email });
  if (adminExists)
    return res.status(403).json({
      error: "Email is taken!",
    });
  const token = jwt.sign(
    { email: req.body.email },
    process.env.JWT_EMAIL_VERIFICATION_KEY,
    { expiresIn: process.env.EMAIL_TOKEN_EXPIRE_TIME }
  );
  req.body.emailVerifyLink = token; // thông tin xác minh email
  let admin = new Admin(req.body);
  await admin.save();
  const mailingData = {
    from: "Kindeem",
    to: admin.email,
    subject: "🔐 Xác minh tài khoản của bạn - Kindeem( team TTTN_16)",
    html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Chào ${admin.name},</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản bán hàng trên <strong>Kindeem</strong>! 🎉</p>
            <p>Trước khi bạn có thể sử dụng tất cả các tính năng tuyệt vời của chúng tôi, vui lòng xác minh email của bạn bằng cách nhấn vào nút bên dưới:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.CLIENT_URL}/email-verify?token=${token}" 
                 style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                ✅ Xác minh tài khoản
              </a>
            </div>
            <p>Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.</p>
            <hr>
            <p style="font-size: 14px; color: #777;">Nếu có bất kỳ thắc mắc nào, hãy liên hệ với chúng tôi qua <a href="mailto:support@kindeem.com">support@kindeem.com</a>.</p>
            <p style="font-size: 14px; color: #777;">Trân trọng,<br>💚 Đội ngũ Kindeem</p>
          </div>
        `,
  };

  await sendEmail(mailingData); // gưi email xác thực
  res.status(200).json({
    msg: `Email has been sent to ${req.body.email} to verify your email address.`,
    // token: token,
  });
};

// verify email link
exports.emailverify = async (req, res) => {
  const { token } = req.query; // Nhận token từ URL
  let admin = await Admin.findOne({ emailVerifyLink: token });
  if (!admin || (admin && !admin.emailVerifyLink))
    return res.status(401).json({
      error: "Token is invalid!",
    });
  admin.emailVerifyLink = "";
  admin.updated = Date.now();
//   admin.isVerified = new Date(); //time xác minh tài khoản
//   admin.updatedAt = Date.now();
  await admin.save();
  res.status(201).json({ msg: "Successfully signup!" });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  let admin = await Admin.findByCredentials(email, password);
  if (!admin) {
    return res.status(404).json({
      error: "Email or password is invalid.",
    });
  }
  if (admin.emailVerifyLink) {
    return res.status(401).json({
      error: "Please verify your email address.",
    });
  }
  if (admin.isBlocked) {
    return res.status(401).json({
      error: "Your account has been blocked.",
    });
  }
  const payload = {
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SIGNIN_KEY, {
    expiresIn: process.env.SIGNIN_EXPIRE_TIME,
  });
  let refreshToken = {
    refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    }),
    userIP: req.ip,
  };
  refreshToken = new RefreshToken(refreshToken);

  await refreshToken.save();
  // let cookieOptions = {
  //     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //     // httpOnly: true
  // }
  // res.cookie('refreshToken', `${refreshToken.refreshToken}`,cookieOptions);//with that same expire date
  return res.json({ accessToken, refreshToken: refreshToken.refreshToken });
};

exports.refreshToken = async (req, res) => {
  // if (Date.now() >= refreshToken.expires) {
  //     return res.status(401).json({error:'Refresh Token has expired.'})
  // }
  // //extend refreshtoken expiration
  // refreshToken.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  // await refreshToken.save()
  try {
    let refreshToken = await RefreshToken.findOne({
      refreshToken: req.body.refreshToken,
      userIP: req.ip,
    });
    if (!refreshToken)
      return res.status(401).json({ error: "Invalid refreshToken" });
    let tokenData = jwt.verify(
      refreshToken.refreshToken,
      process.env.REFRESH_TOKEN_KEY
    );
    if (tokenData.role !== "admin" && tokenData.role !== "superadmin") {
      throw "Invalid refresh token";
    }
    const payload = {
      _id: tokenData._id,
      name: tokenData.name,
      email: tokenData.email,
      role: tokenData.role,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SIGNIN_KEY, {
      expiresIn: process.env.SIGNIN_EXPIRE_TIME,
    });
    refreshToken.refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );
    await refreshToken.save();

    // let cookieOptions = {
    //     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),//with that same expire date
    //     httpOnly: true
    // }
    // res.cookie('refreshToken', `${refreshToken.refreshToken}`, cookieOptions);
    return res.json({ accessToken, refreshToken: refreshToken.refreshToken });
  } catch (error) {
    return res.status(401).json({ error: "Invalid refresh token " });
  }
};

exports.loadMe = async (req, res) => {
  //loadme execute only when CRM is reloaded/after login nd web sockets makes new connection,  so we have to save new socketid for socket maping
  req.io.once("connection", async (socket) => {
    console.log(socket.id, "connected");
    // disconnect is fired when a client leaves the server
    const newSocketMapping = new SocketMapping({
      user: req.admin._id,
      socketId: socket.id,
    });
    let notificationObjOfAdmin = await Notification.findOne({
      admin: req.admin._id,
    });
    socket.emit("tx", { hello: "world" });
    if (notificationObjOfAdmin) {
      socket.emit("notification", {
        noOfUnseen: notificationObjOfAdmin.noOfUnseen,
      });
    }
    await newSocketMapping.save();
    socket.on("disconnect", async () => {
      await SocketMapping.findOneAndRemove({ socketId: socket.id });
      console.log("user disconnected");
    });
  });
  res.json({ admin: req.admin });
};

exports.forgotPassword = async (req, res) => {
  if (!req.body) return res.status(400).json({ error: "No request body" });
  if (!req.body.email)
    return res.status(400).json({ error: "No Email in request body" });

  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin)
    return res.status(404).json({
      error: "Admin with that email does not exist!",
    });

  const token = jwt.sign(
    { _id: admin._id },
    process.env.JWT_EMAIL_VERIFICATION_KEY,
    { expiresIn: process.env.EMAIL_TOKEN_EXPIRE_TIME }
  );
  const mailingData = {
    from: "Ecom",
    to: admin.email,
    subject: "Password reset Link",
    html: `<p>Hi, ${admin.name} . </p></br>
                    <a href="${process.env.ADMIN_CRM_ROUTE}/reset-password?token=${token}">Click me to reset your password</a>`,
  };

  await admin.updateOne({ resetPasswordLink: token });
  await sendEmail(mailingData);
  res.status(200).json({
    msg: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
  });
};

exports.resetPassword = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  let admin = await Admin.findOne({ resetPasswordLink });
  // if err or no admin
  if (!admin || (admin && !admin.resetPasswordLink))
    return res.status(404).json({
      error: "Invalid Link!",
    });

  const updatedFields = {
    password: newPassword,
    resetPasswordLink: "",
  };

  admin = _.extend(admin, updatedFields);
  admin.updated = Date.now();

  await admin.save();
  res.json({
    msg: `Great! Now you can login with your new password.`,
  });
};

// authentication middleware
exports.auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  try {
    if (token) {
      const user = parseToken(token);
      if (user._id) {
        const admin = await Admin.findById(user._id).select("-password -salt");
        if (admin) {
          if (!admin.isBlocked) {
            req.admin = admin;
            return next();
          }
          throw "Your account has been blocked";
        }
        throw "Invalid Admin";
      }
      throw user.error;
    }
    throw "Token not found";
  } catch (error) {
    console.log("******AUTH ERROR******");
    console.log(error);
    res.status(401).json({ error: error });
  }
};
function parseToken(token) {
  // console.log('parseToken in admin/auth',token.split(' ')[1]);
  try {
    return jwt.verify(token, process.env.JWT_SIGNIN_KEY);
  } catch (error) {
    return { error: error.message };
  }
}

// has authorization middleware
exports.hasAuthorization = async (req, res, next) => {
  try {
    const sameAdmin =
      req.profile &&
      req.admin &&
      req.profile._id.toString() === req.admin._id.toString();
    const superadmin = req.admin && req.admin.role === "superadmin";
    const canAccess = superadmin || sameAdmin;
    if (canAccess) {
      return next();
    }
    throw "Admin is not authorized to perform this action";
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
exports.isSuperAdmin = async (req, res, next) => {
  try {
    const isSuperAdmin = req.admin && req.admin.role === "superadmin";
    if (isSuperAdmin) {
      return next();
    }
    throw "Unauthorized Admin";
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
exports.isAdmin = async (req, res, next) => {
  try {
    const isAdmin = req.admin && req.admin.role === "admin";
    if (isAdmin) {
      return next();
    }
    throw "Unauthorized Admin";
  } catch (error) {
    res.status(401).json({ error: error });
  }
};

exports.checkAdminSignin = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (token) {
    const admin = parseToken(token);
    if (admin.error === "jwt expired") {
      return res.json(admin); //{error:'jwt expired'}
    }
    const foundUser = await Admin.findById(admin._id).select("name role");
    if (foundUser) {
      if (!foundUser.isBlocked) {
        req.authAdmin = foundUser;
      }
    }
  }
  next();
};
