const router = require('express').Router();
const { blogController } = require('../controllers');
const { verifyToken } = require('../middleware/auth');
const { multerUpload } = require('../middleware/multer');

router.get('/', blogController.getBlog);
router.post('/', verifyToken, multerUpload('./public/blog', 'blog').single('file'), blogController.createBlog);
router.get('/favourite', blogController.getMostLikedBlog);
router.get('/category', blogController.getCategory);
router.get('/user-blogs', verifyToken, blogController.getUserBlog);
router.post('/like', verifyToken, blogController.likeBlog);
router.get('/like', verifyToken, blogController.getLikedBlog);
router.delete('/like', verifyToken, blogController.unlikeBlog);
router.get('/:id', blogController.getBlogById);
router.delete('/:id', verifyToken, blogController.deleteBlog);

module.exports = router;