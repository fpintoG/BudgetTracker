const express = require('express');
const { createBudget } = require('../../controller/v1/budget_controller');

const router = express.Router();

router.post('/budget', createBudget);

module.exports = router;