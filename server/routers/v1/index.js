const loginRouter = require('./login_router');

module.exports = (app) => {
  app.use('/api/v1', loginRouter);
}