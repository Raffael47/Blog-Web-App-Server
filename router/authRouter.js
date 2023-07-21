const router = require('express').Router();
const { authController } = require('../controllers');
const { verifyToken } = require('../middleware/auth');
const { checkRegister, checkLogin, checkEmail } = require('../middleware/validator');

router.post('/', checkRegister, authController.register);
router.patch('/verify', verifyToken, authController.verifyUser);
router.post('/login', checkLogin, authController.login);
router.get('/keep', verifyToken, authController.keepLogin);
router.put('/forgot-pass', checkEmail, authController.forgotPassword);

module.exports = router;