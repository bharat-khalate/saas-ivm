class AppError extends Error {
    userMessage: string;
    statusCode: number;
    isOperational: boolean;
    constructor(userMessage: string, technicalMessage: string, statusCode = 500) {
        super(technicalMessage); // for internal logs
        this.userMessage = userMessage; // safe message for users
        this.statusCode = statusCode;
        this.isOperational = true; // distinguish operational vs programming errors
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;