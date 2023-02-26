const { createHttpException } = require("../../helpers");
const { UserModel } = require("../../models");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../../services/jwt");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const { sendVerificationLetter } = require("../../services/email");

const signUp = async (req, res, next) => {
  const unauthorizedMessage = "User already exists";

  const { email, password, subscription } = req.body;

  const avatarURL = gravatar.url(email);

  const emailVerificationToken = nanoid(30);

  const passwordHash = await bcrypt.hash(password, 10);

  const userInstance = await UserModel.create({
    email,
    passwordHash,
    subscription,
    avatarURL,
    emailVerificationToken,
  }).catch(() => {
    throw createHttpException(409, unauthorizedMessage);
  });

  await sendVerificationLetter(email, emailVerificationToken);

  const accessToken = createAccessToken({ userId: userInstance._id });

  res.status(201).json({
    accessToken,
  });
};

module.exports = {
  signUp,
};
