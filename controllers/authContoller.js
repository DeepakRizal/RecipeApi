const User = require("./../modal/userModal");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const catchAsync = require("./../utils/catchAsyc");
const AppError = require("./../utils/AppError");

const signToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
};

const createSendToken = (res, user, statuscode) => {
  const token = signToken(user._id, user.email);

  user.password = undefined;

  res.status(statuscode).json({
    token,
    user,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  let { username, password, passwordConfirm, email } = req.body;

  let user = await User.findOne({ email: email });

  if (user) {
    return next(new AppError("email has already been used", 409));
  }

  let hashedpassword = await bcrypt.hash(password, 10);

  if (password !== passwordConfirm) {
    return next(
      new AppError("Password and PasswordConfirm are not the same", 400)
    );
  }

  const newUser = await User.create({
    username: username,
    email: email,
    password: hashedpassword,
    passwordConfirm: passwordConfirm,
  });

  createSendToken(res, newUser, 201);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Invalid Cridentials", 401));
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return next(new AppError("Invalid Cridentials", 401));
  }

  createSendToken(res, user, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(
      new AppError(
        "You are not logged in or signed up to access this route",
        403
      )
    );
  }

  // Verify the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // Check if the user ID from the token matches the ID in the request parameters
  if (req.body.userId !== decoded.id) {
    return next(
      new AppError(
        "You are not logged in or signed up to access this route",
        403
      )
    );
  }
  // Attach the user's ID to the request for further use
  req.userId = decoded.id;
  next();
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, passwordConfirm } = req.body;

  const user = await User.findById(req.body.userId).select("+password");
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Current password is incorrect.", 401));
  }

  if (newPassword !== passwordConfirm) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  let hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  res.status(200).json({
    message: "Your password has been changed successfully",
  });
});
