const controllers = require('./controllers');
const mid = require('./middleware');

console.log('controllers:', controllers);

const router = (app) => {
  app.get('/getTasks', mid.requiresLogin, controllers.Task.getTasks);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Task.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Task.makeTask);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
