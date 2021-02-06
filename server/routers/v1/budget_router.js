const express = require('express');
const { getActualBudgetId, 
        checkActiveBudget,
        createBudget, 
        modifyBudget } = require('../../controller/v1/budget_controller');
const { isAuth, 
        isAdmin, 
        isPremium } = require('../../middleware/auth');

const router = express.Router();

router.post('/budget', [isAuth, 
                        isPremium, 
                        getActualBudgetId, 
                        checkActiveBudget], createBudget);
router.post('/changeBudget', [isAuth, 
                            isPremium, 
                            getActualBudgetId], modifyBudget);

module.exports = router;