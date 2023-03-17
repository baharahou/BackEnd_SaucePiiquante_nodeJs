const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/User');

router.post('/signup', UserCtrl.signup);
router.post('/login', UserCtrl.login);

module.exports = router;