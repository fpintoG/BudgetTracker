const express = require('express');
const { listByActualBudget, 
        addBudgetDate, 
        getByDate } = require('../../controller/v1/daily_budget_controller');
const { getActualBudgetId, getBudgetIdByDate } = require('../../middleware/budget')
const { isAuth, isPremium } = require('../../middleware/auth');

const router = express.Router();

router.param('budgetDate', addBudgetDate)

/**
 * @swagger
 *
 * /currentDailyBudgets:
 *   get:
 *     summary: Get daily budgets associated to actual user budget.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Budget data sucessfully returned.
 *       400:
 *         description: There was a problem finding budget.             
 */
router.get('/currentDailyBudgets', [isAuth, 
                                    isPremium, 
                                    getActualBudgetId], listByActualBudget);


/**
 * @swagger
 *
 * /dailyBudget/{budgetDate}:
 *   get:
 *     summary: Get daily budget by date for that user (Date must be in format YYYY-MM-DD).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetDate
 *         required: true
 *         schema:
 *           type: string
 *           example: 2021-02-17
 *     responses:
 *       200:
 *         description: Daily budget data sucessfully returned.
 *       400:
 *         description: There was a problem finding daily budget.             
 */
router.get('/dailyBudget/:budgetDate', [isAuth, 
                                        isPremium, 
                                        getBudgetIdByDate], getByDate);



module.exports = router;