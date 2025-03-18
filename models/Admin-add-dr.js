const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const DoctorSchema = new mongoose.Schema({
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
    specialization: { 
        type: String,
        required: [true, 'Please provide specialization'],
        maxlength:60,
        minlength:3,
        trim:true
        },
    phone: {
            type: String,
            required: [true, 'Please provide phone'],
            match: /^[0-9]+$/, // يقبل فقط الأرقام
            unique: true,
    },
    location: {
        type: String,
        required: [true, 'Please provide location'],
        trim: true,
        maxlength:60,
        minlength:3,
        match: /^[a-zA-Z0-9\s,.-]+$/  // يسمح بالأحرف، الأرقام، المسافات، الفاصلة، النقطة، والشرطة
    },
    yearsOfExperience: { 
        type: Number,
        required: [true, 'Please provide years  Of Experience'],

    }, 
    price: { 
        type: Number,
        required: [true, 'Please provide price'],

    },
    service:{
        type: String,
        required: [true, 'Please provide service'],
        trim: true,
        maxlength:60,
        minlength:3,
    },
    adminId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: [true, 'Please provide Admin'],
    } // يربط الطبيب بالمسؤول الذي أضافه
},{ timestamps: true });

DoctorSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

DoctorSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

const Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;
