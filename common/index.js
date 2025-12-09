const commonFunction = require("./config/commonFunction");
const commonVariable = require("./config/commonVariable");
const httpStatus = require("./config/httpStatus");
const servicePath = require("./config/servicePath");

module.exports = {
  ...commonFunction,
  ...commonVariable,
  httpStatus,
  ...servicePath,
};
