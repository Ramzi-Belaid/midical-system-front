const Admin = require('../models/signUP-admin')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

// ✅ تسجيل المسؤول الجديد
const signUpAdmin = async (req, res) => {
    try {
        const { fullName, email, password, clinic } = req.body

        // 🔹 التحقق من جميع الحقول المطلوبة
        if (!fullName || !email || !password || !clinic) {
            throw new BadRequestError('All fields are required')
        }

        // 🔹 التأكد من عدم وجود المستخدم مسبقًا
        const existingAdmin = await Admin.findOne({ email })
        if (existingAdmin) {
            throw new BadRequestError('Email is already in use')
        }

        // 🔹 إنشاء المسؤول وتشفير كلمة المرور تلقائيًا
        const admin = await Admin.create(req.body)

        // 🔹 إنشاء التوكن وإرجاعه
        const token = admin.createJWT()
        res.status(StatusCodes.CREATED).json({ msg: "Admin registered successfully", token })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    }
}

// ✅ تسجيل الدخول
const login = async (req, res) => {
    try {
        const { fullName, password } = req.body

        // 🔹 التحقق من إدخال البيانات
        if (!fullName || !password) {
            throw new BadRequestError('Please provide fullName and password')
        }

        // 🔹 البحث عن المسؤول باستخدام `fullName`
        const admin = await Admin.findOne({ fullName })
        if (!admin) {
            throw new UnauthenticatedError('Invalid Credentials')
        }

        // 🔹 التحقق من صحة كلمة المرور
        const isPasswordCorrect = await admin.comparePassword(password)
        if (!isPasswordCorrect) {
            throw new UnauthenticatedError('Invalid Credentials')
        }
        // 🔹 إنشاء التوكن وإرجاعه
        const token = admin.createJWT()
        res.status(StatusCodes.OK).json({ fullName: admin.fullName, token })
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: error.message })
    }
}

module.exports = { signUpAdmin , login }
