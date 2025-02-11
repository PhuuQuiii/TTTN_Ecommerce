const axios = require("axios");
const User = require("../models/User");
const RefreshToken = require("../models/RefereshToken");
const { sendEmail } = require("../middleware/helpers");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Address = require("../models/Address");

// Đăng ký
exports.signup = async (req, res) => {
  let userExists = await User.findOne({
    // kiểm tra email
    email: req.body.email,
    loginDomain: "system",
  });
  if (userExists)
    return res.status(403).json({
      error: "Email is taken!",
    });
  const token = jwt.sign(
    // Tạo mã token xác thực email
    { email: req.body.email },
    process.env.JWT_EMAIL_VERIFICATION_KEY,
    { expiresIn: process.env.EMAIL_TOKEN_EXPIRE_TIME }
  );
  req.body.emailVerifyLink = token; // Lưu thông tin người dùng vào database
  let user = new User(req.body);
  user = await user.save();

  const mailingData = {
    from: "Kindeem",
    to: user.email,
    subject: "🔐 Xác minh tài khoản của bạn - Kindeem( team TTTN_16)",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Chào ${user.name},</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản trên <strong>Kindeem</strong>! 🎉</p>
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
    // token: token
  });
};

// verify email link
exports.emailverify = async (req, res) => {
  const { token } = req.query;
  let user = await User.findOne({ emailVerifyLink: token });
  if (!user)
    return res.status(401).json({
      error: "Token is invalid!",
    });
  user.emailVerifyLink = "";
  await user.save();
  res.status(201).json({ msg: "Successfully signup!" });
};

// Đăng nhập
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findByCredentials(email, password);
  if (!user) {
    return res.status(404).json({
      error: "Email or password is invaild.",
    });
  }
  // if (user.emailVerifyLink) {
  //   return res.status(401).json({
  //     error: "Please verify your email address.",
  //   });
  // }
  if (user.isBlocked) {
    // Kiểm tra tài khoản có bị khóa không
    return res.status(401).json({
      error: "Your account has been blocked.",
    });
  }
  const payload = {
    // Tạo payload để sinh JWT token
    _id: user._id,
    name: user.name,
    email: user.email,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SIGNIN_KEY, {
    expiresIn: process.env.SIGNIN_EXPIRE_TIME,
  });
  let refreshToken = {
    refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
  };
  refreshToken = new RefreshToken(refreshToken);
  await refreshToken.save();
  // res.setHeader('Set-Cookie', `refreshToken=${refreshToken.refreshToken}; HttpOnly`);
  return res.json({ accessToken, refreshToken: refreshToken.refreshToken });
};

