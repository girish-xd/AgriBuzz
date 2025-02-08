const { userLoginValidationSchema } = require("../schema");
const ApiError = require("../utils/ApiError");

const validateLoginUser = (req, res, next) => {
  const { error } = userLoginValidationSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ApiError(400, errMsg);
  } else {
    next();
  }
};

module.exports = validateLoginUser;
