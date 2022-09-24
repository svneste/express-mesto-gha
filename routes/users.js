const router = require('express').Router();
const {
  findUser,
  getUser,
  refreshProfile,
  refreshAvatar,
  getUserInfo,
} = require('../controllers/users');
const {
  validationUpdateUser,
  validationUpdateAvatar,
} = require('../middlewares/validations');

router.get('/', findUser);
router.get('/me', getUserInfo);
router.get('/:userId', getUser);
router.patch('/me', validationUpdateUser, refreshProfile);
router.patch('/me/avatar', validationUpdateAvatar, refreshAvatar);

module.exports = router;
