const SC = require('../models/Admin-add-Secrtary')
const { StatusCodes } = require('http-status-codes')
const {NotFoundError,}=require('../errors')
const addSCAdmin = async (req,res)=>{
    req.body.adminId = req.user.userId
    const Secrtary = await SC.create(req.body)
    const token = Secrtary.createJWT()
    res.status(StatusCodes.CREATED).json({ success:true, token  })
}
const getAllSC = async (req,res)=>{
    const adminId = req.user.userId;
    const allSC = await SC.find({ adminId }) // تصحيح اسم الحقل
        .sort('createdAt')
        .select('fullName email  phone schedule ')
        if (allSC.length ===0){
            throw new NotFoundError('No Secrtary found!')
        }

    res.status(StatusCodes.OK).json({ success: true, count: allSC.length, allSC });
}
const deletSC = async (req,res)=>{
    const { 
        user: { userId }, 
        params: { id } 
    } = req;

    // البحث عن الطبيب وحذفه فقط إذا كان تابعًا لهذا المسؤول
    const Secrtary = await SC.findOneAndDelete({ _id: id, adminId: userId });

    if (!Secrtary) {
        throw new NotFoundError(`No dector with id ${id} found !`)
    }

    res.status(StatusCodes.OK).json({ success: true, msg: 'Secrtary deleted successfully' });
}


module.exports={addSCAdmin,getAllSC,deletSC}