const express = require('express');
const { listByActualBudget, 
        getByDate } = require('../../controller/v1/daily_budget_controller');
const { getActualBudgetId, getBudgetIdByDate } = require('../../middleware/budget')
const { isAuth, isPremium } = require('../../middleware/auth');

const router = express.Router();

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
 * /dailyBudgets:
 *   get:
 *     summary: Get daily budgets of autentificated user in a date range (Date must be in format YYYY-MM-DD).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         type: string
 *         required: true
 *         schema:
 *           example: 2021-01-01  
 *       - in: query
 *         name: end_date
 *         type: string
 *         required: true  
 *         schema:
 *           example: 2021-04-01 
 *     responses:
 *       200:
 *         description: Daily budget data sucessfully returned.
 *       400:
 *         description: There was a problem finding daily budget.             
 */
router.get('/dailyBudgets', [isAuth, 
							isPremium, 
							getBudgetIdByDate], getByDate);



module.exports = router;