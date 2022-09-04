const router = require('express').Router();
const {
  createUser,
  findUser,
  getUser,
  refreshProfile,
  refreshAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', findUser);
router.get('/:userId', getUser);
router.patch('/me', refreshProfile);
router.patch('/me/avatar', refreshAvatar);

module.exports = router;
