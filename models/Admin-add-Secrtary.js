const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const SecrtarySchema = new mongoose.Schema({
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
        
    phone: {
        type: String,
        required: [true, 'Please provide phone'],
        match: /^[0-9]+$/, // يقبل فقط الأرقام
        unique: true,
        },
        schedule: {
            type: String,
            required: true,
            trim: true,
            match: /^([0-9]{1,2}:\d{2} (AM|PM)) - ([0-9]{1,2}:\d{2} (AM|PM))$/  
            },
            adminId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'Please provide Admin'],
        }   
},{ timestamps: true })

SecrtarySchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

SecrtarySchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

const Secrtary = mongoose.model('Secrtary', SecrtarySchema);
module.exports = Secrtary;


