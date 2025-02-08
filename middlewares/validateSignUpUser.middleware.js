const { userSignUpValidationSchema } = require("../schema");
const ApiError = require("../utils/ApiError");

const validateSignUpUser = (req, res, next) => {
  const { error } = userSignUpValidationSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ApiError(401, errMsg);
  } else {
    next();
  }
};

module.exports = validateSignUpUser;
