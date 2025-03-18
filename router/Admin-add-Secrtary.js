const express = require('express')
const router = express.Router()
const authenticateUser = require('../middelware/authentication')

const {getAllSC,addSCAdmin,deletSC} = require('../controller/Admin-add-Secrtary')

router.route('/').get(authenticateUser, getAllSC); // حماية المسار
router.route('/addSC').post(authenticateUser, addSCAdmin); // حماية الإضافة
router.route('/:id').delete(authenticateUser, deletSC);


module.exports = router
