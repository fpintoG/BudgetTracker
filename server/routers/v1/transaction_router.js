const express = require('express');

const { listByDailyBudget, makeTransaction } = require('../../controller/v1/transaction_controller');
const { isAuth, isPremium } = require('../../middleware/auth');

const router = express.Router();

router.post('/transaction', isAuth, makeTransaction);
router.get('/transactions', [isAuth, isPremium], listByDailyBudget);
module.exports = router;
