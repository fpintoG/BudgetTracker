const loginRouter = require('./login_router');
const transactionRouter = require('./transaction_router');

module.exports = (app) => {
  app.use('/api/v1', loginRouter);
  app.use('/api/v1', transactionRouter);
}