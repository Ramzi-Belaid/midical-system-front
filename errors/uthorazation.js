const CustomAPIError = require('./CustomErrorAsync'); 
const { StatusCodes } = require('http-status-codes'); 

class UnauthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED; // 401
    }
}

module.exports = UnauthorizedError;