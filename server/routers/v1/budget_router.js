const express = require('express');
const { getActualBudgetId, 
        checkActiveBudget,
        createBudget, 
        modifyBudget } = require('../../controller/v1/budget_controller');
const { isAuth, 
        isAdmin, 
        isPremium } = require('../../middleware/auth');

const router = express.Router();



/**
 * @swagger
 *
 * /budget:
 *   post:
 *     description: Creates a new budget if it is a valid one.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: start_date
 *         in: formData
 *         required: true
 *         type: string
 *       - name: end_date
 *         in: formData
 *         required: true
 *         type: string
 *       - name: max_amount
 *         in: formData
 *         required: true
 *         type: integer   
 *       - name: categories 
 *         in: body     
 *         description: List of categories that will be added to budget.
 *         required: true
 *         schema:
 *           type: array           
 *           items:
 *             - name: category_name
 *               type: string
 *             - name: max_amount
 *               type: integer
 *     responses:
 *       200:
 *         description: Budget suscessfully added.
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
 *     description: It allows making a transaction between categories disponible amounts.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: category_start
 *         in: formData
 *         required: true
 *         type: string
 *       - name: category_end
 *         in: formData
 *         required: true
 *         type: string
 *       - name: amount
 *         in: formData
 *         required: true
 *         type: integer  
 *     responses:
 *       200:
 *         description: Budget suscessfully updated.
 *       400:
 *         description: There was a problem validating budget update.             
 */
router.post('/modifyBudget', [isAuth, 
                            isPremium, 
                            getActualBudgetId], modifyBudget);

module.exports = router;