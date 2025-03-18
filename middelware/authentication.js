const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // التحقق من وجود الـ Authorization Header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }

  const token = authHeader.split(' ')[1] // استخراج التوكن

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // التأكد من أن المفتاح هو `userId` وليس `_id`
    req.user = { userId: payload.userId, name: payload.name }
    next() // المتابعة إلى الخطوة التالية
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
