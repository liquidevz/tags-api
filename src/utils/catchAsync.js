/**
 * Wrapper function to catch async errors in route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
exports.catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
