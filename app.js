require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectdb=require('./db/connectdb')
const authentication=require('./middelware/authentication')

const adminSingup=require('./router/signUP-admin')
const adminAddDr=require('./router/Admin-add-dr')
const adminAddSC=require('./router/Admin-add-Secrtary')




// error handler
const notFound = require('./middelware/notFound'); // 404 middleware
const errHandelleMiddelware = require('./middelware/errHandelleMiddelware');
const { getAllDr } = require('./controller/Admin-add-dr');
// Middleware
app.use(express.json());  // ✅ ضروري لتحليل البيانات القادمة من Body
app.use(express.urlencoded({ extended: true })); // ✅ لتحليل البيانات المرسلة من forms


// routers
app.use('/api/v1/Admin', adminSingup);
app.use('/api/v1/Admin/doctors',adminAddDr); // إدارة الأطباء، مع التحقق من صلاحيات الـ Admin
app.use('/api/v1/Admin/Secrtary',adminAddSC);



app.use(notFound);
app.use(errHandelleMiddelware);

PORT=process.env.PORT||5000


app.get('/',(req,res)=>{
    res.send('hello')
})




const start = async () => {
    try {
        await connectdb(process.env.MONGO_URI);
        app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
        );
    } catch (error) {
        console.log(error);
    }
    };
    start();