// Đăng nhập bằng mạng xã hội
exports.socialLogin = async (req, res) => {
  const { name, email, socialPhoto, userID, loginDomain, access_token } =
    req.body;

  if (loginDomain === "google") {
    const resp = await axios
      .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${access_token}`)
      .catch((err) => {
        // console.log(err.response.data, "dcscsc");
        return null;
      });

    if (
      !resp ||
      resp.data.iss !== "accounts.google.com" ||
      resp.data.aud !== process.env.GOOGLE_CLIENT_ID
    ) {
      return res.status(401).json({ error: "Invalid OAuth access token." });
    }
    if (resp.data.sub !== userID) {
      return res.status(401).json({ error: "Invalid userID" });
    }
  }
  let user = await User.findOne({ userID, loginDomain });
  if (!user) {
    // create a new user and login
    user = new User({ name, email, socialPhoto, userID, loginDomain });
    user = await user.save();
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SIGNIN_KEY, {
      expiresIn: process.env.SIGNIN_EXPIRE_TIME,
    });
    let refreshToken = {
      refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
    };
    refreshToken = new RefreshToken(refreshToken);
    await refreshToken.save();
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken.refreshToken}; HttpOnly`);
    return res.json({ accessToken, refreshToken: refreshToken.refreshToken });
  }

  if (user.isBlocked) {
    return res.status(401).json({
      error: "Your account has been blocked.",
    });
  }
  // update existing user with new social info and login
  user = _.extend(user, { name, socialPhoto, email });
  user = await user.save();
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SIGNIN_KEY, {
    expiresIn: process.env.SIGNIN_EXPIRE_TIME,
  });
  let refreshToken = {
    refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
  };
  refreshToken = new RefreshToken(refreshToken);
  await refreshToken.save();
  // res.setHeader('Set-Cookie', `refreshToken=${refreshToken.refreshToken}; HttpOnly`);
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
    });
    if (!refreshToken)
      return res.status(401).json({ error: "Invalid refreshToken" });
    let tokenData = jwt.verify(
      refreshToken.refreshToken,
      process.env.REFRESH_TOKEN_KEY
    );
    const payload = {
      _id: tokenData._id,
      name: tokenData.name,
      email: tokenData.email,
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

exports.forgotPassword = async (req, res) => {
  if (!req.body) return res.status(400).json({ error: "No request body" });
  if (!req.body.email)
    return res.status(400).json({ error: "No Email in request body" });

  const { email } = req.body;
  const user = await User.findOne({ email, loginDomain: "system" });
  if (!user)
    return res.status(404).json({
      error: "User with that email does not exist!",
    });

  const token = jwt.sign(
    //  Tạo token để đặt lại mật khẩu
    { _id: user._id },
    process.env.JWT_EMAIL_VERIFICATION_KEY,
    { expiresIn: process.env.EMAIL_TOKEN_EXPIRE_TIME }
  );

  const mailingData = {
    from: "Ecom Support",
    to: user.email,
    subject: "🔒 Reset Your Password - Action Required",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Xin chào <strong>${user.name}</strong>,</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu bạn đã yêu cầu thao tác này, hãy nhấp vào nút bên dưới để tạo mật khẩu mới:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.CLIENT_URL}/reset-password?token=${token}" 
           style="background-color: #007bff; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          🔑 Đặt lại mật khẩu
        </a>
      </div>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này. Mật khẩu của bạn vẫn an toàn.</p>
      <p>Cảm ơn bạn,<br><strong>Đội ngũ hỗ trợ Ecom</strong></p>
    </div>
  `,
  };

  await user.updateOne({ resetPasswordLink: token }); // Lưu token vào database, xác thực token khi người dùng đặt lại mật khẩu

  console.log(token); // test lấy token đổi mật khẩu khi còn web còn local

  await sendEmail(mailingData);
  res.status(200).json({
    msg: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
  });
};

exports.resetPassword = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  let user = await User.findOne({ resetPasswordLink });
  // if err or no user
  if (!user || (user && !user.resetPasswordLink))
    return res.status(404).json({
      error: "Invalid Link!",
    });

  const updatedFields = {
    // Cập nhật mật khẩu mới và xóa token đặt lại mật khẩu
    password: newPassword,
    resetPasswordLink: "",
  };

  user = _.extend(user, updatedFields); // Ghi đè dữ liệu cũ của user
  // user.updated = Date.now();

  // Gửi email thông báo thành công
  const mailingData = {
    from: "Ecom Support",
    to: user.email,
    subject: "🔔 Mật khẩu của bạn đã được thay đổi",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Xin chào <strong>${user.name}</strong>,</p>
        <p>Mật khẩu của bạn đã được thay đổi thành công. Nếu bạn không thực hiện thao tác này, vui lòng liên hệ ngay với bộ phận hỗ trợ.</p>
        <p>Nếu bạn yêu cầu đổi mật khẩu, bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.</p>
        <p>Cảm ơn bạn,</p>
        <p><strong>Đội ngũ hỗ trợ Ecom</strong></p>
      </div>
    `,
  };

  await sendEmail(mailingData);

  await user.save();
  res.json({
    msg: `Great! Now you can login with your new password.`,
  });
};

// authentication middleware
exports.auth = async (req, res, next) => {
  // Kiểm tra xem người dùng có hợp lệ và không bị khóa tài khoản không
  const token = req.header("x-auth-token");
  try {
    if (token) {
      const u = parseToken(token);
      if (u._id) {
        const user = await User.findById(u._id).select("-password -salt");
        if (user) {
          if (!user.isBlocked) {
            // Kiểm tra tài khoản có bị khóa không
            req.user = user;
            return next();
          }
          throw "Your account has been blocked";
        }
        throw "Invalid User";
      }
      throw u.error;
    }
    throw "Token not found";
  } catch (error) {
    console.log("******AUTH ERROR******");
    console.log(error);
    res.status(401).json({ error: error });
  }
};

function parseToken(token) {
  // Giải mã token

  // console.log('parseToken in user/auth',token.split(' ')[1]);
  try {
    return jwt.verify(token, process.env.JWT_SIGNIN_KEY);
  } catch (error) {
    return { error: error.message };
  }
}

//checkUserSignin
exports.checkUserSignin = async (req, res, next) => {
  // Kiểm tra xem token có hợp lệ không, có bị hết hạn không, và gán thông tin người dùng vào req.authUser.
  const token = req.header("x-auth-token");
  if (token) {
    const user = parseToken(token);
    if (user.error === "jwt expired") {
      return res.json(user); //{error:'jwt expired'}
    }
    const foundUser = await User.findById(user._id).select("name");
    if (foundUser) {
      if (!foundUser.isBlocked) {
        req.authUser = foundUser;
      }
    }
  }
  next();
};
