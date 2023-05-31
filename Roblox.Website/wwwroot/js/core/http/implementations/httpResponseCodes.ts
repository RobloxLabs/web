enum HttpResponseCodes {
  ok = 200,
  accepted = 202,
  movedPermanently = 301,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  methodNotAllowed = 405,
  conflict = 409,
  payloadTooLarge = 413,
  tooManyAttempts = 429,
  serverError = 500,
  serviceUnavailable = 503
}

export default Object.freeze(HttpResponseCodes);
