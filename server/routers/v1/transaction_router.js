const express = require('express');

const { listByDailyBudget, makeTransaction } = require('../../controller/v1/transaction_controller');

const router = express.Router();

router.post('/transaction', makeTransaction);
router.get('/transactions', listByDailyBudget)
module.exports = router;
