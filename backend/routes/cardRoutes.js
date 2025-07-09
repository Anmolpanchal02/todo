const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

router.get('/', async (req, res) => {
  const cards = await Card.find().sort({ createdAt: -1 });
  res.json(cards);
});

router.post('/', async (req, res) => {
  const card = new Card(req.body);
  const saved = await card.save();
  res.json(saved);
});

// ✅ Make sure this route is written correctly:
router.delete('/:id', async (req, res) => {
  await Card.findByIdAndDelete(req.params.id);
  res.json({ message: 'Card deleted' });
});

module.exports = router;
