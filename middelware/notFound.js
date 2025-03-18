const notFound = async (req ,res)=>{
    res.status(404).json({msg:'page note found !!!'})
}

module.exports=notFound