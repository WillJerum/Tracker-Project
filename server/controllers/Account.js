const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');
const settingsPage = (req, res) => res.render('settings');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !password || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (password !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(password);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

// Function to change a user's password
// Only accessible when logged in
const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required!' });
  }

  try {
    const account = await Account.findOne({ _id: req.session.account._id }).exec();
    if (!account) {
      return res.status(404).json({ error: 'Account not found!' });
    }

    const hashedPassword = await Account.generateHash(newPassword);
    account.password = hashedPassword;
    await account.save();

    return res.json({ message: 'Password changed successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while changing the password!' });
  }
};

module.exports = {
  loginPage,
  logout,
  login,
  signup,
  settingsPage,
  changePassword,
};
