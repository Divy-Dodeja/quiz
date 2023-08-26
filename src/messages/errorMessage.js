//Error message
exports.errorMessage = (error, message, code) => {
  const response = { statusCode: 400 || code };
  if (error) {
    response.message = error.message;
  } else {
    response.message = message;
  }
  return response;
};
