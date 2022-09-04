const router = require('express').Router();
const {
  findCards,
  createCard,
  deleteCard,
  addLike,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', findCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
