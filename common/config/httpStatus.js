module.exports = {
  SUCCESS: {
    statusCode: 200,
    status: true,
  },
  NOT_SUCCESS: {
    statusCode: 422,
    status: false,
  },
  CREATED: {
    statusCode: 201,
    status: true,
  },
  UPDATED: {
    statusCode: 202,
    status: true,
  },
  ENABLED: {
    statusCode: 202,
    status: true,
  },
  DISABLED: {
    statusCode: 202,
    status: true,
  },
  DELETED: {
    statusCode: 202,
    status: true,
  },
  NOT_FOUND: {
    statusCode: 404,
    status: false,
  },
  NON_AUTH_INFORMATION: {
    statusCode: 203,
    status: false,
  },
  ALREADY_EXISTS: { statusCode: 409, status: false },
  ALREADY_DELETED: { statusCode: 409, status: false },
  ALREADY_ENABLED: { statusCode: 409, status: false },
  UNAUTHORIZED: { statusCode: 401, status: false },
  INVALID_ARGUMENT: { statusCode: 422, status: false },
  INTERNAL_SERVER_ERROR: { statusCode: 500, status: false },
  PERMISSION_DENIED: { statusCode: 403, status: false },
  TOO_MANY_ATTEMPTS: { statusCode: 410, status: false },
  THIRD_PARTY_UNAUTHORIZED: { statusCode: 406, status: false },
};
