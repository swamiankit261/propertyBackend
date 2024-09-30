class ApiError extends Error {
    constructor(statusCode, message = "Bad Request", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode || 500;
        this.data = null;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }

    }
};

module.exports = ApiError;