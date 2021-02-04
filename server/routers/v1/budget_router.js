const express = require('express');
const { createBudget, modifyBudget } = require('../../controller/v1/budget_controller');
const { isAuth, isAdmin, isPremium } = require('../../middleware/auth');

const router = express.Router();

router.post('/budget', isAuth, isPremium, createBudget);
router.post('/changeBudget', modifyBudget);

module.exports = router;