const express = require('express')
const router = express.Router()
const authenticateUser = require('../middelware/authentication')

const {addDrAdmin,getAllDr,deletDr} = require('../controller/Admin-add-dr')

router.route('/').get(authenticateUser, getAllDr); // حماية المسار
router.route('/addDr').post(authenticateUser, addDrAdmin); // حماية الإضافة
router.route('/:id').delete(authenticateUser, deletDr);


module.exports = router
