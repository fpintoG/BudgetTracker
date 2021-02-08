const loginRouter = require('./login_router');
const budgetRouter = require('./budget_router');
const dailyBudgetRouter = require('./daily_budget_router')
const transactionRouter = require('./transaction_router');

module.exports = (app) => {
	app.use('/api/v1', loginRouter);
	app.use('/api/v1', budgetRouter);
	app.use('/api/v1', dailyBudgetRouter);
	app.use('/api/v1', transactionRouter);
}