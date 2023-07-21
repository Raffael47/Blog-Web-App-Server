const router = require('express').Router();
const { userController } = require('../controllers')
const { verifyToken } = require('../middleware/auth');
const { multerUpload } = require('../middleware/multer');
const { checkUsername, checkEmail, checkPhone, checkChangePassword, checkResetPassword } = require('../middleware/validator');

router.patch('/change-username', verifyToken, checkUsername, userController.editUsername);
router.patch('/change-email', verifyToken, checkEmail, userController.editEmail);
router.patch('/change-phone', verifyToken, checkPhone, userController.editPhone);
router.patch('/change-pass', verifyToken, checkChangePassword, userController.changePassword);
router.patch('/reset-pass', verifyToken, checkResetPassword, userController.resetPassword);
router.post('/upload-avatar', verifyToken, multerUpload('./public/avatar', 'avatar').single('file'), userController.uploadAvatar);

module.exports = router;