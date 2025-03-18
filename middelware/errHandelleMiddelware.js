const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors/CustomErrorAsync')
const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went worng try agin later' });
};

module.exports = errorHandlerMiddleware;