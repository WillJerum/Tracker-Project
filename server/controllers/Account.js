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

// Function to handle user signup
const signup = async (req, res) => {
  const {
    username, pass, pass2, premium,
  } = req.body;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({
      username,
      password: hash,
      premium: premium || false, // Default to false if not provided
    });
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

const getUserStatus = (req, res) => {
  return res.json({ isPremium: req.session.account.premium });
};

module.exports = {
  loginPage,
  logout,
  login,
  signup,
  settingsPage,
  changePassword,
  getUserStatus,
};
