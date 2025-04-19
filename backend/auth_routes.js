const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authMiddleware = require('./middlewares/auth_middleware');
const User = require('./models/User');
const Favorite = require('./models/Favorite');
const axios = require('axios');
const JWT_SECRET = "artsy_proj";
const app = express.Router();

app.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const hash = crypto.createHash('sha256');
    hash.update(email.trim().toLowerCase());
    const hashedEmail = hash.digest('hex');
    const profileImageUrl = `https://www.gravatar.com/avatar/${hashedEmail}?s=80&d=identicon`;

    try {
        const user = new User({ fullname, email, password: hashedPassword, profileImageUrl });
        const result = await user.save();
        const token = jwt.sign({ id: result._id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }).json(result);
    } catch (error) {
      console.log(error.message);
        res.status(400).json({ error: 'User already exists' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(400).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }).json(user);
    }
    catch(error) {
      console.log(error.message);
      res.status(500).json({ error: 'Server Error while logging in.' });
    }
});

// User Logout
app.get('/logout', authMiddleware, (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out' });
});

// Delete Account
app.delete('/delete', authMiddleware, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.user.id);
      await Favorite.deleteMany({ userId: req.user.id });
      res.clearCookie('token').json({ message: 'Account deleted' });
    } catch(error) {
      console.log(error);
      res.status(500).json({ error: 'Error deleting account' });
    }
});

module.exports = app;