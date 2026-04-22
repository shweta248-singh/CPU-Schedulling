const express = require('express');
const router = express.Router();
const { simulate, getHistory } = require('../controllers/simulationController');

router.post('/simulate', simulate);
router.get('/history', getHistory);

module.exports = router;
