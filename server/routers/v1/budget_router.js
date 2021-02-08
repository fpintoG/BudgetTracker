const express = require('express');
const { createBudget, 
        modifyBudget,
        getActualBudget,
	    getBugdetByRange,
		deactivateBudget } = require('../../controller/v1/budget_controller');
const { getActualBudgetId, 
	   checkActiveBudget } = require('../../middleware/budget')
const { isAuth, 
        isAdmin, 
        isPremium } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 *
 * /budget:
 *   post:
 *     summary: Create a new budget if it is a valid one (Date format YYYY/MM/DD).
 *     consumes:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: budget
 *         in: body
 *         schema:
 *           type: object
 *           required: 
 *             - start_date
 *             - end_date
 *             - categories
 *           properties:
 *             start_date:
 *               type: string
 *             end_date:
 *               type: string
 *             categories:
 *               type: array
 *               items:
 *                 category_name:
 *                   type: string
 *                 max_amount:
 *                   type: integer     
 *           example:
 *             start_date: 2021/02/05
 *             end_date: 2021/03/01
 *             categories: 
 *               - category_name: comida
 *                 max_amount: 200000
 *               - category_name: transporte
 *                 max_amount: 100000
 *               - category_name: deporte
 *                 max_amount: 100000
 *               - category_name: arriendo
 *                 max_amount: 300000
 *               - category_name: estudios
 *                 max_amount: 100000 
 *               - category_name: imprevistos
 *                 max_amount: 200000 
 *     responses:
 *       200:
 *         description: Budget sucessfully added.
 *       400:
 *         description: There was a problem validating budget.             
 */
router.post('/budget', [isAuth, 
                        isPremium, 
                        getActualBudgetId, 
                        checkActiveBudget], createBudget);

/**
 * @swagger
 *
 * /modifyBudget:
 *   post:
 *     summary: Take disponible amount from one category to another.
 *     consumes:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: modify
 *         in: body
 *         schema:
 *           type: object
 *           required: 
 *             - category_start
 *             - category_dest
 *             - amount
 *           properties:
 *             category_start:
 *               type: string
 *             category_dest:
 *               type: string
 *             amount:
 *               type: integer
 *           example:
 *              category_start: transporte
 *              category_dest: comida
 *              amount: 10000
 *     responses:
 *       200:
 *         description: Budget sucessfully updated.
 *       400:
 *         description: There was a problem validating budget update.             
 */
router.post('/modifyBudget', [isAuth, 
                            isPremium, 
                            getActualBudgetId], modifyBudget);

/**
 * @swagger
 *
 * /budget:
 *   get:
 *     summary: Get actual or last budget asociated with the user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Budget data sucessfully returned.
 *       400:
 *         description: There was a problem finding budget.             
 */
router.get('/budget', [isAuth, 
					   isPremium, 
					   getActualBudgetId], getActualBudget);

/**
 * @swagger
 *
 * /budgets:
 *   get:
 *     summary: Get budgets in a date range (Date must be in format YYYY-MM-DD).
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
 *         description: Budget data sucessfully returned.
 *       400:
 *         description: Could not find budgets in this range.             
 */
router.get('/budgets', [isAuth, isPremium], getBugdetByRange);

/**
 * @swagger
 *
 * /budget:
 *   delete:
 *     summary: Deactivate actual or last budget asociated with the user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Budget data sucessfully deactivate.
 *       400:
 *         description: There was a problem finding budget.             
 */
router.delete('/budget', [isAuth, 
					      isPremium, 
					      getActualBudgetId], deactivateBudget);

module.exports = router;