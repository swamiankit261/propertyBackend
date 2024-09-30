const asyncHandler = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(error => next(error));
};

module.exports = asyncHandler;
