// a method that helps in catching errors inside async
// middleware functions

// without that async func will raise an unhandled rejection
// and server won't respond with status: 500

// more info: https://stackoverflow.com/a/51391081/3191478

export const asyncHandler = fn => (req, res, next) => {
  return Promise
      .resolve(fn(req, res, next))
      .catch(next);
};
