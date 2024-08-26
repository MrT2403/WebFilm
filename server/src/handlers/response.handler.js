const responseWithData = (res, statusCode, data) => {
  return res.status(statusCode).json(data);
};

const error = (res, message = "Something wrong, Boss!") => {
  return responseWithData(res, 500, {
    status: 500,
    message,
  });
};

const badrequest = (res, message) => {
  return responseWithData(res, 400, {
    status: 400,
    message,
  });
};

const ok = (res, data) => {
  return responseWithData(res, 200, data);
};

const created = (res, data) => {
  return responseWithData(res, 201, data);
};

const unauthorize = (res, message = "Unauthorized, Boss!") => {
  return responseWithData(res, 401, {
    status: 401,
    message,
  });
};

const notfound = (res, message = "Resource not found, Boss!") => {
  return responseWithData(res, 404, {
    status: 404,
    message,
  });
};

export default {
  error,
  badrequest,
  ok,
  created,
  unauthorize,
  notfound,
};
