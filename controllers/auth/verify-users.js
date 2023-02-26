const { createHttpException } = require("../../helpers");
const { UserModel } = require("../../models");
const { sendVerificationLetter } = require("../../services/email");

const verifyUser = async (req, res) => {
  const { email } = req.body;

  const userInstance = await UserModel.findOne({ email });
  if (!userInstance) {
    throw createHttpException(400, "missing required field email");
  }

  if (userInstance.isEmailVerified) {
    throw createHttpException(400, "Verification has already been passed");
  }

  await sendVerificationLetter(email, userInstance.verificationToken);

  res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  verifyUser,
};
