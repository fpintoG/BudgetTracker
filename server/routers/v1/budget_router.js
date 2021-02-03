const express = require('express');
const { createBudget, modifyBudget } = require('../../controller/v1/budget_controller');

const router = express.Router();

router.post('/budget', createBudget);
router.post('/changeBudget', modifyBudget);

module.exports = router;