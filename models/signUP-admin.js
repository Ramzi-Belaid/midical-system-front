const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signUPadmin = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide fullName'],
        maxlength: 50,
        minlength: 3,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        trim:true
    },
    clinic: {
        name: {
            type: String,
            required: [true, 'Please provide name Clinc'],
            maxlength: 50,
            minlength: 3,
        },
        address: {
            type: String,
            required: true,
            trim: true,
            match: /^[a-zA-Z0-9\s,.-]+$/  // يسمح بالأحرف، الأرقام، المسافات، الفاصلة، النقطة، والشرطة
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            match: /^[0-9]+$/ // يقبل فقط الأرقام
        },
        workingHours: {
            type: String,
            required: true,
            trim: true,
            match: /^([0-9]{1,2}:\d{2} (AM|PM)) - ([0-9]{1,2}:\d{2} (AM|PM))$/  
        }        
    }
})
signUPadmin.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
signUPadmin.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, fullName: this.fullName }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })
}
signUPadmin.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}



module.exports = mongoose.model('AdminstrateurSignUp', signUPadmin)
