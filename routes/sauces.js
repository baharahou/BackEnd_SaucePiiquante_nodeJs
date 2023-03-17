const express = require('express');
const router = express.Router();
const SauceCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

router.post('/',auth, multer, SauceCtrl.CreateSauce);
router.get('/',auth, SauceCtrl.GetAllSauce);
router.get('/:id',auth, SauceCtrl.GetOneSauce);
router.put('/:id',auth, multer, SauceCtrl.UpdateSauce);
router.delete('/:id',auth, SauceCtrl.DeleteSauce);
router.post('/:id/like',auth, SauceCtrl.AddLikeOrDislike);

module.exports = router;