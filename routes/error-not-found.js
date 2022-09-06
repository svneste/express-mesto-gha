const router = require('express').Router();

router.all('*', (req, res) => {
  res.status(404).send({ message: 'Такой станицы не существует' });
});

module.exports = router;
