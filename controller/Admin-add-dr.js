const Dr=require('../models/Admin-add-dr')
const { StatusCodes } = require('http-status-codes')
const {NotFoundError,BadRequestError}=require('../errors')
const addDrAdmin = async (req,res)=>{
    req.body.adminId = req.user.userId
    const Doctor = await Dr.create(req.body)
    const token = Doctor.createJWT()

    res.status(StatusCodes.CREATED).json({success:true,token  })
}
const getAllDr = async (req,res)=>{
    const adminId = req.user.userId;
    const allDr = await Dr.find({ adminId }) // تصحيح اسم الحقل
        .sort('createdAt')
        .select('fullName email specialization phone');

        if (allDr.length ===0){
            throw new NotFoundError('No dectors found!')
        }

    res.status(StatusCodes.OK).json({ success: true, count: allDr.length, allDr });
}
const deletDr = async (req,res)=>{
    const { 
        user: { userId }, 
        params: { id } 
    } = req;

    // البحث عن الطبيب وحذفه فقط إذا كان تابعًا لهذا المسؤول
    const doctor = await Dr.findOneAndDelete({ _id: id, adminId: userId });

    if (!doctor) {
        throw new NotFoundError(`No dector with id ${id} found!`)
    }

    res.status(StatusCodes.OK).json({ success: true, msg: 'Doctor deleted successfully' });
}


module.exports={addDrAdmin,getAllDr,deletDr}