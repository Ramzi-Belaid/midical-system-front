const express = require('express')
const router = express.Router()

const { signUpAdmin , login ,} = require('../controller/signUP-admin')

router.route('/SingUp').post(signUpAdmin)
router.post('/login', login);         // ✅ تسجيل الدخول


module.exports = router
